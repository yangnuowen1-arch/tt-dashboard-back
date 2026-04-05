export declare class PresignItemDto {
    clientItemId: string;
    fileName: string;
    mime: string;
    sizeBytes: number;
    kind: "video" | "image";
}
export declare class BatchPresignDto {
    items: PresignItemDto[];
}
