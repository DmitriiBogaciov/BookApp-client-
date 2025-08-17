// Утилиты для работы с иерархией страниц (перемещение, пересчёт order, валидации)
import type { Page } from '@/app/utils/interfaces';

type Id = string | null;

// Получить детей родителя (отсортировано по order)
export function getChildren(pages: Page[], parentId: Id): Page[] {
  return pages
    .filter(p => (p.parentId ?? null) === (parentId ?? null))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function findById(pages: Page[], id: string): Page | undefined {
  return pages.find(p => p._id === id);
}

export function getAncestors(pages: Page[], id: string): string[] {
  const res: string[] = [];
  let cur = findById(pages, id);
  const safeGuard = new Set<string>();
  while (cur && cur.parentId) {
    if (safeGuard.has(cur._id)) break;
    safeGuard.add(cur._id);
    res.push(cur.parentId);
    cur = findById(pages, cur.parentId);
  }
  return res;
}

export function isAncestor(pages: Page[], ancestorId: string, nodeId: string): boolean {
  return getAncestors(pages, nodeId).includes(ancestorId);
}

// Нормализует order по каждой группе соседей от 0..n-1
export function normalizeOrders(pages: Page[]): Page[] {
  const next = pages.map(p => ({ ...p }));
  const byParent = new Map<Id, Page[]>();
  next.forEach(p => {
    const key = p.parentId ?? null;
    const arr = byParent.get(key) ?? [];
    arr.push(p);
    byParent.set(key, arr);
  });
  for (const arr of byParent.values()) {
    arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).forEach((p, i) => (p.order = i));
  }
  return next;
}

// Перемещение страницы: смена parent и позиции среди соседей
export function movePage(
  pages: Page[],
  pageId: string,
  newParentId: Id,
  newIndex: number
): Page[] {
  const source = normalizeOrders(pages);
  const item = source.find(p => p._id === pageId);
  if (!item) return source;
  if (newParentId === item._id) return source; // нельзя сделать родителем себя
  if (newParentId && isAncestor(source, item._id, newParentId)) {
    // нельзя перемещать предка в потомка
    return source;
  }

  const next = source.map(p => ({ ...p }));
  const current = next.find(p => p._id === pageId)!;

  // Сжать старых соседей
  const oldSiblings = next.filter(p => (p.parentId ?? null) === (current.parentId ?? null));
  for (const s of oldSiblings) {
    if (s._id === current._id) continue;
    if ((s.order ?? 0) > (current.order ?? 0)) s.order = (s.order ?? 0) - 1;
  }

  // Обновить родителя
  current.parentId = newParentId;

  // Вставить среди новых соседей
  const newSiblings = next
    .filter(p => (p.parentId ?? null) === (newParentId ?? null) && p._id !== current._id)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const bounded = Math.max(0, Math.min(newIndex, newSiblings.length));
  for (const s of newSiblings) {
    if ((s.order ?? 0) >= bounded) s.order = (s.order ?? 0) + 1;
  }
  current.order = bounded;

  return normalizeOrders(next);
}