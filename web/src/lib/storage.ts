import { toast } from "vue-sonner";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/firebase.ts";
import type { IService } from "@/models/service.ts";
import { safeAwait } from "@/lib/utils.ts";

export async function getServiceDownloadURL(service: IService) {
  const serviceStorageRef = ref(storage, service.file);
  const [downloadURL, error] = await safeAwait(
    getDownloadURL(serviceStorageRef),
  );
  if (error) {
    console.error(error);
    toast.error("Fout bij het ophalen van de dienst URL");
  }

  return downloadURL;
}
