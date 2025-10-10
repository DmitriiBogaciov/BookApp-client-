import { Page } from '@/app/utils/interfaces';
import { TreeItems, FlattenedItem } from './types';
import { arrayMove } from '@dnd-kit/sortable'

export function getProjection(
    items: FlattenedItem[],
    activeId: string,
    overId: string,
    dragOffset: number,
    indentationWidth: number,
) {
    const overIndex = items.findIndex(item => item._id === overId);
    const activeIndex = items.findIndex(item => item._id === activeId);
    const activeItem = items[activeIndex];
    const newItems = arrayMove(items, activeIndex, overIndex);
    const prevItem = newItems[overIndex - 1];
    const nextItem = newItems[overIndex + 1];
    const maxDepth = getMaxDepth({ previousItem: prevItem });
    const dragDepth = getDragDepth(dragOffset, indentationWidth);
    const minDepth = getMinDepth({ nextItem });
    const projectedDepth = activeItem?.depth + dragDepth;

    if (!overId && !activeId) {
        return null;
    } else if (overIndex === -1 || activeIndex === -1) {
        return null;
    }

    let depth = projectedDepth;

    if (projectedDepth >= maxDepth) {
        depth = maxDepth;
    } else if (projectedDepth < minDepth) {
        depth = minDepth;
    }

    return {
        depth,
        maxDepth,
        minDepth,
        parentId: getParentId(),
        prevItem,
        nextItem,
        activeItem,
        overIndex
    }

    function getParentId() {
        if (depth === 0 || !prevItem) {
            return null;
        }

        if (prevItem.parentId === activeItem._id) {
            return null;
        }

        if (depth === prevItem.depth) {
            return prevItem.parentId;
        }

        if (depth > prevItem.depth) {
            return prevItem._id;
        }

        const newParent = newItems
            .slice(0, overIndex)
            .reverse()
            .find((item) => item.depth === depth)?.parentId;

        return newParent ?? null;
    }
}

function getDragDepth(offset: number, indentationWidth: number) {
    return Math.round(offset / indentationWidth);
}

function getMaxDepth({ previousItem }: { previousItem: FlattenedItem }) {
    if (previousItem) {
        return previousItem.depth + 1;
    }
    return 0;
}

function getMinDepth({ nextItem }: { nextItem: FlattenedItem }) {
    if (nextItem) {
        return nextItem.depth;
    }

    return 0;
}

export function flattenTree(
    items: TreeItems,
    expandedItems: Set<string> | null = null,
    activeId: string | null,
    overId: string | null
): FlattenedItem[] {
    const byParent: Record<string, TreeItems> = {};
    items.forEach(item => {
        const key = item.parentId || "root";
        if (!byParent[key]) byParent[key] = [];
        byParent[key].push(item);
    });

    Object.values(byParent).forEach(arr =>
        arr.sort((a, b) => a.order - b.order)
    );

    // console.log(`${flattenTree.name} ActiveId: ${activeId}`)

    function walk(parentId: string | null, depth = 0): FlattenedItem[] {
        const key = parentId || "root";
        const children = byParent[key] || [];
        return children.flatMap((item, index) => {
            const hasChildren = (byParent[item._id]?.length ?? 0) > 0;
            const flattened: FlattenedItem = { ...item, depth, index, hasChildren };
            if (expandedItems?.has(item._id) && item._id !== activeId) {
                return [flattened, ...walk(item._id, depth + 1)];
            }
            return [flattened];
        });
    }

    const result = walk(null, 0);
    console.log(`${flattenTree.name} Flattened:`, result.map((i) => { return { title: i.title, order: i.order, hasChildren: i.hasChildren }; }));
    return result;
}