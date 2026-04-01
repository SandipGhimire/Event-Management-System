import Modal from "./Modal";
import { ExternalLink } from "lucide-react";

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  src: string;
  alt?: string;
}

export default function ImageViewer({ isOpen, onClose, title = "Image Viewer", src, alt = "Image" }: ImageViewerProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full max-h-[70vh] rounded-lg overflow-hidden border border-border bg-muted/20 flex items-center justify-center">
          <img src={src} alt={alt} className="max-w-full max-h-full object-contain shadow-lg" />
        </div>
        <div className="flex justify-end w-full">
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
      </div>
    </Modal>
  );
}
