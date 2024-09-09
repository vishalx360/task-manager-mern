import { useDroppable } from '@dnd-kit/core';
import Task from './Task';

export default function Column({ column, refreshTasks }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });
  return (
    <div ref={setNodeRef} className="w-1/3  bg-white p-5 rounded shadow-lg">
      <div className="bg-blue-500 px-3 py-1 mb-4">
        <h2 className="text-lg font-bold text-white ">{column.title}</h2>
      </div>
      {column.tasks.length > 0 ? (
        column.tasks.map((task, index) => (
          <Task
            key={task.id}
            task={task}
            index={index}
            columnId={column.id}
            refreshTasks={refreshTasks}
          />
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
