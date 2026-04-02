import { useEffect, useState, useCallback } from "react";
import Modal from "@/components/common/Modal";
import { Printer, Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/core/app/api";
import endpoints from "@/core/app/endpoints";
import { getBackendFile } from "@/core/utils/common.utils";

interface AllIDCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AttendeeWithCard {
  id: number;
  name: string;
  idCard: string;
}

export default function AllIDCardsModal({ isOpen, onClose }: AllIDCardsModalProps) {
  const [loading, setLoading] = useState(false);
  const [attendees, setAttendees] = useState<AttendeeWithCard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [printWidth, setPrintWidth] = useState("900");
  const [printHeight, setPrintHeight] = useState("1200");
  const [unit, setUnit] = useState("px");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoints.attendees.allIdCards);
      if (response.data.success) {
        setAttendees(response.data.data.attendees);
        setIsGenerating(response.data.data.isGenerating);

        if (response.data.data.isGenerating) {
          toast.info(
            "Some ID cards are being generated in the background. Please try again in a moment for the full set."
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch ID cards", error);
      toast.error("Failed to fetch ID cards");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, fetchData]);

  const handlePrintAll = () => {
    const pWidth = `${printWidth}${unit}`;
    const pHeight = `${printHeight}${unit}`;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const cardsHtml = attendees
      .map(
        (attendee) => `
      <div class="page-break">
        <img src="${getBackendFile(attendee.idCard)}" alt="${attendee.name}" />
      </div>
    `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print All ID Cards</title>
          <style>
            @page {
              size: ${pWidth} ${pHeight};
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .page-break {
              page-break-after: always;
              width: ${pWidth};
              height: ${pHeight};
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
            }
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          ${cardsHtml}
          <script>
            window.onload = () => {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="All Attendee ID Cards"
      size="xl"
      footer={
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Width:</span>
              <input
                type="text"
                value={printWidth}
                onChange={(e) => setPrintWidth(e.target.value)}
                className="form-control form-control-sm w-16"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Height:</span>
              <input
                type="text"
                value={printHeight}
                onChange={(e) => setPrintHeight(e.target.value)}
                className="form-control form-control-sm w-16"
              />
            </div>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="form-control form-control-sm w-16"
            >
              <option value="mm">mm</option>
              <option value="in">in</option>
              <option value="px">px</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchData}
              className="btn btn-outline-primary btn-sm flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={handlePrintAll}
              className="btn btn-primary btn-sm flex items-center gap-2"
              disabled={loading || attendees.length === 0}
            >
              <Printer size={16} />
              Print All ({attendees.length})
            </button>
          </div>
        </div>
      }
    >
      {loading && attendees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={48} className="animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Fetching ID cards...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 max-h-[60vh] overflow-y-auto">
          {attendees.map((attendee) => (
            <div
              key={attendee.id}
              className="border border-border rounded-lg p-2 bg-muted/10 hover:bg-muted/30 transition-colors group"
            >
              <div className="aspect-[3/4] rounded-md overflow-hidden border border-border bg-white flex items-center justify-center relative">
                <img
                  src={getBackendFile(attendee.idCard)}
                  alt={attendee.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-bold truncate">{attendee.name}</p>
              </div>
            </div>
          ))}
          {attendees.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center">
              <p className="text-muted-foreground">No ID cards found.</p>
            </div>
          )}
        </div>
      )}

      {isGenerating && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-blue-700 text-sm">
          <RefreshCw size={16} className="animate-spin" />
          <span>Generating missing ID cards in the background...</span>
        </div>
      )}
    </Modal>
  );
}
