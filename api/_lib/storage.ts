// Thin KV wrapper. All Finanzaonline ingestion state lives here.
//
// Keyspace:
//   signal:{id}                    JSON Signal blob
//   signals:pending                ZSET — captured_at score, id member
//   signals:approved               ZSET — decided_at score, id member
//   signals:rejected               ZSET — decided_at score, id member
//   signals:hashes                 SET — original_hash, for dedupe
//   last_run                       JSON { ts, posts_seen, posts_added, error? }

import { kv } from '@vercel/kv';
import crypto from 'node:crypto';
import type { ThemeId } from './themes';

export type SignalStatus = 'pending' | 'approved' | 'rejected';

export interface Signal {
  id: string;
  status: SignalStatus;
  paraphrase: string;
  theme: ThemeId;
  source_url: string;
  source_label: string; // e.g. "Finanzaonline · Mutui"
  thread_title?: string;
  original_hash: string;
  original_excerpt: string; // small unpasted snippet (≤80 chars) only for validator context
  captured_at: number;
  decided_at?: number;
  decided_by?: string;
  edited_paraphrase?: string; // set when validator edits
}

export interface LastRun {
  ts: number;
  posts_seen: number;
  posts_added: number;
  error?: string;
}

export function newSignalId(): string {
  return `sig_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`;
}

export function hashOriginal(text: string): string {
  return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex').slice(0, 32);
}

export async function isDuplicate(originalHash: string): Promise<boolean> {
  return (await kv.sismember('signals:hashes', originalHash)) === 1;
}

export async function writeSignal(sig: Signal): Promise<void> {
  await kv.set(`signal:${sig.id}`, sig);
  await kv.sadd('signals:hashes', sig.original_hash);
  const listKey = `signals:${sig.status}` as const;
  const score = sig.status === 'pending' ? sig.captured_at : (sig.decided_at ?? Date.now());
  await kv.zadd(listKey, { score, member: sig.id });
}

export async function readSignal(id: string): Promise<Signal | null> {
  return await kv.get<Signal>(`signal:${id}`);
}

export async function listSignals(status: SignalStatus, limit = 50): Promise<Signal[]> {
  const ids = await kv.zrange<string[]>(`signals:${status}`, 0, limit - 1, { rev: true });
  if (!ids || ids.length === 0) return [];
  const items: Signal[] = [];
  for (const id of ids) {
    const sig = await readSignal(id);
    if (sig) items.push(sig);
  }
  return items;
}

export async function transitionSignal(
  id: string,
  to: SignalStatus,
  decided_by: string,
  edited_paraphrase?: string,
): Promise<Signal | null> {
  const sig = await readSignal(id);
  if (!sig) return null;
  const from = sig.status;
  if (from === to) return sig;

  const now = Date.now();
  const next: Signal = {
    ...sig,
    status: to,
    decided_at: now,
    decided_by,
    ...(edited_paraphrase ? { edited_paraphrase } : {}),
  };

  await kv.set(`signal:${id}`, next);
  await kv.zrem(`signals:${from}`, id);
  await kv.zadd(`signals:${to}`, { score: now, member: id });
  return next;
}

export async function recordLastRun(run: LastRun): Promise<void> {
  await kv.set('last_run', run);
}

export async function getLastRun(): Promise<LastRun | null> {
  return await kv.get<LastRun>('last_run');
}

export async function countByStatus(status: SignalStatus): Promise<number> {
  return await kv.zcard(`signals:${status}`);
}
