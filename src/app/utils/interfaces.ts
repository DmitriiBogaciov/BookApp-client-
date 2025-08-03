import { RawDraftContentState } from "draft-js";

export interface Book {
    _id: string;
    title: string;
    description: string;
    author: string;
    visibility: boolean;
}

export interface Page {
    _id: string;
    title: string;
    parentId: string | null;
    bookId: string;
    visibility: boolean;
    order: number;
    content: string;
}

export interface Block {
    _id: string;
    type: string;
    title: string;
    pageId: string;
    order: number;
    content: string;
}