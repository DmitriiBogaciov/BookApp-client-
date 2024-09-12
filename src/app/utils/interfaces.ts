export interface Book {
    _id: string;
    title: string;
    description: string;
    author: string;
    visibility: boolean;
}

export interface Page {
    _id: string;
    title: string,
    order: number
}