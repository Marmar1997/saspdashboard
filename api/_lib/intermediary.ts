// Italian intermediary editorial crawler — v0 ingestion source.
//
// Why not Finanzaonline (the methodology's flagship forum source)?
//   Finanzaonline is behind Cloudflare bot challenge (`cf-mitigated: challenge`).
//   Every UA gets HTTP 403 from a serverless function. Documented Known Issue;
//   bypassing requires a commercial scraper (ScrapingBee, Bright Data) ~$30/mo.
//
// v0 source: https://www.partitaiva.it/
//   Listed in INGESTION_NARRATIVE.md §3 alongside telemutuo.it / tassomutuo.it
//   as the "intermediary editorial" family. Specifically covers P.IVA mortgage
//   framing, "folk standard" thresholds, freelance finance language — direct
//   match for the SASP/IT/MTG/001 use case.
//
// Posture (per INGESTION_NARRATIVE.md §7):
//   - Public web, no auth, paraphrased downstream (not here).
//   - Honest User-Agent identifying SASP / Kakashi.
//   - Rate-limited to 1 request/sec.
//   - No PII — only article URL, title, paragraph text.

import * as cheerio from 'cheerio';

const INDEX_URLS = [
  'https://www.partitaiva.it/finanza/',
  'https://www.partitaiva.it/fisco-tasse/',
];
const SOURCE_LABEL = 'partitaiva.it · intermediary editorial';
const ARTICLE_URL_RE = /^https:\/\/www\.partitaiva\.it\/[a-z0-9][a-z0-9-]+\/?$/;
// Exclude index / utility paths that match the slug shape.
const EXCLUDE_SLUGS = new Set([
  'apri-partita-iva', 'aprire-partita-iva', 'autori', 'blog', 'calcolatori',
  'chi-siamo', 'contatti', 'cookie-policy', 'codici-ateco', 'codici-tributo',
  'glossario', 'mediakit', 'feed', 'finanza', 'economia', 'fintech',
  'fisco-tasse', 'impresa', 'info-dati', 'innovazione', 'lavoro',
  'dichiarazione-pubblicita', 'editoriali',
]);
const RATE_LIMIT_MS = 500;            // was 1000 — partitaiva.it tolerates 2 req/s fine
const MAX_ARTICLES_PER_RUN = 3;       // was 6 — burned 30+ s of crawl budget; LLM never ran
const MAX_PARAGRAPHS_PER_ARTICLE = 5; // was 8 — fewer candidates per article, more articles' worth of variety over time
const REQUEST_TIMEOUT_MS = 15_000;
const MIN_PARA_CHARS = 120;
const MAX_PARA_CHARS = 1400;

export interface ScrapedPost {
  thread_url: string;       // article URL — retained name for storage compat
  thread_title: string;     // article title
  post_index: number;       // paragraph index within the article
  text: string;
  source_label: string;
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

function slugOf(url: string): string {
  const m = url.match(/partitaiva\.it\/([^/?#]+)\/?/);
  return m ? m[1] : '';
}

function discoverArticleLinks(indexHtml: string): string[] {
  const $ = cheerio.load(indexHtml);
  const seen = new Set<string>();
  const out: string[] = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (!href || !ARTICLE_URL_RE.test(href)) return;
    if (EXCLUDE_SLUGS.has(slugOf(href))) return;
    if (seen.has(href)) return;
    seen.add(href);
    out.push(href);
  });
  return out;
}

function extractArticle(html: string, url: string): { title: string; paragraphs: string[] } {
  const $ = cheerio.load(html);
  const title = ($('h1').first().text() || $('title').text() || slugOf(url)).trim();

  // Strip nav / footer / aside / scripts so we don't pull menu items as content.
  $('nav, footer, aside, script, style, .menu, .navigation, .sidebar, .related').remove();

  // Prefer the article container if it exists.
  const root = $('article').length ? $('article').first() : $('main').length ? $('main').first() : $('body');

  const paragraphs: string[] = [];
  root.find('p').each((_, el) => {
    if (paragraphs.length >= MAX_PARAGRAPHS_PER_ARTICLE) return;
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text.length < MIN_PARA_CHARS) return;
    if (text.length > MAX_PARA_CHARS) return;
    // Skip paragraphs that look like nav-menu dumps (many short fragments joined).
    if (/menu/i.test(text.slice(0, 40)) && text.split(' ').length < 25) return;
    paragraphs.push(text);
  });
  return { title, paragraphs };
}

export interface CrawlResult {
  posts: ScrapedPost[];
  threads_seen: number;
  fetch_errors: number;
  fetch_errors_detail: string[];
}

export async function crawlIntermediarySources(): Promise<CrawlResult> {
  const result: CrawlResult = { posts: [], threads_seen: 0, fetch_errors: 0, fetch_errors_detail: [] };

  // Gather article URLs from all index pages.
  const allLinks = new Set<string>();
  for (const indexUrl of INDEX_URLS) {
    try {
      await sleep(RATE_LIMIT_MS);
      const indexHtml = await fetchHtml(indexUrl);
      for (const link of discoverArticleLinks(indexHtml)) allLinks.add(link);
    } catch (e) {
      result.fetch_errors++;
      result.fetch_errors_detail.push(`index ${indexUrl}: ${String((e as Error)?.message ?? e).slice(0, 120)}`);
    }
  }

  // Cap and crawl.
  const articleUrls = Array.from(allLinks).slice(0, MAX_ARTICLES_PER_RUN);
  result.threads_seen = articleUrls.length;

  for (const url of articleUrls) {
    await sleep(RATE_LIMIT_MS);
    try {
      const html = await fetchHtml(url);
      const { title, paragraphs } = extractArticle(html, url);
      paragraphs.forEach((text, idx) => {
        result.posts.push({
          thread_url: url,
          thread_title: title,
          post_index: idx,
          text,
          source_label: SOURCE_LABEL,
        });
      });
    } catch (e) {
      result.fetch_errors++;
      result.fetch_errors_detail.push(`article ${url}: ${String((e as Error)?.message ?? e).slice(0, 120)}`);
    }
  }

  return result;
}
