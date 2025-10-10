import { Page } from '@/app/utils/interfaces'

export interface TreeItem extends Page{}

export interface TreeItems extends Array<TreeItem> {}

export interface FlattenedItem extends TreeItem{
    depth: number;
    index: number;
    hasChildren: boolean;
}