import { UpstreamHttpFetchError } from '@kdg/core/errors/upstream-http-fetch-error';
import { XMLParser } from 'fast-xml-parser';
import { err, ok, fromPromise, ResultAsync } from 'neverthrow';

type FetchKdgRssFeedResponse = number[];

export async function fetchKdgRssFeed(
  playlistId: string,
  accessKey: string,
  limit: number,
): Promise<ResultAsync<FetchKdgRssFeedResponse, UpstreamHttpFetchError>> {
  const url = new URL(`https://kerkdienstgemist.nl/playlists/${playlistId}.rss`);
  url.search = new URLSearchParams({
    access_key: accessKey,
    media: 'audio',
    limit: limit.toString(),
  }).toString();

  const response = await fromPromise(fetch(url), (e) => e);
  if (response.isErr()) {
    return err({
      kind: 'network',
      cause: response.error,
    });
  }

  if (!response.value.ok) {
    return err({
      kind: 'httpStatus',
      status: response.value.status,
      // TODO: include response-body
    });
  }

  const rssFeedBytes = await fromPromise(response.value.bytes(), (e) => e);
  if (rssFeedBytes.isErr()) {
    return err({
      kind: 'decode',
      cause: rssFeedBytes.error,
    });
  }

  const parser = new XMLParser();
  const parsed = parser.parse(rssFeedBytes.value);
  return ok(parsed);
}
