'use client';

import React from 'react';
import { Block } from '@/app/utils/interfaces';
import DraftEditor from './draft-editor';
import TiptapEditor from './tip-tap-editor';

interface BlockRendererProps {
    block: Block;
}

export default function BlockRenderer({ block }: BlockRendererProps) {
    switch (block.type) {
        case 'draft':
            return (
                <DraftEditor
                    block={{
                        content: block.content,
                        _id: block._id,
                        pageId: block.pageId,
                    }}
                />
            );
        case 'tiptap':
            return <TiptapEditor content={block.content} />;
        default:
            return <p>Unsupported editor type: {block.type}</p>;
    }
}
