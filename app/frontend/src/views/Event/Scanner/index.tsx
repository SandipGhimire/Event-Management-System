import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import ContentLayout from "@/components/common/ContentLayout";
import { Camera, X, CheckCircle2 } from "lucide-react";
import api from "@/core/app/api";
import { useHasPermission } from "@/core/utils/permission.utils";
import TaskToggleList from "../Attendees/TaskToggleList";
import type { AttendeesDetail, TaskDetail } from "shared-types";
import { toast } from "react-toastify";

export default function Scanner() {
  const [scannedData, setScannedData] = useState<AttendeesDetail | null>(null);
  const [tasks, setTasks] = useState<TaskDetail[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isFetchingAttendee, setIsFetchingAttendee] = useState(false);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);

  const canToggleTask = useHasPermission("attendee.qr_task_toggle");

  const startScanner = async () => {
    if (isStarting) return;

    try {
      setIsStarting(true);

      if (scannedData) {
        setScannedData(null);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      await stopScanner();

      const readerElement = document.getElementById("reader");
      if (!readerElement) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        if (!document.getElementById("reader")) {
          throw new Error("Scanner display area not ready. Please try again.");
        }
      }

      const html5QrCode = new Html5Qrcode("reader");
      qrScannerRef.current = html5QrCode;

      const config = { fps: 60, qrbox: { width: 300, height: 300 } };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          await stopScanner();
          setIsFetchingAttendee(true);
          try {
            const { data: res } = await api.get(`/attendees/qr/${decodedText}`);
            if (res.success && res.data) {
              setScannedData(res.data);
              toast.success("Attendee matched!");
            } else {
              toast.error(res.message || "Attendee not found for this QR code.");
            }
          } catch (err: any) {
            toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to fetch attendee details");
          } finally {
            setIsFetchingAttendee(false);
          }
        },
        () => {}
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error("Scanner error:", err);
      toast.error(`Failed to start camera: ${err.message || "Unknown error"}`);
    } finally {
      setIsStarting(false);
    }
  };

  const stopScanner = async () => {
    if (qrScannerRef.current) {
      try {
        if (qrScannerRef.current.isScanning) {
          await qrScannerRef.current.stop();
        }
      } catch (err) {
        console.error("Stop error:", err);
      } finally {
        qrScannerRef.current = null;
        setIsScanning(false);
      }
    }
  };

  useEffect(() => {
    api
      .get("/task/list", { params: { pageSize: 100 } })
      .then((res) => setTasks(res.data.data.data || []))
      .catch((err) => console.error("Failed to load tasks", err));

    return () => {
      stopScanner();
    };
  }, []);

  return (
    <ContentLayout
      header={{
        label: "QR Registry Gateway",
      }}
      buttons={[
        {
          label: isScanning ? "Disable Scanner" : "Scan QR",
          onClick: isScanning ? stopScanner : startScanner,
          className: isScanning ? "btn-outline-danger" : "btn-primary",
        },
      ]}
    >
      <div className="max-w-xl mx-auto py-4 sm:py-8">
        {/* Scanner container */}
        {!scannedData && (
          <div className="relative group mb-8">
            <div className="absolute -inset-1 bg-primary/10 rounded-xl blur-lg opacity-25 group-hover:opacity-40 transition duration-1000"></div>

            <div className="relative bg-background rounded-lg border border-border-alt overflow-hidden shadow-sm flex flex-col min-h-[300px] sm:min-h-[400px]">
              <div id="reader" className="w-full h-full object-cover"></div>

              {!isScanning && !scannedData && !isFetchingAttendee && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary/40">
                    <Camera className="w-10 h-10" />
                  </div>
                  <div className="max-w-xs">
                    <h3 className="text-text-primary font-bold text-lg">Scanner Offline</h3>
                    <p className="text-sm text-text-secondary mt-2">Start the camera to scan attendee QR codes.</p>
                  </div>
                </div>
              )}

              {isFetchingAttendee && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <div className="max-w-xs">
                    <h3 className="text-text-primary font-bold text-lg">Verifying QR Code...</h3>
                    <p className="text-sm text-text-secondary mt-2">Please wait while we resolve attendee data.</p>
                  </div>
                </div>
              )}

              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="line" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Display scanned user data */}
        {scannedData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border-2 border-primary/10 rounded-lg p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-success animate-in slide-in-from-left duration-1000"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-text-primary font-black text-lg">Credential Verified</h3>
                  <p className="text-xs text-text-secondary font-medium italic">Data extracted</p>
                </div>
              </div>

              <div className="bg-secondary/5 p-5 rounded border border-border break-all text-sm text-primary-dark space-y-2 mb-6">
                <div>
                  <strong>Name:</strong> <span className="font-mono">{scannedData.name}</span>
                </div>
                <div>
                  <strong>Position:</strong> <span className="font-mono">{scannedData.position || "N/A"}</span>
                </div>
                <div>
                  <strong>Club:</strong> <span className="font-mono">{scannedData.clubName}</span>
                </div>
                <div>
                  <strong>Phone:</strong> <span className="font-mono">{scannedData.phoneNumber}</span>
                </div>
                {scannedData.membershipID && (
                  <div>
                    <strong>Membership ID:</strong> <span className="font-mono">{scannedData.membershipID}</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-text-primary mb-3">Tasks Action</h4>
                <TaskToggleList
                  attendee={scannedData}
                  tasks={tasks}
                  apiPathPrefix={`qr/${scannedData.qrCode}`}
                  canToggle={canToggleTask}
                  onUpdated={(updated) => setScannedData(updated)}
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button onClick={() => startScanner()} className="btn btn-outline-secondary btn-lg flex-1 gap-2">
                  <Camera className="w-4 h-4" /> Scan Next
                </button>
                <button
                  onClick={() => setScannedData(null)}
                  className="btn btn-outline-danger btn-lg flex-1 gap-2 text-danger hover:bg-danger/10"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
