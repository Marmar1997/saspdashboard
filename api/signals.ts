// Signals read + validator-decision endpoints.
//
// GET  /api/signals?status=approved&limit=20
//   - Public read for the dashboard. Returns approved signals only by default.
//   - status=pending and status=rejected require validator auth.
//
// POST /api/signals  { id, decision: 'approve'|'reject', edited_paraphrase? }
//   - Validator auth required.
//   - Flips a pending signal to approved/rejected.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireValidator } from './_lib/auth';
import {
  countByStatus,
  getLastRun,
  listSignals,
  transitionSignal,
  type SignalStatus,
} from './_lib/storage';

function clampLimit(raw: unknown): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 20;
  return Math.max(1, Math.min(100, Math.floor(n)));
}

function coerceStatus(raw: unknown): SignalStatus {
  const s = String(raw || 'approved').toLowerCase();
  if (s === 'pending' || s === 'approved' || s === 'rejected') return s;
  return 'approved';
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const method = (req.method || 'GET').toUpperCase();

  // POST = validator decision endpoint.
  if (method === 'POST') {
    if (!requireValidator(req, res)) return;
    const body = (req.body ?? {}) as { id?: unknown; decision?: unknown; edited_paraphrase?: unknown };
    const id = String(body.id || '').trim();
    const decision = String(body.decision || '').toLowerCase();
    const edited = body.edited_paraphrase != null ? String(body.edited_paraphrase).trim() : undefined;
    if (!id || (decision !== 'approve' && decision !== 'reject')) {
      res.status(400).json({ error: 'id and decision=approve|reject are required' });
      return;
    }
    const to: SignalStatus = decision === 'approve' ? 'approved' : 'rejected';
    const updated = await transitionSignal(id, to, 'validator', edited && edited.length > 0 ? edited : undefined);
    if (!updated) {
      res.status(404).json({ error: 'Signal not found' });
      return;
    }
    res.status(200).json({ signal: updated });
    return;
  }

  if (method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // GET path — listing + counts.
  const status = coerceStatus(req.query.status);
  const limit = clampLimit(req.query.limit);

  // Pending and rejected lists are validator-only; approved is public for the dashboard.
  if (status !== 'approved') {
    if (!requireValidator(req, res)) return;
  }

  const signals = await listSignals(status, limit);
  const counts = {
    pending: await countByStatus('pending'),
    approved: await countByStatus('approved'),
    rejected: await countByStatus('rejected'),
  };
  const last_run = await getLastRun();

  // Strip original_excerpt from public responses — validators see it, dashboard does not.
  const publicSafe = signals.map(s => {
    if (status === 'approved') {
      const { original_excerpt, ...rest } = s;
      return rest;
    }
    return s;
  });

  res.status(200).json({
    status,
    signals: publicSafe,
    counts,
    last_run,
  });
}
