import React from 'react';
import { CheckSquare, Clock, Archive, Zap, Calendar, Trash2 } from 'lucide-react';
import { GameCard, GameButton } from './GameComponents';
import type { Task } from '../types/api';
import { TaskStatus, TaskPriority } from '../types/api';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: number, status: TaskStatus) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  loading?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onDelete,
  loading = false
}) => {
  const getPriorityInfo = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return { label: 'Alta', color: 'priority-high', icon: '🔥', points: 20 };
      case TaskPriority.MEDIUM:
        return { label: 'Media', color: 'priority-medium', icon: '⚡', points: 15 };
      case TaskPriority.LOW:
        return { label: 'Baja', color: 'priority-low', icon: '🌱', points: 10 };
    }
  };

  const getStatusInfo = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return { label: 'Pendiente', color: 'text-yellow-400', icon: Clock };
      case TaskStatus.DONE:
        return { label: 'Completada', color: 'text-green-400', icon: CheckSquare };
      case TaskStatus.ARCHIVED:
        return { label: 'Archivada', color: 'text-gray-400', icon: Archive };
    }
  };

  const priorityInfo = getPriorityInfo(task.priority);
  const statusInfo = getStatusInfo(task.status);
  const StatusIcon = statusInfo.icon;

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (task.status !== newStatus) {
      await onStatusChange(task.taskId, newStatus);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta misión?')) {
      await onDelete(task.taskId);
    }
  };

  return (
    <GameCard className={`space-y-4 ${task.status === TaskStatus.DONE ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon size={18} className={statusInfo.color} />
            <span className={`text-sm font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${priorityInfo.color}`}>
              {priorityInfo.icon} {priorityInfo.label}
            </span>
          </div>
          
          <p className={`text-cyan-100 ${task.status === TaskStatus.DONE ? 'line-through' : ''}`}>
            {task.description}
          </p>
          
          {task.dueDate && (
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-400">
              <Calendar size={14} />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          <div className="flex items-center gap-1 bg-yellow-600 text-yellow-100 px-2 py-1 rounded-full text-sm font-bold">
            <Zap size={14} />
            {priorityInfo.points}pts
          </div>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-red-400 hover:text-red-300 transition-colors p-1"
            title="Eliminar misión"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {task.status !== TaskStatus.DONE && (
          <GameButton
            onClick={() => handleStatusChange(TaskStatus.DONE)}
            disabled={loading}
            className="flex-1 text-sm py-2"
          >
            ✅ Completar (+{priorityInfo.points}pts)
          </GameButton>
        )}
        
        {task.status === TaskStatus.DONE && (
          <GameButton
            onClick={() => handleStatusChange(TaskStatus.TODO)}
            disabled={loading}
            variant="secondary"
            className="flex-1 text-sm py-2"
          >
            🔄 Reactivar
          </GameButton>
        )}

        {task.status !== TaskStatus.ARCHIVED && (
          <GameButton
            onClick={() => handleStatusChange(TaskStatus.ARCHIVED)}
            disabled={loading}
            variant="secondary"
            className="px-4 text-sm py-2"
          >
            📦 Archivar
          </GameButton>
        )}
      </div>
    </GameCard>
  );
};