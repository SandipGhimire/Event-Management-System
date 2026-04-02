"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameFile = exports.saveBuffer = exports.deleteFile = exports.saveFile = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const saveFile = (file, directory, fileName, oldFilePath) => {
    try {
        const publicDir = path.join(process.cwd(), "public");
        const targetDir = path.join(publicDir, directory);
        console.log(`📁 [saveFile] Saving to directory: ${directory}`);
        console.log(`📁 [saveFile] File name: ${fileName}, Original: ${file.originalname}`);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
            console.log(`📁 [saveFile] Created directory: ${targetDir}`);
        }
        if (oldFilePath) {
            const fullOldPath = path.join(publicDir, oldFilePath);
            if (fs.existsSync(fullOldPath)) {
                fs.unlinkSync(fullOldPath);
                console.log(`🗑️ [saveFile] Deleted old file: ${oldFilePath}`);
            }
        }
        const fileExt = path.extname(file.originalname);
        const finalFileName = `${fileName}${fileExt}`;
        const filePath = path.join(targetDir, finalFileName);
        const files = fs.readdirSync(targetDir);
        files.forEach((f) => {
            const baseName = path.parse(f).name;
            if (baseName === fileName) {
                const fullPath = path.join(targetDir, f);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                    console.log(`🗑️ [saveFile] Cleaned up existing file with same base name: ${f}`);
                }
            }
        });
        fs.writeFileSync(filePath, file.buffer);
        const relativePath = path.join(directory, finalFileName);
        console.log(`✅ [saveFile] Saved successfully: ${relativePath}`);
        return relativePath;
    }
    catch (error) {
        console.error(`❌ [saveFile] Error saving file:`, error);
        throw new common_1.InternalServerErrorException("Error saving file: " + error.message);
    }
};
exports.saveFile = saveFile;
const deleteFile = (filePath) => {
    try {
        const fullPath = path.join(process.cwd(), "public", filePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`🗑️ [deleteFile] Deleted: ${filePath}`);
        }
        else {
            console.log(`⚠️ [deleteFile] File not found (already deleted?): ${filePath}`);
        }
    }
    catch (error) {
        console.error(`❌ [deleteFile] Error deleting file:`, error);
    }
};
exports.deleteFile = deleteFile;
const saveBuffer = (buffer, directory, fileName, extension) => {
    try {
        const publicDir = path.join(process.cwd(), "public");
        const targetDir = path.join(publicDir, directory);
        console.log(`📁 [saveBuffer] Saving buffer to directory: ${directory}`);
        console.log(`📁 [saveBuffer] File name: ${fileName}${extension}`);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
            console.log(`📁 [saveBuffer] Created directory: ${targetDir}`);
        }
        const files = fs.readdirSync(targetDir);
        files.forEach((f) => {
            const baseName = path.parse(f).name;
            if (baseName === fileName) {
                const fullPath = path.join(targetDir, f);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                    console.log(`🗑️ [saveBuffer] Cleaned up existing file: ${f}`);
                }
            }
        });
        const finalFileName = `${fileName}${extension}`;
        const filePath = path.join(targetDir, finalFileName);
        fs.writeFileSync(filePath, buffer);
        const relativePath = path.join(directory, finalFileName);
        console.log(`✅ [saveBuffer] Saved successfully: ${relativePath}`);
        return relativePath;
    }
    catch (error) {
        console.error(`❌ [saveBuffer] Error saving buffer:`, error);
        throw new common_1.InternalServerErrorException("Error saving buffer: " + error.message);
    }
};
exports.saveBuffer = saveBuffer;
const renameFile = (oldPath, newFileName) => {
    try {
        const publicDir = path.join(process.cwd(), "public");
        const fullOldPath = path.join(publicDir, oldPath);
        if (!fs.existsSync(fullOldPath)) {
            console.log(`⚠️ [renameFile] Source not found: ${oldPath}`);
            return null;
        }
        const directory = path.dirname(oldPath);
        const extension = path.extname(oldPath);
        const finalNewFileName = `${newFileName}${extension}`;
        const newPath = path.join(directory, finalNewFileName);
        const fullNewPath = path.join(publicDir, newPath);
        const targetDir = path.dirname(fullNewPath);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        if (fs.existsSync(fullNewPath)) {
            fs.unlinkSync(fullNewPath);
        }
        fs.renameSync(fullOldPath, fullNewPath);
        console.log(`📝 [renameFile] Renamed: ${oldPath} → ${newPath}`);
        return newPath;
    }
    catch (error) {
        console.error(`❌ [renameFile] Error renaming file:`, error);
        return null;
    }
};
exports.renameFile = renameFile;
//# sourceMappingURL=file-upload.utils.js.map