import { useDroppable } from '@dnd-kit/core';
import Task from './Task';

export default function Column({ column }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });
  return (
    <div ref={setNodeRef} className="w-1/3  bg-gray-100 p-5 rounded shadow">
      <h2 className="text-lg font-bold text-blue-700 mb-4">{column.title}</h2>
      {column.tasks.length > 0 ? (
        column.tasks.map((task, index) => (
          <Task key={task.id} task={task} index={index} columnId={column.id} />
        ))
      ) : (
        // Placeholder for empty column
        <div className="h-20 flex items-center justify-center text-gray-500">
          No tasks in this column
        </div>
      )}
    </div>
  );
}
