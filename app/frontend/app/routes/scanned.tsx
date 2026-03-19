export default function Scanned() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-8">Scanned History</h1>
      <div className="bg-secondary p-8 sm:p-12 rounded-3xl border border-gray-800 border-dashed text-center">
        <div className="w-16 h-16 sm:w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <span className="text-2xl sm:text-3xl">📋</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No Records Found</h3>
        <p className="text-gray-500 text-sm sm:text-base max-w-sm mx-auto">Once you start scanning QR codes from the mobile gateway, the history will appear here in real-time.</p>
      </div>
    </div>
  );
}
