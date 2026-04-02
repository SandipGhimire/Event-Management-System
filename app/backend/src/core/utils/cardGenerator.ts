import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import path from "path";
import { generateQRCode } from "./qrGenerator";

const CARD_BG = path.join(process.cwd(), "public", "img", "card.png");

GlobalFonts.registerFromPath(path.join(process.cwd(), "public", "font", "Montserrat.ttf"), "Montserrat");

GlobalFonts.registerFromPath(path.join(process.cwd(), "public", "font", "PottaOne.ttf"), "PottaOne");

type IdCardData = {
  name: string;
  position: string;
  club: string;
  qrCodeText: string;
  profilePicBuffer?: Buffer | null;
};

/**
 * Generates an ID card image as a PNG Buffer.
 * Uses card.png as background, logo.png as an overlay, draws the profile
 * photo, QR code, and attendee text (name, position, club).
 *
 * @returns PNG image buffer
 */
export async function generateIdCard(data: IdCardData): Promise<Buffer> {
  const template = await loadImage(CARD_BG);

  const canvasWidth = 3543;
  const canvasHeight = 4724;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  // -----------------------------
  // Profile photo (drawn BEFORE template so template overlays on top)
  // -----------------------------
  if (data.profilePicBuffer) {
    const profile = await loadImage(data.profilePicBuffer);

    const fixedWidth = 1200;
    const aspectRatio = profile.height / profile.width;

    const drawWidth = fixedWidth;
    const drawHeight = fixedWidth * aspectRatio;

    const centerX = canvasWidth / 1.97;
    const drawX = centerX - drawWidth / 2;
    const drawY = 2100;

    ctx.drawImage(profile, drawX, drawY, drawWidth, drawHeight);
  }

  // -----------------------------
  // Draw background template (on top of profile so cutout works)
  // -----------------------------
  ctx.drawImage(template, 0, 0, canvasWidth, canvasHeight);

  // -----------------------------
  // QR Code
  // -----------------------------
  const qrBuffer = await generateQRCode({ text: data.qrCodeText, size: 2000 });
  const qrCode = await loadImage(qrBuffer);
  ctx.drawImage(qrCode, 2690, 2620, 730, 730);

  // -----------------------------
  // Text: Name, Position, Club
  // -----------------------------
  ctx.textAlign = "center";

  // NAME
  ctx.font = "500 150px PottaOne";
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#ffffff";
  ctx.strokeText(data.name, canvasWidth / 2, 3560);
  ctx.fillStyle = "#d71627";
  ctx.fillText(data.name, canvasWidth / 2, 3560);

  // POSITION
  ctx.font = "bold 90px Montserrat";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#ffffff";
  ctx.strokeText(data.position, canvasWidth / 2, 3715);
  ctx.fillStyle = "#03458e";
  ctx.fillText(data.position, canvasWidth / 2, 3715);

  // CLUB
  ctx.font = "bold 90px Montserrat";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#ffffff";
  ctx.strokeText(data.club, canvasWidth / 2, 3815);
  ctx.fillStyle = "#03458e";
  ctx.fillText(data.club, canvasWidth / 2, 3815);

  // -----------------------------
  // Return PNG buffer
  // -----------------------------
  return Buffer.from(canvas.toBuffer("image/png"));
}
