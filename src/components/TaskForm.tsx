import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { GameButton, GameCard, GameInput } from './GameComponents';
import type { CreateTaskRequest } from '../types/api';
import { TaskPriority, TaskStatus } from '../types/api';

const createTaskSchema = z.object({
  description: z.string().min(1, 'La descripción es requerida').max(255, 'Máximo 255 caracteres'),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z.string().optional()
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

interface TaskFormProps {
  onSubmit: (task: CreateTaskRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, loading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: TaskPriority.MEDIUM
    }
  });

  const handleFormSubmit = async (data: CreateTaskFormData) => {
    try {
      await onSubmit({
        ...data,
        status: TaskStatus.TODO
      });
      reset();
      onCancel();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const priorityOptions = [
    { value: TaskPriority.LOW, label: '🟢 Baja (10pts)' },
    { value: TaskPriority.MEDIUM, label: '🟡 Media (15pts)' },
    { value: TaskPriority.HIGH, label: '🔴 Alta (20pts)' }
  ];

  return (
    <GameCard className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cyan-300">Nueva Misión</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <GameInput
          label="Descripción de la misión"
          placeholder="¿Qué necesitas completar?"
          error={errors.description?.message}
          required
          as="textarea"
          rows={3}
          register={register('description')}
        />

        <GameInput
          label="Prioridad / Dificultad"
          as="select"
          options={priorityOptions}
          register={register('priority')}
          required
        />

        <GameInput
          label="Fecha límite (opcional)"
          type="date"
          register={register('dueDate')}
        />

        <div className="flex gap-3 pt-4">
          <GameButton
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Creando...' : '🚀 Crear Misión'}
          </GameButton>
          <GameButton
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="px-8"
          >
            Cancelar
          </GameButton>
        </div>
      </form>
    </GameCard>
  );
};