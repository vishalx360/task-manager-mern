import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import Column from './Column';
import Task from './Task';

const initialColumns = {
  todo: {
    id: 'todo',
    title: 'TODO',
    tasks: [
      {
        id: 'task-1',
        title: 'Task 1',
        description: 'Description 1',
        createdAt: '01/09/2021, 05:30:00',
      },
      {
        id: 'task-1x',
        title: 'Task 1x',
        description: 'Description 1',
        createdAt: '01/09/2021, 05:30:00',
      },
    ],
  },
  inProgress: {
    id: 'inProgress',
    title: 'IN PROGRESS',
    tasks: [
      {
        id: 'task-2',
        title: 'Task 2',
        description: 'Description 2',
        createdAt: '01/09/2021, 05:30:00',
      },
    ],
  },
  done: {
    id: 'done',
    title: 'DONE',
    tasks: [
      {
        id: 'task-3',
        title: 'Task 3',
        description: 'Description 3',
        createdAt: '01/09/2021, 05:30:00',
      },
    ],
  },
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [activeTask, setActiveTask] = useState(null);

  const handleDragStart = (event) => {
    const { active } = event;
    const { columnId, index } = active.data.current;
    const task = columns[columnId].tasks[index];
    setActiveTask({ ...task, columnId, index });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const { columnId: sourceColumnId, index: sourceIndex } =
      active.data.current;
    const targetColumnId = over.data.current?.columnId || over.id;

    const sourceColumn = columns[sourceColumnId];
    const targetColumn = columns[targetColumnId];

    if (!sourceColumn || !targetColumn) {
      setActiveTask(null);
      return;
    }

    // If the source and target columns are the same
    if (sourceColumnId === targetColumnId) {
      const updatedTasks = arrayMove(
        sourceColumn.tasks,
        sourceIndex,
        over.data.current?.index ?? sourceColumn.tasks.length - 1,
      );

      setColumns((prevColumns) => ({
        ...prevColumns,
        [sourceColumnId]: {
          ...prevColumns[sourceColumnId],
          tasks: updatedTasks,
        },
      }));
    } else {
      // Moving task between different columns
      const sourceTasks = [...sourceColumn.tasks];
      const targetTasks = [...targetColumn.tasks];
      const [movedTask] = sourceTasks.splice(sourceIndex, 1);

      // Insert at the end if the target index is undefined
      const targetIndex = over.data.current?.index ?? targetTasks.length;
      targetTasks.splice(targetIndex, 0, movedTask);

      setColumns((prevColumns) => ({
        ...prevColumns,
        [sourceColumnId]: {
          ...prevColumns[sourceColumnId],
          tasks: sourceTasks,
        },
        [targetColumnId]: {
          ...prevColumns[targetColumnId],
          tasks: targetTasks,
        },
      }));
    }

    setActiveTask(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      autoScroll
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="flex space-x-4 p-4">
        {Object.values(columns).map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <Task task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
