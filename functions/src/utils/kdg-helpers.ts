import RssParser from "rss-parser";

const parser = new RssParser();

interface KerkdienstgemistSecrets {
  playlist: string;
  accessKey: string;
}

export const getKDGServices = async (
  secrets: KerkdienstgemistSecrets,
  limit = 9,
): Promise<unknown[]> => {
  const url = new URL(
    `https://kerkdienstgemist.nl/playlists/${secrets.playlist}.rss`,
  );

  url.search = new URLSearchParams({
    access_key: secrets.accessKey,
    media: "audio",
    limit: limit.toString(),
  }).toString();

  const services = await parser.parseURL(url.toString());
  return services.items;
};
