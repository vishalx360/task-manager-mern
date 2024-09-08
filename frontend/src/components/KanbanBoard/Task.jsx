import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '../ui/button';

export default function Task({ task, index, columnId }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      data: { task, index, columnId },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
      <p className="text-xs text-gray-500 mt-2">Created at: {task.createdAt}</p>
      <div className="flex justify-end space-x-2 mt-2">
        <Button className="text-white bg-red-500 px-2 py-1 rounded">
          Delete
        </Button>
        <Button className="text-white bg-blue-500 px-2 py-1 rounded">
          Edit
        </Button>
        <Button className="text-white bg-gray-500 px-2 py-1 rounded">
          View Details
        </Button>
      </div>
    </div>
  );
}
