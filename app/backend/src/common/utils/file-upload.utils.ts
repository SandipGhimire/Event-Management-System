import { InternalServerErrorException } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

/**
 * Saves a file to the specified directory and optionally deletes an old file.
 * @param file The uploaded file
 * @param directory The directory relative to 'public' (e.g., 'attendees')
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

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (oldFilePath) {
      const fullOldPath = path.join(publicDir, oldFilePath);
      if (fs.existsSync(fullOldPath)) {
        fs.unlinkSync(fullOldPath);
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
        }
      }
    });

    fs.writeFileSync(filePath, file.buffer);

    return path.join(directory, finalFileName);
  } catch (error) {
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
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

/**
 * Saves a raw Buffer to the specified directory (relative to 'public').
 * Removes any existing file with the same base name before saving.
 * @param buffer The file content as a Buffer
 * @param directory The directory relative to 'public' (e.g., 'attendees')
 * @param fileName The desired file name (without extension)
 * @param extension The file extension including dot (e.g., '.png')
 * @returns The relative path to the saved file
 */
export const saveBuffer = (buffer: Buffer, directory: string, fileName: string, extension: string): string => {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const targetDir = path.join(publicDir, directory);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Remove any existing file with the same base name
    const files = fs.readdirSync(targetDir);
    files.forEach((f) => {
      const baseName = path.parse(f).name;
      if (baseName === fileName) {
        const fullPath = path.join(targetDir, f);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    });

    const finalFileName = `${fileName}${extension}`;
    const filePath = path.join(targetDir, finalFileName);
    fs.writeFileSync(filePath, buffer);

    return path.join(directory, finalFileName);
  } catch (error) {
    throw new InternalServerErrorException("Error saving buffer: " + (error as Error).message);
  }
};
