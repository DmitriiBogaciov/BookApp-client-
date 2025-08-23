import type { Page } from '@/app/utils/interfaces';

/**
 * getChildrenSorted
 * Returns all direct children for the given parentId, sorted by the 'order' field (ascending).
 *
 * Parameters:
 * - pages: Page[] — full list of pages for the book.
 * - parentId: string | null — parent identifier; null means "root level".
 *
 * Logic:
 * - Compares (page.parentId ?? null) with the given parentId to treat both undefined and null as the same.
 * - Sorts by (order ?? 0), so items without an explicit order are pushed to the beginning consistently.
 * - Stabilizes sorting by _id to keep deterministic order when 'order' values are equal.
 *
 * Returns:
 * - A new array of child pages (not mutating the input), sorted by 'order'.
 */
export function getChildrenSorted(pages: Page[], parentId: string | null): Page[] {
  const targetParent = parentId ?? null;

  // Do not mutate the input array
  const children = pages.filter((p) => (p.parentId ?? null) === targetParent);

  // Stable sort by 'order' (undefined treated as 0), then by _id for determinism
  return children.slice().sort((a, b) => {
    const ao = a.order ?? 0;
    const bo = b.order ?? 0;
    if (ao !== bo) return ao - bo;
    return a._id.localeCompare(b._id);
  });
}

/**
 * normalizeSiblingOrders
 * Ensures each sibling group (same parentId) has contiguous 'order' values 0..n-1 with no gaps or duplicates.
 *
 * Params:
 * - pages: Page[] — full list of pages; the function will not mutate the input.
 *
 * Logic:
 * - Shallow-clone items to avoid mutations.
 * - Group by (parentId ?? null).
 * - Sort each group by (order ?? 0), then by _id to achieve deterministic ordering.
 * - Reassign order within each group starting from 0.
 *
 * Returns:
 * - Page[] — new array with normalized 'order' across all groups.
 */
export function normalizeSiblingOrders(pages: Page[]): Page[] {
  // Clone to keep purity
  const out = pages.map(p => ({ ...p }));

  // Build groups by parentId
  const groups = new Map<string | null, Page[]>();
  for (const p of out) {
    const key = p.parentId ?? null;
    const arr = groups.get(key) ?? [];
    arr.push(p);
    groups.set(key, arr);
  }

  // Normalize within each group
  for (const arr of groups.values()) {
    arr.sort((a, b) => {
      const ao = a.order ?? 0;
      const bo = b.order ?? 0;
      if (ao !== bo) return ao - bo;
      return a._id.localeCompare(b._id);
    });
    arr.forEach((p, i) => {
      p.order = i;
    });
  }

  return out;
}

/**
 * movePageWithinParent
 * Reorders a page among its siblings under the same parent by moving `sourceId`
 * into the position of `targetId` (i.e., before the current target index).
 *
 * Params:
 * - pages: Page[] — full list of pages (will NOT be mutated).
 * - parentId: string | null — the common parent identifier for the sibling group.
 * - sourceId: string — the id of the page to move.
 * - targetId: string — the id of the page that indicates the insertion position.
 *
 * Logic:
 * - Validates that both source and target exist and share the provided parentId.
 * - Builds a sorted sibling list (by order, then _id).
 * - Computes indices of source and target; removes source and inserts it at target index.
 * - Writes back contiguous order (0..n-1) for this sibling group only.
 *
 * Returns:
 * - Page[] — a new array with updated 'order' for the affected sibling group.
 *   If validation fails (ids not found or different parent), returns a cloned array without changes.
 */
export function movePageWithinParent(
  pages: Page[],
  parentId: string | null,
  sourceId: string,
  targetId: string
): Page[] {
  const pid = parentId ?? null;

  // Shallow-clone to keep immutability
  const out = pages.map((p) => ({ ...p }));

  // Resolve source/target and validate parent
  const src = out.find((p) => p._id === sourceId);
  const dst = out.find((p) => p._id === targetId);
  if (!src || !dst) return out;

  const srcPid = src.parentId ?? null;
  const dstPid = dst.parentId ?? null;
  if (srcPid !== pid || dstPid !== pid) return out; // must share the same parent
  if (sourceId === targetId) return out;

  // Build a stable, sorted sibling list
  const siblings = out
    .filter((p) => (p.parentId ?? null) === pid)
    .sort((a, b) => {
      const ao = a.order ?? 0;
      const bo = b.order ?? 0;
      if (ao !== bo) return ao - bo;
      return a._id.localeCompare(b._id);
    });

  const fromIndex = siblings.findIndex((p) => p._id === sourceId);
  const toIndex = siblings.findIndex((p) => p._id === targetId);
  if (fromIndex < 0 || toIndex < 0) return out;

  // Reorder ids locally (remove source, insert at target index)
  const ids = siblings.map((p) => p._id);
  const [moved] = ids.splice(fromIndex, 1);
  const insertAt = toIndex; // insert at target's current index
  ids.splice(insertAt, 0, moved);

  // Write back contiguous 'order' for this sibling group
  ids.forEach((id, i) => {
    const item = out.find((p) => p._id === id)!;
    item.order = i;
  });

  return out;
}

/**
 * movePageToNewParent
 * Moves a page to a new parent and inserts it at a specific index among the new siblings.
 *
 * Params:
 * - pages: Page[] — full list of pages (input will NOT be mutated).
 * - sourceId: string — id of the page being moved.
 * - newParentId: string | null — id of the target parent (null means root).
 * - insertIndex?: number — desired position within the new sibling group (defaults to "append to end").
 *
 * Logic:
 * - Validates existence and prevents cycles (cannot move a node into its own descendant).
 * - Removes the source from its old sibling group and reassigns contiguous 'order' there.
 * - Sets source.parentId = newParentId.
 * - Inserts the source into the new sibling group at bounded insertIndex and reassigns contiguous 'order'.
 *
 * Returns:
 * - Page[] — a new array with updated parentId/order in the affected groups.
 */
export function movePageToNewParent(
  pages: Page[],
  sourceId: string,
  newParentId: string | null,
  insertIndex?: number
): Page[] {
  // Clone to keep the function pure
  const out = pages.map(p => ({ ...p }));
  const src = out.find(p => p._id === sourceId);
  if (!src) return out;

  const targetPid = newParentId ?? null;
  const oldPid = src.parentId ?? null;

  // No-op if dropping onto itself
  if (sourceId === newParentId) return out;

  // Prevent cycles: walk up from newParentId to root, ensure we never hit sourceId
  if (newParentId) {
    let cur = out.find(p => p._id === newParentId) || null;
    const guard = new Set<string>();
    while (cur) {
      if (guard.has(cur._id)) break; // guard against malformed data
      guard.add(cur._id);
      if (cur._id === sourceId) {
        return out; // cycle detected, abort move
      }
      cur = cur.parentId ? out.find(p => p._id === cur!.parentId) || null : null;
    }
  }

  // If parent doesn't change and no index provided, nothing to do
  if (oldPid === targetPid && insertIndex === undefined) return out;

  // 1) Remove from old sibling group and compress order
  {
    const oldSiblings = out
      .filter(p => (p.parentId ?? null) === oldPid)
      .sort((a, b) => {
        const ao = a.order ?? 0;
        const bo = b.order ?? 0;
        if (ao !== bo) return ao - bo;
        return a._id.localeCompare(b._id);
      });

    const filtered = oldSiblings.filter(p => p._id !== sourceId);
    filtered.forEach((p, i) => {
      p.order = i;
    });
  }

  // 2) Update parent
  src.parentId = targetPid;

  // 3) Insert into new sibling group at bounded index and reassign order
  {
    const newSiblings = out
      .filter(p => (p.parentId ?? null) === targetPid)
      .sort((a, b) => {
        const ao = a.order ?? 0;
        const bo = b.order ?? 0;
        if (ao !== bo) return ao - bo;
        return a._id.localeCompare(b._id);
      });

    // Build id list without duplicates (src is already in group after parentId update)
    const ids = newSiblings.map(p => p._id).filter(id => id !== sourceId);
    const at = Math.max(0, Math.min(insertIndex ?? ids.length, ids.length));
    ids.splice(at, 0, sourceId);

    ids.forEach((id, i) => {
      const node = out.find(p => p._id === id)!;
      node.order = i;
    });
  }

  return out;
}

/**
 * diffOrderAndParentChanges
 * Computes a minimal list of changes between previous and next pages for persistence:
 * only items whose 'parentId' or 'order' changed will be returned.
 *
 * Params:
 * - prev: Page[] — previous state of pages (typically from the store before DnD).
 * - next: Page[] — next state of pages (after DnD operations; should be normalized).
 * - bookId?: string — optional filter to include changes only for a specific book.
 *
 * Logic:
 * - Build a map prevById for O(1) lookup.
 * - For each item in 'next', find the matching 'prev' item by _id.
 * - Compare normalized parentId (undefined -> null) and order (undefined -> 0).
 * - If either differs, push {id, parentId, order} to the result.
 * - Skip items missing in 'prev' (treated as newly created elsewhere).
 *
 * Returns:
 * - Array<{id: string; parentId: string | null; order: number}>
 *   Minimal set of changes to apply via updatePage.
 */
export function diffOrderAndParentChanges(
  prev: Page[],
  next: Page[],
  bookId?: string
): Array<{ id: string; parentId: string | null; order: number }> {
  // Index previous state by id for fast lookup
  const prevById = new Map(prev.map(p => [p._id, p]));

  const onlyForBook = (p: Page) => (bookId ? p.bookId === bookId : true);
  const normalizePid = (v: string | null | undefined) => (v ?? null);
  const normalizeOrder = (v: number | undefined) => (v ?? 0);

  const changes: Array<{ id: string; parentId: string | null; order: number }> = [];

  for (const cur of next) {
    if (!onlyForBook(cur)) continue;

    const before = prevById.get(cur._id);
    if (!before) continue; // skip newly created pages (not part of "reorder" diff)

    const beforePid = normalizePid(before.parentId);
    const curPid = normalizePid(cur.parentId);
    const beforeOrder = normalizeOrder(before.order);
    const curOrder = normalizeOrder(cur.order);

    if (beforePid !== curPid || beforeOrder !== curOrder) {
      changes.push({
        id: cur._id,
        parentId: curPid,
        order: curOrder,
      });
    }
  }

  return changes;
}

/**
 * VisibleNode
 * Flat representation of a page in the visible tree.
 *
 * Fields:
 * - id: string — page id.
 * - parentId: string | null — direct parent id (null for root).
 * - depth: number — visual nesting level (0 for root).
 */
export type VisibleNode = {
  id: string;
  parentId: string | null;
  depth: number;
};

/**
 * flattenVisiblePages
 * Builds a flat list of visible nodes (respecting expansion state) in the exact render order.
 *
 * Params:
 * - pages: Page[] — full list of pages for the book.
 * - expanded: Set<string> | null — set of expanded page ids; if null, treat all nodes as expanded.
 * - startParentId?: string | null — parent to start from (null = root).
 * - startDepth?: number — starting depth (0 for root level).
 *
 * Logic:
 * - Uses getChildrenSorted to fetch children for current parent.
 * - Pushes each child into the output as { id, parentId, depth }.
 * - If node is expanded (expanded has id, or expanded == null), recurses into its children with depth+1.
 *
 * Returns:
 * - VisibleNode[] — flat array of nodes in the same order they should be rendered.
 */
export function flattenVisiblePages(
  pages: Page[],
  expanded: Set<string> | null,
  startParentId: string | null = null,
  startDepth: number = 0
): VisibleNode[] {
  const result: VisibleNode[] = [];

  const children = getChildrenSorted(pages, startParentId);
  for (const child of children) {
    result.push({
      id: child._id,
      parentId: startParentId ?? null,
      depth: startDepth,
    });

    const isExpanded = expanded == null ? true : expanded.has(child._id);
    if (isExpanded) {
      const descendants = flattenVisiblePages(
        pages,
        expanded,
        child._id,
        startDepth + 1
      );
      result.push(...descendants);
    }
  }

  return result;
}

/**
 * buildDepthAndParentMaps
 * Creates fast lookup maps for depth and parentId from a VisibleNode[] produced by flattenVisiblePages.
 *
 * Params:
 * - visible: VisibleNode[] — flat list of nodes in render order.
 *
 * Logic:
 * - Iterates once over the array and fills two Map instances:
 *   - depthById[id] = depth
 *   - parentById[id] = parentId (null for root)
 *
 * Returns:
 * - { depthById: Map<string, number>; parentById: Map<string, string | null> }
 *   Reusable maps for rendering indentation and DnD computations.
 */
export function buildDepthAndParentMaps(visible: VisibleNode[]): {
  depthById: Map<string, number>;
  parentById: Map<string, string | null>;
} {
  const depthById = new Map<string, number>();
  const parentById = new Map<string, string | null>();

  for (const n of visible) {
    depthById.set(n.id, n.depth);
    parentById.set(n.id, n.parentId ?? null);
  }

  return { depthById, parentById };
}

/**
 * getProjectionForPointer
 * Computes the projected depth and parentId for the dragged item based on horizontal offset and current "over" item.
 *
 * Params:
 * - visible: VisibleNode[] — flat, visible list in render order (ideally without the active node while dragging).
 * - activeId: string — id of the dragged item.
 * - overId: string — id of the item currently under the pointer (drop target position reference).
 * - offsetX: number — horizontal drag offset in pixels (positive: moving right/indent, negative: moving left/outdent).
 * - indentationWidth: number — pixels per one nesting level (e.g., 20).
 *
 * Logic:
 * - Derives indentation steps as round(offsetX / indentationWidth).
 * - Uses active node's original depth as a base, then clamps the projected depth:
 *   maxDepth = (previous visible node's depth + 1) if exists, else 0.
 *   minDepth = 0.
 * - Determines projected parentId by scanning upward from overIndex-1 to find
 *   the nearest node with depth === (projectedDepth - 1) and taking its id.
 *   If none found and projectedDepth === 0, parentId = null.
 * - Skips the activeId during scans to avoid self-reference when visible still includes the active node.
 *
 * Returns:
 * - { depth: number; parentId: string | null } — projected nesting and parent to apply if dropped now.
 */
export function getProjectionForPointer(
  visible: VisibleNode[],
  activeId: string,
  overId: string,
  offsetX: number,
  indentationWidth: number
): { depth: number; parentId: string | null } {
  // Resolve indices and nodes
  const activeIndex = visible.findIndex((n) => n.id === activeId);
  const overIndex = visible.findIndex((n) => n.id === overId);

  if (overIndex < 0) {
    // No valid "over" node; fallback to root level
    return { depth: 0, parentId: null };
  }

  // Base depth — use active node's original depth if present, otherwise over's depth
  const baseDepth =
    activeIndex >= 0 ? visible[activeIndex].depth : visible[overIndex].depth;

  // Translate horizontal offset to indentation steps
  const step = indentationWidth > 0 ? Math.round(offsetX / indentationWidth) : 0;

  // Max depth is based on the item currently hovered (allow nesting directly under it)
  const overDepth = visible[overIndex].depth;
  const maxDepth = overDepth + 1;

  // Clamp projected depth between 0 and maxDepth
  let projectedDepth = Math.max(0, Math.min(baseDepth + step, maxDepth));

  // Resolve projected parentId:
  // - if projectedDepth === 0 => null
  // - if projectedDepth > overDepth => parent is the over item
  // - else => parent is the nearest previous node with depth === projectedDepth - 1
  let projectedParentId: string | null = null;

  if (projectedDepth === 0) {
    projectedParentId = null;
  } else if (projectedDepth > overDepth) {
    projectedParentId = overId;
  } else {
    const targetDepth = projectedDepth - 1;
    for (let i = overIndex - 1; i >= 0; i--) {
      const node = visible[i];
      if (node.id === activeId) continue; // skip the active item if still present in list
      if (node.depth === targetDepth) {
        projectedParentId = node.id;
        break;
      }
    }
    // If not found, fallback to root
    if (projectedParentId === null) {
      projectedDepth = 0;
    }
  }

  return { depth: projectedDepth, parentId: projectedParentId };
}

/**
 * applyProjection
 * Applies the projected nesting (parentId/depth) and reorders items according to the drop over item.
 *
 * Params:
 * - pages: Page[] — full list of pages (input will NOT be mutated).
 * - activeId: string — id of the dragged page.
 * - overId: string — id of the page under the pointer at drop time (used to determine target position).
 * - projection: { depth: number; parentId: string | null } — result of getProjectionForPointer.
 *
 * Logic:
 * - If active and over share the same parent as in 'projection' → use movePageWithinParent (insert at over's index).
 * - Otherwise → use movePageToNewParent with insertIndex:
 *     - If 'over' is a direct child of projected parent → insert at over's index.
 *     - Else → append to the end of projected parent's children.
 * - Both helpers rewrite contiguous orders (0..n-1) within affected groups.
 *
 * Returns:
 * - Page[] — new array with updated parentId/order for affected items only.
 */
export function applyProjection(
  pages: Page[],
  activeId: string,
  overId: string,
  projection: { depth: number; parentId: string | null }
): Page[] {
  if (!activeId || !overId) return pages;
  if (activeId === overId) return pages;

  const out = pages.map(p => ({ ...p })); // shallow clone
  const targetParentId = projection.parentId ?? null;

  const active = out.find(p => p._id === activeId);
  const over = out.find(p => p._id === overId);
  if (!active || !over) return out;

  const activePid = active.parentId ?? null;
  const overPid = over.parentId ?? null;

  // Case 1: same parent in the projection and over belongs to that parent → reorder within parent
  if (activePid === targetParentId && overPid === targetParentId) {
    return movePageWithinParent(out, targetParentId, activeId, overId);
  }

  // Case 2: parent changes or 'over' not in the same group → move to new parent
  // Decide insert index among target parent's children
  const targetSiblings = getChildrenSorted(out, targetParentId);
  const overIndexInTarget = targetSiblings.findIndex(p => p._id === overId);
  const insertIndex = overIndexInTarget >= 0 ? overIndexInTarget : targetSiblings.length;

  return movePageToNewParent(out, activeId, targetParentId, insertIndex);
}

/**
 * computeDragState
 * Computes visible flat list, projected nesting, and next pages state for a drag operation.
 *
 * Params:
 * - pages: Page[] — full list of pages.
 * - expanded: Set<string> | null — expanded node ids; null = treat all as expanded.
 * - activeId: string — id of the dragged page.
 * - overId?: string | null — id of the page under pointer; if missing, projection is null.
 * - offsetX: number — horizontal drag offset in pixels.
 * - indentationWidth: number — pixels per nesting level (e.g., 20).
 *
 * Logic:
 * - Builds visible list (flattenVisiblePages) to match render order.
 * - If overId provided, computes projection (getProjectionForPointer).
 * - If projection exists and overId provided, applies it to data (applyProjection) to get nextPages.
 *
 * Returns:
 * - {
 *     visible: VisibleNode[];                       // render-order flat list
 *     projection: { depth: number; parentId: string | null } | null; // projected nesting
 *     nextPages: Page[];                            // updated pages after applying projection (or original pages if no projection)
 *   }
 */
export function computeDragState(
  pages: Page[],
  expanded: Set<string> | null,
  activeId: string,
  overId: string | null | undefined,
  offsetX: number,
  indentationWidth: number
): {
  visible: VisibleNode[];
  projection: { depth: number; parentId: string | null } | null;
  nextPages: Page[];
} {
  // Build the flat, render-ordered list of visible nodes
  const visible = flattenVisiblePages(pages, expanded);

  if (!overId) {
    // No target under pointer: no projection, data unchanged
    return { visible, projection: null, nextPages: pages };
  }

  // Compute projected depth/parentId using horizontal offset
  const projection = getProjectionForPointer(
    visible,
    activeId,
    overId,
    offsetX,
    indentationWidth
  );

  // Apply projection to produce next state (order/parentId updated only for affected groups)
  const nextPages = applyProjection(pages, activeId, overId, projection);

  return { visible, projection, nextPages };
}