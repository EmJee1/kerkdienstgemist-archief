import { debug, info, error } from "firebase-functions/logger";
import { onRequest } from "firebase-functions/https";
import { onSchedule } from "firebase-functions/scheduler";
import { getKDGServices } from "./utils/kdg-helpers";
import { bucket } from "./firebase/firebase";
import {
  getExpirationDate,
  getServiceFileName,
  serviceProcessingFlow,
} from "./utils/web-file-helpers";
import { defineSecret, defineString } from "firebase-functions/params";

// Access key for the Kerkdienstgemist RSS feed, playlist ID: 10698
const kerkdienstgemistAccessKey = defineSecret("KERKDIENSTGEMIST_ACCESS_KEY");
const KERKDIENSTGEMIST_PLAYLIST = defineString("KERKDIENSTGEMIST_PLAYLIST_ID");

export const createSignedServiceDownloadUrl = onRequest(async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  const servicePath = req.query.servicePath?.toString();

  if (!servicePath) {
    debug(`Requested signed url without servicePath`);
    res.sendStatus(422);
    return;
  }

  const file = bucket.file(servicePath);

  if (!(await file.exists())[0]) {
    debug(`Requested service '${servicePath}' not found`);
    res.sendStatus(404);
    return;
  }

  try {
    info(`Creating signed url for '${servicePath}'`);

    const signedUrl = await file.getSignedUrl({
      action: "read",
      expires: getExpirationDate({ days: 7 }),
    });

    res.json({ url: signedUrl[0] }).status(200);
  } catch (err) {
    error(err);
    res.sendStatus(500);
  }
});

export const syncRecentServices = onSchedule(
  {
    schedule: "59 23 * * 7",
    timeZone: "Europe/Amsterdam",
    secrets: [kerkdienstgemistAccessKey],
  },
  async () => {
    const items = await getKDGServices({
      playlist: KERKDIENSTGEMIST_PLAYLIST.value(),
      accessKey: kerkdienstgemistAccessKey.value(),
    });

    for (const item of items) {
      try {
        const processed = await serviceProcessingFlow(item);

        if (!processed) {
          info(
            `${getServiceFileName(item)} was not added because it already existed`,
          );

          // if not processed (service already exists in firestore)
          // continue with the next service; this adds some resilience by double-checking services in the past
          continue;
        }

        info(`${getServiceFileName(item)} added`);
      } catch (err) {
        error(err);
      }
    }
  },
);
