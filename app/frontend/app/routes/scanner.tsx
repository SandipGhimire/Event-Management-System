import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function Scanner() {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSecure, setIsSecure] = useState(true);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);

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

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-6 sm:mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-white">QR Registry Gateway</h1>
        <p className="text-sm sm:text-base text-gray-400 mt-2">Securely register entries using QR credentials</p>
      </div>

      {!isSecure && (
        <div className="max-w-md mx-auto mb-8 bg-accent/10 border border-accent/20 p-4 rounded-2xl flex items-center gap-4 text-accent">
          <span className="text-2xl">⚠️</span>
          <div>
            <h4 className="font-bold text-sm">Insecure Context Detected</h4>
            <p className="text-xs opacity-80">
              Browser security policies block camera access on non-HTTPS connections unless using localhost.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-[320px] sm:max-w-md mx-auto relative group mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[24px] sm:rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-secondary rounded-[24px] sm:rounded-[32px] border-4 border-gray-800 overflow-hidden shadow-2xl min-h-[300px] flex flex-col">
          <div id="reader" className="w-full"></div>

          {!isScanning && !scannedResult && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-3xl">📸</div>
              <div>
                <h3 className="text-white font-bold">Camera Offline</h3>
                <p className="text-xs text-gray-500 mt-1 px-4">Camera access is required to scan QR codes</p>
              </div>
              <button
                onClick={startScanner}
                disabled={!isSecure}
                className="btn btn-primary btn-md w-full max-w-[200px]"
              >
                Launch Tracker
              </button>
            </div>
          )}

          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute top-4 sm:top-8 left-4 sm:left-8 w-8 sm:w-12 h-8 sm:h-12 border-t-4 border-l-4 border-primary rounded-tl-lg sm:rounded-tl-xl z-10" />
              <div className="absolute top-4 sm:top-8 right-4 sm:right-8 w-8 sm:w-12 h-8 sm:h-12 border-t-4 border-r-4 border-primary rounded-tr-lg sm:rounded-tr-xl z-10" />
              <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-8 sm:w-12 h-8 sm:h-12 border-b-4 border-l-4 border-primary rounded-bl-lg sm:rounded-bl-xl z-10" />
              <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 w-8 sm:w-12 h-8 sm:h-12 border-b-4 border-r-4 border-primary rounded-br-lg sm:rounded-br-xl z-10" />
              <div className="absolute w-full h-[2px] bg-primary/50 shadow-[0_0_15px_rgba(233,186,41,0.5)] animate-scan-line z-10" />
            </div>
          )}
        </div>
      </div>

      {error && !scannedResult && <p className="text-center text-accent text-xs font-bold px-4">{error}</p>}

      {scannedResult && (
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-bg-dark border border-gray-800 rounded-2xl p-6 shadow-xl transform animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                ✓
              </span>
              <h3 className="text-white font-bold">Scanned Successfully</h3>
            </div>
            <div className="bg-secondary/50 p-4 rounded-xl border border-white/5 break-all">
              <span className="text-[10px] text-gray-500 uppercase font-black block mb-1">Decoded Payload</span>
              <code className="text-primary text-sm font-mono tracking-tighter">{scannedResult}</code>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setScannedResult(null);
                  startScanner();
                }}
                className="btn btn-primary btn-md flex-1"
              >
                Next Scan
              </button>
              <button onClick={() => setScannedResult(null)} className="btn btn-secondary btn-md flex-1">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
