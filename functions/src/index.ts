import { info, error } from "firebase-functions/logger";
import { onSchedule } from "firebase-functions/scheduler";
import { getKDGServices } from "./utils/kdg-helpers";
import {
  getServiceFileName,
  serviceProcessingFlow,
} from "./utils/web-file-helpers";
import { defineSecret, defineString } from "firebase-functions/params";
import { KDGServiceArrayModel } from "./models/validation";

// Access key for the Kerkdienstgemist RSS feed
const kerkdienstgemistAccessKey = defineSecret("KERKDIENSTGEMIST_ACCESS_KEY");
const KERKDIENSTGEMIST_PLAYLIST = defineString("KERKDIENSTGEMIST_PLAYLIST_ID");

export const syncRecentServices = onSchedule(
  {
    schedule: "59 23 * * 7",
    timeZone: "Europe/Amsterdam",
    secrets: [kerkdienstgemistAccessKey],
  },
  async () => {
    info("Starting sync recent services");

    const response = await getKDGServices({
      playlist: KERKDIENSTGEMIST_PLAYLIST.value(),
      accessKey: kerkdienstgemistAccessKey.value(),
    });

    const result = KDGServiceArrayModel.safeParse(response);
    if (!result.success) {
      error(
        "Failed to parse Kerkdienstgemist RSS Feed into expected data model",
        result.error.issues,
      );

      return;
    }

    info(
      `Fetched ${result.data.length} services from Kerkdienstgemist RSS Feed`,
    );

    for (const service of result.data) {
      try {
        const processed = await serviceProcessingFlow(service);

        if (!processed) {
          info(
            `${getServiceFileName(service)} was not added because it already existed`,
          );

          // if not processed (service already exists in firestore)
          // continue with the next service; this adds some resilience by double-checking services in the past
          continue;
        }

        info(`${getServiceFileName(service)} added`);
      } catch (err) {
        error(err);
      }
    }
  },
);
