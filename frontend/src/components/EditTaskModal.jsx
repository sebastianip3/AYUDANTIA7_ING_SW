import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTaskSchema } from '../schemas/task.schema';
import tasksService from '../services/tasks.service';

export function EditTaskModal({ task, onTaskUpdated, onClose }) {
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || '',
      completed: task.completed,
    },
  });

  const onSubmit = async (data) => {
    try {
      setApiError(null);

      const updatedTask = await tasksService.update(task.id, data);

      onTaskUpdated(updatedTask);
      onClose();
    } catch (err) {
      console.error('Error al editar tarea:', err);
      setApiError(err.message || 'No se pudo actualizar la tarea');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-white">
          Editar tarea
        </h2>

        {apiError && (
          <p className="text-sm text-rose-400">
            {apiError}
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm text-slate-300">
            Título
          </label>

          <input
            type="text"
            {...register('title')}
            className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-2.5 text-white"
          />

          {errors.title && (
            <p className="mt-1 text-xs text-rose-400">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-300">
            Descripción
          </label>

          <textarea
            rows={3}
            {...register('description')}
            className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-2.5 text-white"
          />

          {errors.description && (
            <p className="mt-1 text-xs text-rose-400">
              {errors.description.message}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" {...register('completed')} />
          Tarea completada
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTaskModal;