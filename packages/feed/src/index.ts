import { UpstreamHttpFetchError } from '@kdg/core/errors/upstream-http-fetch-error';
import { XMLParser } from 'fast-xml-parser';
import { err, ok, fromPromise, Result, ResultAsync } from 'neverthrow';
import * as z from 'zod';

const KdgRssFeedResponse = z.object({
  rss: z.object({
    channel: z.object({
      item: z.array(
        z.object({
          title: z.string(),
          pubDate: z.coerce.date(),
          'itunes:author': z.string().optional(),
          guid: z.object({
            '#text': z.string(),
            '@_isPermaLink': z.stringbool(),
          }),
          enclosure: z.object({
            '@_type': z.enum(['audio/mpeg']),
            '@_url': z.httpUrl(),
          }),
        }),
      ),
    }),
  }),
});

export async function fetchKdgRssFeed(
  playlistId: string,
  accessKey: string,
  limit: number,
): Promise<ResultAsync<z.TypeOf<typeof KdgRssFeedResponse>, UpstreamHttpFetchError>> {
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

  const rssFeedRawText = await fromPromise(response.value.text(), (e) => e);
  if (rssFeedRawText.isErr()) {
    return err({
      kind: 'decode',
      cause: rssFeedRawText.error,
    });
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    // Without this a single-item feed (limit=1) parses <item> as an object instead of an array.
    isArray: (_name, jpath) => jpath === 'rss.channel.item',
  });

  const parsed = Result.fromThrowable(
    () => parser.parse(rssFeedRawText.value),
    (e) => e,
  )();
  if (parsed.isErr()) {
    return err({
      kind: 'parse',
      cause: parsed.error,
    });
  }

  const feed = KdgRssFeedResponse.safeParse(parsed.value);
  if (!feed.success) {
    return err({
      kind: 'validation',
      cause: feed.error,
    });
  }

  return ok(feed.data);
}
