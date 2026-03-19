export default function Attendees() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Attendees</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage event participant registration status</p>
        </div>
        <button className="btn btn-primary btn-md w-full sm:w-auto">Add Attendee</button>
      </div>

      <div className="bg-secondary rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-bg-dark border-b border-gray-800">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-bold text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider">Name</th>
                <th className="px-4 sm:px-6 py-4 font-bold text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider">Email</th>
                <th className="px-4 sm:px-6 py-4 font-bold text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-4 font-bold text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {[
                { name: "John Doe", email: "john@example.com", status: "Checked In", badge: "bg-green-500/10 text-green-500" },
                { name: "Jane Smith", email: "jane@example.com", status: "Pending", badge: "bg-primary/10 text-primary" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="px-4 sm:px-6 py-4 text-white font-medium text-sm sm:text-base">{row.name}</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-400 text-xs sm:text-sm">{row.email}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold uppercase tracking-tight ${row.badge}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-white transition-colors text-xs sm:text-sm">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
