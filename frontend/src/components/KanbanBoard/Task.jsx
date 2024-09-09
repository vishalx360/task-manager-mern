import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import TaskModal from './TaskModal';
import { backend } from '@/lib/utils';

export default function Task({ task, index, columnId, refreshTasks }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      data: { task, index, columnId },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [isDeleting, setIsDeleting] = useState(false); // Add isLoading state

  const handelDelete = async (taskId) => {
    try {
      setIsDeleting(true); // Set isLoading to true
      const url = `/tasks/${taskId}`;
      const response = await backend.delete(url); // Use the axios instance for the DELETE request
      refreshTasks();
      const result = await response.data;
      toast.error(result.message || 'Task deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Delete error'); // Add toast error message
    } finally {
      setIsDeleting(false); // Set isLoading to false
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-blue-100 p-4 rounded mb-4 shadow"
    >
      <h3 className="text-md font-semibold">{task.title}</h3>
      <p className="text-sm">{task.description}</p>
      <p className="text-xs text-gray-500 mt-2">
        Created at: {new Date(task.createdAt).toLocaleDateString()}{' '}
        {new Date(task.createdAt).toLocaleTimeString()}
      </p>
      <div className="flex justify-end space-x-2 mt-2">
        <Button
          isLoading={isDeleting}
          loadingText="Deleting..."
          onClick={() => handelDelete(task.id)}
          className="text-white bg-red-500 px-2 py-1 rounded"
        >
          Delete
        </Button>
        <TaskModal
          task={task}
          isReadOnly={false}
          onSubmit={(updatedTask) => console.log('Edited Task:', updatedTask)}
          refreshTasks={refreshTasks}
        >
          Edit Task
        </TaskModal>
        <TaskModal task={task} isReadOnly={true} refreshTasks={refreshTasks}>
          View Details
        </TaskModal>
      </div>
    </div>
  );
}
