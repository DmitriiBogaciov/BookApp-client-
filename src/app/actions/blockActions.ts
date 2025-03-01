'use server';
import BlockService, { CreateDtoIn } from "../services/block-service";
import { Block } from "../utils/interfaces";

const blockService = new BlockService();

export async function getBlocksForPage(id: string) {
    try {
        return await blockService.getBlocksForPage(id);
    } catch (error) {
        console.error("Ошибка получения блоков:", error);
        throw new Error("Не удалось загрузить блоки страницы");
    }
}

export async function updateBlock(block: Block) {
    try {
        return await blockService.updateBlock(block);
    } catch (error) {
        console.error("Ошибка обновления блока:", error);
        throw new Error("Не удалось обновить блок");
    }
}

export async function createBlock(DtoIn: CreateDtoIn) {
    try {
        console.log("создание блока")
        return await blockService.createBlock(DtoIn);
    } catch (error) {
        // console.error("Ошибка создания блока:", error);
        throw new Error("Не удалось создать блок");
    }
}

export async function removeBlock(id: string) {
    try {
        return await blockService.removeOneBlock(id);
    } catch (error) {
        console.error("Ошибка удаления блока:", error);
        throw new Error("Не удалось удалть блок");
    }
}
