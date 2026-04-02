import Modal from "./Modal";
import { ExternalLink, Printer } from "lucide-react";
import { useCallback } from "react";

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  src: string;
  alt?: string;
  printWidth?: string;
  printHeight?: string;
  isIdCard?: boolean;
}

export default function ImageViewer({
  isOpen,
  onClose,
  title = "Image Viewer",
  src,
  alt = "Image",
  printWidth,
  printHeight,
}: ImageViewerProps) {
  const handlePrint = useCallback(() => {
    const pWidth = printWidth;
    const pHeight = printHeight;

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.writeln(`
    <html>
      <head>
        <title>Print ${title}</title>
        <style>
          ${
            pWidth && pHeight
              ? `@page {
            size: ${pWidth} ${pHeight};
            margin: 0;
          }`
              : ""
          }
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
            background: white;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <img src="${src}" onload="window.focus(); window.print();" />
      </body>
    </html>
  `);
    doc.close();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, [printWidth, printHeight, src, title]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      footer={
        <div className="flex justify-end w-full gap-2">
          <button onClick={handlePrint} className="btn btn-primary btn-sm flex items-center gap-2">
            <Printer size={16} />
            Print
          </button>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary btn-sm flex items-center gap-2"
          >
            <ExternalLink size={16} />
            Open in New Tab
          </a>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full max-h-[70vh] rounded-lg overflow-hidden border border-border bg-muted/20 flex items-center justify-center">
          <img src={src} alt={alt} className="max-w-full max-h-full shadow-lg" />
        </div>
      </div>
    </Modal>
  );
}
