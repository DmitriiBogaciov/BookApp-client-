'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import PageItem from './page-item';
import { Page } from '@/app/utils/interfaces';

// + DnD
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { getChildren, findById, movePage, normalizeOrders } from '@/shared/dnd/page-tree';

interface PagesListProps {
  bookId: string;
  onCreatePage?: (bookId: string, parentId: string | null) => Promise<void>;
  pages?: Page[],
  expandedPages?: Set<string> | null;
  parentId?: string | null;
  togglePageExpansion?: (pageId: string) => void;
  onRemovePage?: (pageId: string) => Promise<void>;
  // + новый коллбек для персиста
  onReorder?: (nextPages: Page[]) => Promise<void> | void;
}

export default function PagesList({
  bookId,
  onCreatePage,
  pages = [],
  expandedPages,
  parentId = null,
  togglePageExpansion,
  onRemovePage,
  onReorder,
}: PagesListProps) {

  // Локальная копия для мгновенного UI-обновления
  const [localPages, setLocalPages] = useState<Page[]>(() => normalizeOrders(pages));
  // Синхронизируемся только если ссылка на массив реально изменилась
  useEffect(() => { setLocalPages(normalizeOrders(pages)); }, [pages]);

  const isRoot = parentId === null;

  // Сенсоры (мышь + клавиатура)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor)
  );

  // Текущие страницы этого уровня
  const currentPages = useMemo(() => getChildren(localPages, parentId), [localPages, parentId]);

  // Контейнер-дроп для данного родителя (перенос в конец этого контейнера)
  const containerId = `container:${parentId ?? 'root'}`;
  const { setNodeRef: setContainerRef } = useDroppable({ id: containerId });

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Перенос в контейнер (сделать дочерним или в корень)
    if (overId.startsWith('container:')) {
      const newParentId = overId.replace('container:', '') === 'root' ? null : overId.replace('container:', '');
      const newIndex = getChildren(localPages, newParentId).length; // в конец
      const next = movePage(localPages, activeId, newParentId, newIndex);
      setLocalPages(next);
      await onReorder?.(next);
      return;
    }

    // Иначе — переупорядочивание относительно другой страницы (в пределах её родителя)
    const overPage = findById(localPages, overId);
    const activePage = findById(localPages, activeId);
    if (!overPage || !activePage) return;

    const targetParentId = overPage.parentId ?? null;

    const targetSiblings = getChildren(localPages, targetParentId);
    const overIndex = targetSiblings.findIndex(p => p._id === overPage._id);

    // Вставляем ПЕРЕД элементом, на который бросили
    const insertIndex = Math.max(0, overIndex);

    const next = movePage(localPages, activeId, targetParentId, insertIndex);
    setLocalPages(next);
    await onReorder?.(next);
  };

  const content = (
    <div ref={setContainerRef} role={isRoot ? 'tree' : 'group'} aria-label={isRoot ? 'Pages' : undefined}>
      <SortableContext items={currentPages.map(p => p._id)} strategy={verticalListSortingStrategy}>
        {currentPages.length === 0 && isRoot && (
          <span className="text-gray-400 pl-3 italic text-sm">No pages inside</span>
        )}
        {currentPages.map((page) => (
          <div key={page._id}>
            <PageItem
              page={page}
              bookId={bookId}
              expandedPage={expandedPages?.has(page._id)}
              onCreatePage={onCreatePage}
              togglePageExpansion={togglePageExpansion}
              onRemovePage={onRemovePage}
              depth={computeDepth(localPages, page._id)}
            />
            {expandedPages?.has(page._id) && (
              <div className='ml-3'>
                <PagesList
                  bookId={bookId}
                  onCreatePage={onCreatePage}
                  pages={localPages}
                  expandedPages={expandedPages}
                  parentId={page._id}
                  togglePageExpansion={togglePageExpansion}
                  onRemovePage={onRemovePage}
                  onReorder={onReorder}
                />
              </div>
            )}
          </div>
        ))}
      </SortableContext>
    </div>
  );

  if (!isRoot) return content;

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      {content}
    </DndContext>
  );
}

// Вычисление глубины для aria-level
function computeDepth(pages: Page[], id: string): number {
  let depth = 1;
  let cur = pages.find(p => p._id === id);
  const guard = new Set<string>();
  while (cur && cur.parentId) {
    if (guard.has(cur._id)) break;
    guard.add(cur._id);
    depth += 1;
    cur = pages.find(p => p._id === cur!.parentId);
  }
  return depth;
}
