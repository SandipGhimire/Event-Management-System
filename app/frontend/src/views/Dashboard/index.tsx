import { useEffect, useState, useMemo } from "react";
import api from "@/core/app/api";
import endpoints from "@/core/app/endpoints";
import type { DashboardStats } from "shared-types";
import { Users, CheckCircle, Heart, Activity, LayoutDashboard, ClipboardList, Loader2 } from "lucide-react";

type TabType = "overview" | "attendees" | "tasks";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(endpoints.dashboard.stats);
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "attendees", label: "Attendees", icon: Users },
    { id: "tasks", label: "Tasks", icon: ClipboardList },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 bg-white border rounded-sm">
        <p className="text-muted-foreground font-medium">Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="pb-14">
      <div className="flex gap-1 bg-muted/30 p-1 rounded-md w-fit border mb-4 bg-white">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-sm transition-all duration-300 font-bold! text-[14px]! cursor-pointer
                  ${
                    isActive
                      ? "text-white bg-primary transform scale-[1.02!]"
                      : "text-muted-foreground hover:bg-primary/20 text-primary"
                  }
                `}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "overview" && <OverviewTab stats={stats} />}
        {activeTab === "attendees" && <AttendeesTab stats={stats} />}
        {activeTab === "tasks" && <TasksTab stats={stats} />}
      </div>
    </div>
  );
}

function OverviewTab({ stats }: { stats: DashboardStats }) {
  const metrics = [
    {
      label: "Total Attendees",
      value: stats.overview.totalAttendees,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Managed Tasks",
      value: stats.overview.totalTasks,
      icon: ClipboardList,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Total Sponsors",
      value: stats.overview.totalSponsors,
      icon: Heart,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  const avgCompletion = useMemo(() => {
    if (stats.tasks.length === 0) return 0;
    const total = stats.tasks.reduce((acc, t) => acc + t.completed / (t.total || 1), 0);
    return Math.round((total / stats.tasks.length) * 100);
  }, [stats.tasks]);

  return (
    <div className="flex flex-col gap-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white border rounded-sm p-4 transition-all duration-300 group cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-muted-foreground font-bold! text-sm uppercase tracking-wider mb-2">
                  {m.label}
                </span>
                <span className="text-4xl font-bold! text-foreground group-hover:text-primary transition-colors">
                  {m.value}
                </span>
              </div>
              <div
                className={`${m.bg} ${m.color} p-4 rounded-sm transform group-hover:rotate-12 transition-transform duration-300`}
              >
                <m.icon size={28} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Stats Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-sm p-4 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Activity size={20} />
            </div>
            <h3 className="text-xl font-bold!">Overall Task Progress</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <span className="text-muted-foreground font-medium">Task Completion Index</span>
              <span className="text-5xl font-bold! text-primary">{avgCompletion}%</span>
            </div>
            <div className="h-4 bg-muted rounded-sm overflow-hidden border p-0.5 bg-background">
              <div
                className="h-full bg-primary rounded-sm transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(var(--primary-rgb),0.3)]"
                style={{ width: `${avgCompletion}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Based on {stats.overview.totalAttendees} attendees and {stats.overview.totalTasks} active task across the
              event.
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-sm p-4 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-secondary/10 text-secondary p-2 rounded-lg">
              <Users size={20} />
            </div>
            <h3 className="text-xl font-bold!">Dietary Summary</h3>
          </div>
          <div className="flex items-center gap-12">
            {/* Simple Pie Chart SVG */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="transform -rotate-90 drop-shadow-md">
                {/* Background circle */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="15" />
                {/* Veg segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="15"
                  strokeDasharray={`${(stats.attendees.vegCount / (stats.overview.totalAttendees || 1)) * 251.2} 251.2`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-muted-foreground leading-tight">VEG</span>
                <span className="text-xl font-bold!">
                  {Math.round((stats.attendees.vegCount / (stats.overview.totalAttendees || 1)) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="font-bold text-green-700">Vegetarian</span>
                </div>
                <span className="font-bold! text-green-900">{stats.attendees.vegCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="font-bold text-slate-700">Non-Veg</span>
                </div>
                <span className="font-bold! text-slate-900">{stats.attendees.nonVegCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendeesTab({ stats }: { stats: DashboardStats }) {
  const maxCount = Math.max(...stats.attendees.clubWise.map((c) => c.count), 1);

  return (
    <div className="bg-white border rounded-sm overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/10">
        <h3 className="text-xl font-bold! text-foreground">Club Participation Breakdown</h3>
        <p className="text-muted-foreground text-sm mt-1">Distribution of attendees based on their respective clubs</p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {stats.attendees.clubWise.length > 0 ? (
            stats.attendees.clubWise.map((club, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 group border p-4 rounded-sm hover:bg-primary/10 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-end mb-1">
                  <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {club.name}
                  </span>
                  <span className="font-bold! text-secondary text-sm bg-muted px-2 py-0.5 rounded-md">
                    {club.count} Attendees
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-border/30">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${(club.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-muted-foreground">No club data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

function TasksTab({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {stats.tasks.length > 0 ? (
        stats.tasks.map((task) => {
          const percent = Math.round((task.completed / (task.total || 1)) * 100);
          return (
            <div key={task.id} className="bg-white border rounded-sm p-4 group">
              <h4 className="text-lg font-bold! mb-2 truncate text-primary transition-colors flex justify-between">
                {task.name}

                {percent === 100 ? (
                  <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                    <CheckCircle size={14} />
                    Complete
                  </div>
                ) : (
                  <span className="text-secondary!">
                    {task.completed}/{task.total}
                  </span>
                )}
              </h4>
              <div className="h-2.5 bg-muted rounded-sm overflow-hidden border mt-4">
                <div
                  className={`h-full rounded-sm transition-all duration-1000 ${percent === 100 ? "bg-green-500" : "bg-primary"}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-secondary-dark font-medium">Completion Rate</span>
                <span className="font-bold! text-secondary-dark">{percent}%</span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-full py-20 text-center bg-white border border-border/60 rounded-2xl">
          <p className="text-muted-foreground">No active tasks found in the system.</p>
        </div>
      )}
    </div>
  );
}
