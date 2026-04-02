export declare const saveFile: (file: Express.Multer.File, directory: string, fileName: string, oldFilePath?: string | null) => string;
export declare const deleteFile: (filePath: string) => void;
export declare const saveBuffer: (buffer: Buffer, directory: string, fileName: string, extension: string) => string;
export declare const renameFile: (oldPath: string, newFileName: string) => string | null;
