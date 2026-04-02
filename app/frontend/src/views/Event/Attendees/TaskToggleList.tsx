import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import type { AttendeesDetail, TaskDetail } from "shared-types";
import api from "@/core/app/api";
import { toast } from "react-toastify";

interface TaskToggleListProps {
  attendee: AttendeesDetail;
  tasks: TaskDetail[];
  apiPathPrefix: string; // e.g., "qr/abcd-1234" or "1"
  canToggle: boolean;
  onUpdated?: (updatedAttendee: AttendeesDetail) => void;
}

export default function TaskToggleList({ attendee, tasks, apiPathPrefix, canToggle, onUpdated }: TaskToggleListProps) {
  const [loadingTasks, setLoadingTasks] = useState<Record<number, boolean>>({});
  const [currentAttendee, setCurrentAttendee] = useState<AttendeesDetail>(attendee);

  const handleToggle = async (taskId: number) => {
    if (!canToggle || loadingTasks[taskId]) return;

    setLoadingTasks((prev) => ({ ...prev, [taskId]: true }));
    try {
      const { data: res } = await api.post(`/attendees/${apiPathPrefix}/task/${taskId}/toggle`);
      if (res.success && res.data) {
        setCurrentAttendee(res.data);
        onUpdated?.(res.data);

        // Check if the current toggle completed or reverted the task
        const isNowCompleted = res.data.logs?.some((l: any) => l.taskId === taskId);
        toast.success(`Task ${isNowCompleted ? "Completed" : "Reverted"} successfully!`);
      }
    } catch (err: any) {
      console.error("Failed to toggle task", err);
      toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to toggle task");
    } finally {
      setLoadingTasks((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const logs = currentAttendee.logs || [];

  return (
    <div className="space-y-3">
      {tasks.length === 0 && (
        <div className="text-center py-4 text-sm text-text-secondary">No active tasks available.</div>
      )}

      {tasks.map((task) => {
        const isCompleted = logs.some((log) => log.taskId === task.id);
        const isLoading = loadingTasks[task.id];

        return (
          <button
            key={task.id}
            onClick={() => handleToggle(task.id)}
            disabled={!canToggle || isLoading}
            className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all duration-200 ${
              isCompleted
                ? "bg-success/5 border-success/30 hover:bg-success/10 text-success"
                : "bg-background border-border hover:bg-secondary/5 text-text-primary"
            } ${!canToggle || isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <div className="flex flex-col text-left">
              <span className={`font-semibold text-sm ${isCompleted ? "text-success" : "text-text-primary"}`}>
                {task.name}
              </span>
              {task.description && <span className="text-xs text-text-secondary mt-1">{task.description}</span>}
            </div>

            <div className="ml-4 shrink-0 transition-transform duration-300">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-success animate-in zoom-in" />
              ) : (
                <Circle className="w-6 h-6 text-text-muted" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
