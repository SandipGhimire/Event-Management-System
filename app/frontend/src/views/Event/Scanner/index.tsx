import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import ContentLayout from "@/components/common/ContentLayout";
import { Camera, X, CheckCircle2 } from "lucide-react";

interface UserData {
  name: string;
  position: string;
  phoneno: string;
  club: string;
}

export default function Scanner() {
  const [scannedData, setScannedData] = useState<UserData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);

  // Mock user data
  const generateMockUser = (): UserData => ({
    name: "John Doe",
    position: "President",
    phoneno: "TCKT-12345",
    club: "Leo Club of Kathmandu Atal Pingalasthan",
  });

  const startScanner = async () => {
    if (isStarting) return;

    try {
      setScannedData(null);
      setIsStarting(true);
      setError(null);

      const html5QrCode = new Html5Qrcode("reader");
      qrScannerRef.current = html5QrCode;

      const config = { fps: 60, qrbox: { width: 300, height: 300 } };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          console.log(decodedText);
          stopScanner();
          setScannedData(generateMockUser());
        },
        () => {}
      );

      setIsScanning(true);
      setIsStarting(false);
    } catch (err: any) {
      console.error("Scanner error:", err);
      setError(`Failed to start camera: ${err.message || "Unknown error"}`);
      setIsStarting(false);
    }
  };

  const stopScanner = async () => {
    if (qrScannerRef.current && qrScannerRef.current.isScanning) {
      try {
        await qrScannerRef.current.stop();
        qrScannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.error("Stop error:", err);
      }
    }
  };

  useEffect(() => {
    // Cleanup scanner on unmount
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

              {!isScanning && !scannedData && (
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

              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="line" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error message */}
        {error && !scannedData && (
          <div className="mb-6 p-4 bg-error/5 border border-error/10 text-error rounded text-center text-xs font-semibold flex items-center justify-center gap-2">
            <X className="w-4 h-4" />
            {error}
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

              <div className="bg-secondary/5 p-5 rounded border border-border break-all font-mono text-sm text-primary-dark space-y-2">
                <div>
                  <strong>Name:</strong> {scannedData.name}
                </div>
                <div>
                  <strong>Position:</strong> {scannedData.position}
                </div>
                <div>
                  <strong>Club:</strong> {scannedData.club}
                </div>
                <div>
                  <strong>Phone:</strong> {scannedData.phoneno}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button onClick={() => setScannedData(null)} className="btn btn-outline-secondary btn-lg flex-1 gap-2">
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
