import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import TaskToggleList from "./TaskToggleList";
import type { AttendeesDetail, TaskDetail } from "shared-types";
import api from "@/core/app/api";

interface TaskToggleModalProps {
  attendee: AttendeesDetail | null;
  isOpen: boolean;
  onClose: () => void;
  canToggle: boolean;
}

export default function TaskToggleModal({ attendee, isOpen, onClose, canToggle }: TaskToggleModalProps) {
  const [tasks, setTasks] = useState<TaskDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAttendee, setCurrentAttendee] = useState<AttendeesDetail | null>(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      if (!isOpen || !attendee) return;

      setIsLoading(true);
      setCurrentAttendee(null);

      try {
        const [attendeeData, tasksData] = await Promise.all([
          api.get(`/attendees/${attendee.id}`).then((res) => res.data.data),
          api.get("/task/list", { params: { pageSize: 100 } }).then((res) => res.data.data.data),
        ]);
        if (active) {
          setCurrentAttendee(attendeeData);
          setTasks(tasksData || []);
        }
      } catch (err) {
        console.error("Failed to load data for TaskToggleModal", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [isOpen, attendee]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={attendee ? `Tasks for ${attendee.name}` : "Task List"}>
      <div className="p-4 pt-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : currentAttendee ? (
          <TaskToggleList
            attendee={currentAttendee}
            tasks={tasks}
            apiPathPrefix={currentAttendee.id.toString()}
            canToggle={canToggle}
          />
        ) : (
          <div className="text-center py-4 text-sm text-text-secondary">Failed to load attendee details.</div>
        )}
      </div>
    </Modal>
  );
}
