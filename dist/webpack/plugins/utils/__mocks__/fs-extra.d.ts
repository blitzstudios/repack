declare class FsNode {
    path: string;
    value?: string;
    children?: FsNode[];
    constructor(path: string);
    makeDir(): void;
    makeFile(value: string): void;
    findDir(dirname: string, create?: boolean): FsNode;
}
declare class FsMock {
    fs: FsNode;
    constructor();
    ensureDir(dirname: string): Promise<void>;
    copyFile(from: string, to: string): Promise<void>;
    readFile(filePath: string): Promise<string>;
    writeFile(filePath: string, value: string): Promise<void>;
}
declare const _default: FsMock;
export default _default;
