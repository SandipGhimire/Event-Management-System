import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import ContentLayout from "@/components/common/ContentLayout";
import { Scan, Camera, X, CheckCircle2, AlertTriangle, RefreshCw, Power } from "lucide-react";

export default function Scanner() {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSecure, setIsSecure] = useState(true);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);

  const startScanner = async () => {
    try {
      setError(null);
      const html5QrCode = new Html5Qrcode("reader");
      qrScannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          setScannedResult(decodedText);
          stopScanner();
        },
        () => {} // silent on failure to scan in frame
      );
      setIsScanning(true);
    } catch (err: any) {
      console.error("Scanner error:", err);
      setError(`Failed to start camera: ${err.message || "Unknown error"}`);
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
    // Check for Secure Context (HTTPS or localhost)
    if (!window.isSecureContext && window.location.hostname !== "localhost") {
      setIsSecure(false);
      setError(
        "Camera access requires a Secure Context (HTTPS). Please access via localhost or an SSL-enabled domain."
      );
    }

    return () => {
      stopScanner();
    };
  }, []);

  return (
    <ContentLayout
      header="QR Registry Gateway"
      buttons={[
        {
          label: isScanning ? "Disable Scanner" : "Launch Camera",
          onClick: isScanning ? stopScanner : startScanner,
          className: isScanning ? "btn-outline-danger" : "btn-primary",
        },
      ]}
    >
      <div className="max-w-xl mx-auto py-4 sm:py-8">
        {!isSecure && (
          <div className="mb-6 bg-error/10 border border-error/20 p-4 rounded flex items-center gap-4 text-error animate-in fade-in duration-500">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Security Restriction</h4>
              <p className="text-xs opacity-90">
                Browser security policies block camera access on non-HTTPS connections.
              </p>
            </div>
          </div>
        )}

        <div className="relative group mb-8">
          {/* Decorative outer glow */}
          <div className="absolute -inset-1 bg-primary/10 rounded-xl blur-lg opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-background rounded-lg border border-border-alt overflow-hidden shadow-sm flex flex-col min-h-[300px] sm:min-h-[400px]">
            {/* HTML5 QR Scanner Container */}
            <div id="reader" className="w-full h-full object-cover"></div>

            {!isScanning && !scannedResult && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary/40">
                  <Camera className="w-10 h-10" />
                </div>
                <div className="max-w-xs">
                  <h3 className="text-text-primary font-bold text-lg">Scanner Offline</h3>
                  <p className="text-sm text-text-secondary mt-2">
                    Start the camera to begin scanning attendee QR codes for registration.
                  </p>
                </div>
                <button
                  onClick={startScanner}
                  disabled={!isSecure}
                  className="btn btn-primary btn-lg px-8 flex items-center gap-2 group/btn"
                >
                  <Power className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  Initiate System
                </button>
              </div>
            )}

            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Visual Scanner HUD */}
                <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-xl z-20 opacity-80" />
                <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-xl z-20 opacity-80" />
                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-xl z-20 opacity-80" />
                <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-xl z-20 opacity-80" />
                
                {/* Simulated scan line */}
                <div className="absolute w-full h-[1px] bg-primary/30 shadow-[0_0_15px_var(--color-primary)] z-20 animate-[bounce_3s_infinite]" />
              </div>
            )}
          </div>
        </div>

        {error && !scannedResult && (
          <div className="mb-6 p-4 bg-error/5 border border-error/10 text-error rounded text-center text-xs font-semibold flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {scannedResult && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border-2 border-primary/10 rounded-lg p-6 shadow-xl relative overflow-hidden">
                {/* Success Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-success animate-in slide-in-from-left duration-1000"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-text-primary font-black text-lg">Credential Verified</h3>
                  <p className="text-xs text-text-secondary font-medium italic">Data payload extracted securely</p>
                </div>
              </div>
              
              <div className="bg-secondary/5 p-5 rounded border border-border break-all font-mono text-sm text-primary-dark">
                <div className="text-[10px] text-text-secondary uppercase font-bold mb-2 tracking-widest opacity-60 flex items-center gap-1">
                   <Scan className="w-3 h-3" /> Scanned Output
                </div>
                {scannedResult}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={() => {
                    setScannedResult(null);
                    startScanner();
                  }}
                  className="btn btn-primary btn-lg flex-1 gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Register Next
                </button>
                <button 
                  onClick={() => setScannedResult(null)} 
                  className="btn btn-outline-secondary btn-lg flex-1 gap-2"
                >
                  <X className="w-4 h-4" />
                  Review Later
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
