interface MoveElementBeforeConfig<T> {
    beforeElement: string | RegExp;
    elementToMove: string | RegExp;
    getElement?: (item: T) => string;
}
export declare function moveElementBefore<T>(array: T[], { beforeElement, elementToMove, getElement, }: MoveElementBeforeConfig<T>): void;
export {};
