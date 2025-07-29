import { useState, useEffect } from 'react';
import { Page } from '@/app/utils/interfaces';
import { getPagesForPages } from '@/app/actions/pageActions';

export const useExpandedNodes = (
    bookId: string,
    pagesFlat: Page[],
    childrenCache: { [id: string]: Page[] },
    setChildrenCache: React.Dispatch<React.SetStateAction<{ [id: string]: Page[] }>>
) => {
    const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
    const [isExpandedLoaded, setIsExpandedLoaded] = useState(false);
    const [loadingChildren, setLoadingChildren] = useState<string[]>([]);

    // Load expanded nodes from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedState = localStorage.getItem(`expandedNodes_${bookId}`);
                if (savedState) {
                    const parsedState = JSON.parse(savedState);
                    if (Array.isArray(parsedState)) {
                        setExpandedNodes(parsedState);
                    }
                }
            } catch (error) {
                console.error("Failed to parse expandedNodes from localStorage:", error);
            } finally {
                setIsExpandedLoaded(true);
            }
        }
    }, [bookId]);

    // Save expanded nodes to localStorage
    useEffect(() => {
        if (isExpandedLoaded) {
            localStorage.setItem(`expandedNodes_${bookId}`, JSON.stringify(expandedNodes));
        }
    }, [expandedNodes, isExpandedLoaded, bookId]);

    // Clean up localStorage when all children are loaded
    useEffect(() => {
        if (!isExpandedLoaded) return;

        const idsStillLoading = expandedNodes.filter(
            id => loadingChildren.includes(id) || !childrenCache[id]
        );

        if (idsStillLoading.length === 0) {
            const loadedIds = new Set([
                ...pagesFlat.map(p => p._id),
                ...Object.values(childrenCache).flat().map(p => p._id),
            ]);

            const validExpandedNodes = expandedNodes.filter(id => loadedIds.has(id));

            if (validExpandedNodes.length !== expandedNodes.length) {
                setExpandedNodes(validExpandedNodes);
                localStorage.setItem(`expandedNodes_${bookId}`, JSON.stringify(validExpandedNodes));
            }
        }
    }, [expandedNodes, loadingChildren, childrenCache, isExpandedLoaded, pagesFlat, bookId]);

    // Load children for expanded nodes
    useEffect(() => {
        if (!isExpandedLoaded) return;

        const idsToLoad = expandedNodes.filter(id => !childrenCache.hasOwnProperty(id) && !loadingChildren.includes(id));

        if (idsToLoad.length === 0) return;

        setLoadingChildren(prev => [...prev, ...idsToLoad]);

        getPagesForPages(bookId, idsToLoad).then((children: Page[]) => {
            const grouped: { [id: string]: Page[] } = {};
            
            idsToLoad.forEach(id => {
                grouped[id] = [];
            });
            
            children.forEach(child => {
                if (child.parentId && grouped.hasOwnProperty(child.parentId)) {
                    grouped[child.parentId].push(child);
                }
            });

            setChildrenCache(prev => ({ ...prev, ...grouped }));
            setLoadingChildren(prev => prev.filter(id => !idsToLoad.includes(id)));
        });
    }, [isExpandedLoaded, expandedNodes, childrenCache, loadingChildren, bookId, setChildrenCache]);

    const toggleNode = (id: string) => {
        if (expandedNodes.includes(id)) {
            setExpandedNodes(prev => prev.filter(nodeId => nodeId !== id));
        } else {
            setExpandedNodes(prev => [...prev, id]);

            if (!childrenCache[id]) {
                setLoadingChildren(prev => [...prev, id]);

                getPagesForPages(bookId, [id]).then(children => {
                    setChildrenCache(prev => ({ ...prev, [id]: children }));
                    setLoadingChildren(prev => prev.filter(loadingId => loadingId !== id));
                });
            }
        }
    };

    const isNodeExpanded = (id: string) => expandedNodes.includes(id);

    return {
        expandedNodes,
        isExpandedLoaded,
        loadingChildren,
        toggleNode,
        isNodeExpanded
    };
};