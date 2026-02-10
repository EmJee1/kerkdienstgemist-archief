import { File } from "@google-cloud/storage";
import axios, { AxiosRequestConfig } from "axios";
import { error } from "firebase-functions/logger";
import * as z from "zod";
import { bucket, firestore } from "../firebase/firebase";
import { IService } from "../models/kerkdienst-gemist";
import { addPastorToIndexIfNotAlreadyExists } from "./pastors-index";
import { KDGServiceModel } from "../models/validation";

export const downloadFromUrl = async (
  url: string,
  options?: AxiosRequestConfig<any>,
): Promise<[any, string]> => {
  const res = await axios.get(url, { responseType: "stream", ...options });
  if (res.status !== 200) {
    throw new Error(`Did not get a valid response from ${url}`);
  }

  return [res.data, res.headers["content-type"]];
};

export const uploadFileToStorage = async (
  data: any,
  fileName: string,
  contentType: string,
): Promise<[string, File]> => {
  const fileLocation = `services/audio/${fileName}`;
  const file = bucket.file(fileLocation);
  const writeStream = file.createWriteStream({ metadata: { contentType } });
  await data.pipe(writeStream);

  return [fileLocation, file];
};

export const getServiceFileName = (service: z.infer<typeof KDGServiceModel>) =>
  service.link.split("/")[service.link.split("/").length - 1].toLowerCase();

export const getServiceId = (service: z.infer<typeof KDGServiceModel>) =>
  getServiceFileName(service).split("-")[0];

export const insertServiceToFirestore = async (
  service: z.infer<typeof KDGServiceModel>,
  location: string,
  file: File,
): Promise<IService> => {
  const docData: IService = {
    title: service.title,
    file: location,
    createdAt: new Date(service.pubDate),
  };

  if (service.itunes.author) {
    docData.pastor = service.itunes.author;
  }

  try {
    const docId = getServiceId(service);
    await firestore.collection("services").doc(docId).set(docData);
    return docData;
  } catch (err) {
    await file.delete();

    error(
      `Error while inserting ${service.title} from date ${service.pubDate}`,
      err,
    );

    throw err;
  }
};

export const serviceExistsInFirestore = async (
  service: z.infer<typeof KDGServiceModel>,
) => {
  const docId = getServiceId(service);
  return (await firestore.collection("services").doc(docId).get()).exists;
};

export const serviceProcessingFlow = async (
  service: z.infer<typeof KDGServiceModel>,
) => {
  const fileName = getServiceFileName(service);

  if (await serviceExistsInFirestore(service)) {
    return false;
  }

  const [rawData, contentType] = await downloadFromUrl(service.enclosure.url);
  const [fileLocation, file] = await uploadFileToStorage(
    rawData,
    fileName,
    contentType,
  );

  const doc = await insertServiceToFirestore(service, fileLocation, file);
  if (doc.pastor) {
    await addPastorToIndexIfNotAlreadyExists(doc.pastor);
  }

  return true;
};
