'use server';
import BlockService from "../services/block-service";
import { Block } from "../utils/interfaces";
const blockService = new BlockService

export async function getBlocksForPage(id: string) {
    return await blockService.getBlocksForPage(id);
}

export async function updateBlock(block: Block){
    return await blockService.updateBlock(block)
}

