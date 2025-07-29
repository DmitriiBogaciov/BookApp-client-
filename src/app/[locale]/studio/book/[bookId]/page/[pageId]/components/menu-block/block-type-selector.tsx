import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

interface BlockTypeSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectType: (type: string) => void;
}

const blockTypes = [
    {
        type: 'draft',
        icon: '📝',
        title: 'Draft',
        description: 'Start writing with plain text'
    },
    { 
        type: 'slate',
        icon: '📖',
        title: 'Slate',
        description: 'A rich text editor for creating and editing content'
    }
    // {
    //     type: 'heading1',
    //     icon: '📰',
    //     title: 'Heading 1',
    //     description: 'Big section heading'
    // },
    // {
    //     type: 'heading2',
    //     icon: '📄',
    //     title: 'Heading 2',
    //     description: 'Medium section heading'
    // },
    // {
    //     type: 'heading3',
    //     icon: '📃',
    //     title: 'Heading 3',
    //     description: 'Small section heading'
    // },
    // {
    //     type: 'bulleted-list',
    //     icon: '•',
    //     title: 'Bulleted List',
    //     description: 'Create a simple bulleted list'
    // },
    // {
    //     type: 'numbered-list',
    //     icon: '1.',
    //     title: 'Numbered List',
    //     description: 'Create a list with numbering'
    // },
    // {
    //     type: 'quote',
    //     icon: '❝',
    //     title: 'Quote',
    //     description: 'Capture a quote'
    // },
    // {
    //     type: 'code',
    //     icon: '⌨️',
    //     title: 'Code',
    //     description: 'Capture a code snippet'
    // },
    // {
    //     type: 'divider',
    //     icon: '➖',
    //     title: 'Divider',
    //     description: 'Visually divide blocks'
    // }
];

export default function BlockTypeSelector({ isOpen, onClose, onSelectType }: BlockTypeSelectorProps) {
    const handleTypeSelect = (type: string) => {
        onSelectType(type);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} toggle={onClose} size="md">
            <ModalHeader toggle={onClose}>
                Choose a block type
            </ModalHeader>
            <ModalBody>
                <div className="grid gap-2">
                    {blockTypes.map((blockType) => (
                        <div
                            key={blockType.type}
                            className="flex items-center p-3 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => handleTypeSelect(blockType.type)}
                        >
                            <div className="text-2xl mr-3">
                                {blockType.icon}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    {blockType.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {blockType.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ModalBody>
        </Modal>
    );
}