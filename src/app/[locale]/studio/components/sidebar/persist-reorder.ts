import { updatePagesBatch } from '@/app/services/page-service';
import type { Page } from '@/app/utils/interfaces';

/**
 * persistPagesReorder
 * Persists a batch of parent/order changes for pages using the server-side updatePages API.
 *
 * Params:
 * - changes: Array<{ id: string; parentId: string | null; order: number }>
 *   Minimal change set computed by diffOrderAndParentChanges (only changed items).
 *
 * Logic:
 * - Short-circuits on empty input.
 * - Calls updatePagesBatch(changes, ['_id','parentId','order']) to save in one network request.
 * - Returns the list of updated page ids for convenience.
 *
 * Returns:
 * - Promise<string[]> — updated page ids confirmed by the server.
 */
export async function persistPagesReorder(
  changes: Array<{ id: string; parentId: string | null; order: number }>
): Promise<string[]> {
  if (!Array.isArray(changes) || changes.length === 0) return [];

  const updated: Page[] = await updatePagesBatch(changes, ['_id', 'parentId', 'order']);
  return updated.map((p) => p._id);
}