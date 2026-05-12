// Finanzaonline mutui sub-forum crawler.
//
// Posture (per INGESTION_NARRATIVE.md §7):
//   - Public web, no auth, paraphrased downstream (not here).
//   - Honest User-Agent identifying SASP / Kakashi.
//   - Rate-limited to 1 request/sec.
//   - No PII extraction — only post body text + thread URL + thread title.
//
// HTML structure assumptions (verify if the parser stops finding posts):
//   - Sub-forum index lists threads with selector `li.threadbit a.title` or similar.
//   - Each thread page lists posts under `.postbit` blocks; body text under `.postcontent`.
// Finanzaonline runs vBulletin so these selectors track that engine's class names.

import * as cheerio from 'cheerio';

const FORUM_INDEX_URL = 'https://forum.finanzaonline.com/forum/mutui/';
const RATE_LIMIT_MS = 1000;
const MAX_THREADS_PER_RUN = 8;
const MAX_POSTS_PER_THREAD = 6;
const REQUEST_TIMEOUT_MS = 15_000;
const MIN_POST_CHARS = 80;
const MAX_POST_CHARS = 1400;

export interface ScrapedPost {
  thread_url: string;
  thread_title: string;
  post_index: number;
  text: string;
}

const userAgent = (): string =>
  process.env.INGEST_USER_AGENT || 'SASP-research/1.0 (+https://kakashi.ventures)';

async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': userAgent(),
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'it,en;q=0.7',
      },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function discoverThreadLinks(indexHtml: string): Array<{ url: string; title: string }> {
  const $ = cheerio.load(indexHtml);
  const seen = new Set<string>();
  const out: Array<{ url: string; title: string }> = [];

  // vBulletin variants — try a few selectors to be robust to skin/theme.
  const selectors = ['a.title', 'a.thread-title', 'h3.threadtitle a', '.threadbit a.title'];
  for (const sel of selectors) {
    $(sel).each((_, el) => {
      const href = $(el).attr('href');
      const title = ($(el).text() || '').trim();
      if (!href || !title) return;
      const absolute = href.startsWith('http')
        ? href
        : new URL(href, FORUM_INDEX_URL).toString();
      if (!absolute.includes('finanzaonline.com')) return;
      if (seen.has(absolute)) return;
      seen.add(absolute);
      out.push({ url: absolute, title });
    });
    if (out.length >= MAX_THREADS_PER_RUN) break;
  }
  return out.slice(0, MAX_THREADS_PER_RUN);
}

function extractPosts(threadHtml: string, thread: { url: string; title: string }): ScrapedPost[] {
  const $ = cheerio.load(threadHtml);
  const out: ScrapedPost[] = [];

  // vBulletin renders post bodies under `.postcontent.restore` or `.content > div`.
  const selectors = ['.postcontent.restore', '.postcontent', 'blockquote.postcontent', '.message'];
  let nodes: cheerio.Cheerio<any> | null = null;
  for (const sel of selectors) {
    const found = $(sel);
    if (found.length > 0) { nodes = found; break; }
  }
  if (!nodes) return out;

  let idx = 0;
  nodes.each((_, el) => {
    if (out.length >= MAX_POSTS_PER_THREAD) return;
    // Remove quote blocks so we don't double-count replies that quote earlier posts.
    const $el = $(el);
    $el.find('blockquote, .bbcode_container, .signature').remove();
    const text = $el.text().replace(/\s+/g, ' ').trim();
    if (text.length < MIN_POST_CHARS) return;
    out.push({
      thread_url: thread.url,
      thread_title: thread.title,
      post_index: idx++,
      text: text.length > MAX_POST_CHARS ? text.slice(0, MAX_POST_CHARS) : text,
    });
  });
  return out;
}

export interface CrawlResult {
  posts: ScrapedPost[];
  threads_seen: number;
  fetch_errors: number;
}

export async function crawlMutuiSubforum(): Promise<CrawlResult> {
  const result: CrawlResult = { posts: [], threads_seen: 0, fetch_errors: 0 };
  let indexHtml: string;
  try {
    indexHtml = await fetchHtml(FORUM_INDEX_URL);
  } catch (e) {
    result.fetch_errors++;
    return result;
  }

  const threads = discoverThreadLinks(indexHtml);
  result.threads_seen = threads.length;

  for (const thread of threads) {
    await sleep(RATE_LIMIT_MS);
    try {
      const threadHtml = await fetchHtml(thread.url);
      const posts = extractPosts(threadHtml, thread);
      result.posts.push(...posts);
    } catch (e) {
      result.fetch_errors++;
    }
  }
  return result;
}
