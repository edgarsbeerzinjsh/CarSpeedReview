import { BATCH_SIZE } from "./../constants/BatchSize";
import { RoadEntries } from "../types/RoadEntries";

export const splitContent = (content: RoadEntries[]) => {
    const batchSize = BATCH_SIZE;
    const batches: RoadEntries[][] = [];
    let currentBatch: RoadEntries[] = [];

    content.forEach((entry, index) => {
        currentBatch.push(entry);
        if (currentBatch.length === batchSize || index === content.length -1){
            batches.push(currentBatch);
            currentBatch = [];
        }
    })

    return batches;
}