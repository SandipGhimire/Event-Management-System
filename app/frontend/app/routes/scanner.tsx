import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Scanner() {
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [0] // Html5QrcodeScanType.SCAN_TYPE_CAMERA
      },
      /* verbose= */ false
    );

    function onScanSuccess(decodedText: string) {
      setScannedResult(decodedText);
    }

    function onScanFailure(error: any) {
      // Logic for scan failure
    }

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear scanner. ", error);
      });
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-10 text-center px-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white">QR Registry Gateway</h1>
        <p className="text-sm sm:text-base text-gray-400 mt-2">Position the attendee's QR code within the frame to register entry</p>
      </div>

      <div className="max-w-[320px] sm:max-w-md mx-auto relative group mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[24px] sm:rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-secondary rounded-[24px] sm:rounded-[32px] border-4 border-gray-800 overflow-hidden shadow-2xl min-h-[300px]">
          <div id="reader" className="w-full"></div>
          {!scannedResult && (
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

      {scannedResult && (
        <div className="max-w-md mx-auto px-4 mt-8">
          <div className="bg-bg-dark border border-gray-800 rounded-2xl p-6 shadow-xl transform animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">!</span>
              <h3 className="text-white font-bold">Identification Verified</h3>
            </div>
            <div className="bg-secondary/50 p-4 rounded-xl border border-white/5 break-all">
              <span className="text-xs text-gray-500 uppercase font-black block mb-1">Raw Payload</span>
              <code className="text-primary text-sm font-mono tracking-tighter">{scannedResult}</code>
            </div>
            <button 
              onClick={() => setScannedResult(null)}
              className="btn btn-primary btn-md w-full mt-6"
            >
              Ready for Next Scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
