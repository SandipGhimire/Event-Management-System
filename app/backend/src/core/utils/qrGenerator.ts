import QRCode from "qrcode";
import sharp from "sharp";

const QR_COLOR = "#9D0603";
const BG_COLOR = "#FFFFFF";

type GenerateQRParams = {
  text: string;
  size?: number;
};

/**
 * Generates a QR code as a PNG Buffer (no disk I/O).
 * @returns PNG image buffer
 */
export async function generateQRCode({ text, size = 2000 }: GenerateQRParams): Promise<Buffer> {
  const qrSvg = await QRCode.toString(text, {
    type: "svg",
    margin: 4,
    color: {
      dark: QR_COLOR,
      light: BG_COLOR,
    },
    width: size,
  });

  return await sharp(Buffer.from(qrSvg)).png({ compressionLevel: 9 }).toBuffer();
}
