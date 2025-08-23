'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Page } from '@/app/utils/interfaces';

/**
 * useOptimisticPages
 * Maintains an optimistic local copy of pages to reflect DnD changes immediately.
 *
 * Params:
 * - source: Page[] — authoritative pages array from your data source (store/server).
 *
 * Logic:
 * - Keeps an optional optimistic state. If present, consumers will see this state instead of source.
 * - Computes a compact hash of minimal fields (_id, parentId, order).
 * - When source changes (hash differs), resets the optimistic state (assumes server confirmed/app rejected).
 *
 * Returns:
 * - {
 *     pages: Page[];                                  // pages to render (optimistic || source)
 *     applyOptimistic: (next: Page[]) => void;        // set optimistic state after local reorder
 *     clearOptimistic: () => void;                    // drop optimistic state (e.g., on cancel/error)
 *   }
 */
export function useOptimisticPages(source: Page[]) {
  const [optimistic, setOptimistic] = useState<Page[] | null>(null);

  const hash = useMemo(() => hashPagesMinimal(source), [source]);
  const lastHashRef = useRef<string>(hash);

  // Reset optimistic copy when the authoritative source changes
  useEffect(() => {
    if (hash !== lastHashRef.current) {
      lastHashRef.current = hash;
      setOptimistic(null);
    }
  }, [hash]);

  return {
    pages: optimistic ?? source,
    applyOptimistic: (next: Page[]) => setOptimistic(next),
    clearOptimistic: () => setOptimistic(null),
  } as const;
}

/**
 * hashPagesMinimal
 * Creates a deterministic hash based on minimal ordering fields to detect structural changes.
 *
 * Params:
 * - pages: Page[] — input pages.
 *
 * Logic:
 * - Builds list of "<id>|<parentId|null>|<order>" lines sorted by id to be independent of array order.
 * - Joins into one string; suitable for cheap equality checks.
 *
 * Returns:
 * - string — minimal structural hash for comparison.
 */
function hashPagesMinimal(pages: Page[]): string {
  const lines = pages.map((p) => {
    const pid = p.parentId ?? null;
    const ord = p.order ?? 0;
    return `${p._id}|${pid}|${ord}`;
  });
  lines.sort(); // deterministic regardless of input order
  return lines.join('\n');
}