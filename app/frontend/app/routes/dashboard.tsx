import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">Workspace Overview</h1>
        <p className="text-gray-400">Manage your event operations from a single dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { title: "Registration", count: "1,280", label: "Attendees", icon: "🎟️", trend: "+12%" },
          { title: "Check-ins", count: "450", label: "Scanned", icon: "✅", trend: "+5%" },
          { title: "Operators", count: "12", label: "Active", icon: "👥", trend: "0%" },
          { title: "Available", count: "800", label: "Capacity", icon: "🏟️", trend: "-2%" },
        ].map((stat) => (
          <div key={stat.title} className="bg-secondary p-4 sm:p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl">{stat.icon}</span>
              <span className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded bg-white/5 ${stat.trend.startsWith('+') ? 'text-green-500' : stat.trend === '0%' ? 'text-gray-500' : 'text-accent'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">{stat.count}</h3>
              <p className="text-xs sm:text-sm text-gray-400">{stat.title} {stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 sm:mt-12">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[
            { title: "Attendees Management", desk: "View list, filter and export data", path: "/attendees", color: "border-primary/20 hover:border-primary/50" },
            { title: "Scan Gateway", desk: "Launch camera to scan QR credentials", path: "/scanner", color: "border-accent/20 hover:border-accent/50" },
          ].map((action) => (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className={`bg-secondary p-4 sm:p-6 rounded-2xl border transition-all text-left group ${action.color}`}
            >
              <h3 className="text-md sm:text-lg font-bold text-white group-hover:text-primary transition-colors">{action.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">{action.desk}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
