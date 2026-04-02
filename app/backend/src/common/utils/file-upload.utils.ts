import { InternalServerErrorException } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

/**
 * Saves a file to the specified directory and optionally deletes an old file.
 * @param file The uploaded file
 * @param directory The directory relative to 'public' (e.g., 'attendees/profile')
 * @param fileName The desired file name (without extension)
 * @param oldFilePath Optional relative path to the old file to be deleted
 * @returns The relative path to the saved file
 */
export const saveFile = (
  file: Express.Multer.File,
  directory: string,
  fileName: string,
  oldFilePath?: string | null
): string => {
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

    // Remove any existing file with the same base name (handles extension changes)
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
  } catch (error) {
    console.error(`❌ [saveFile] Error saving file:`, error);
    throw new InternalServerErrorException("Error saving file: " + (error as Error).message);
  }
};

/**
 * Deletes a file from the public directory.
 * @param filePath The relative path to the file
 */
export const deleteFile = (filePath: string) => {
  try {
    const fullPath = path.join(process.cwd(), "public", filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`🗑️ [deleteFile] Deleted: ${filePath}`);
    } else {
      console.log(`⚠️ [deleteFile] File not found (already deleted?): ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ [deleteFile] Error deleting file:`, error);
  }
};

/**
 * Saves a raw Buffer to the specified directory (relative to 'public').
 * Removes any existing file with the same base name before saving.
 * @param buffer The file content as a Buffer
 * @param directory The directory relative to 'public' (e.g., 'attendees/idcard')
 * @param fileName The desired file name (without extension)
 * @param extension The file extension including dot (e.g., '.png')
 * @returns The relative path to the saved file
 */
export const saveBuffer = (buffer: Buffer, directory: string, fileName: string, extension: string): string => {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const targetDir = path.join(publicDir, directory);

    console.log(`📁 [saveBuffer] Saving buffer to directory: ${directory}`);
    console.log(`📁 [saveBuffer] File name: ${fileName}${extension}`);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(`📁 [saveBuffer] Created directory: ${targetDir}`);
    }

    // Remove any existing file with the same base name
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
  } catch (error) {
    console.error(`❌ [saveBuffer] Error saving buffer:`, error);
    throw new InternalServerErrorException("Error saving buffer: " + (error as Error).message);
  }
};

/**
 * Renames a file in the public directory.
 * @param oldPath The current relative path to the file
 * @param newFileName The new name for the file (without extension)
 * @returns The new relative path to the file
 */
export const renameFile = (oldPath: string, newFileName: string): string | null => {
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
  } catch (error) {
    console.error(`❌ [renameFile] Error renaming file:`, error);
    return null;
  }
};
