'use client';
import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';

const KanbanBoard = () => {
  const [columns, setColumns] = useState([
    {
      id: 'todo',
      title: 'TODO',
      tasks: [
        {
          id: 'task1',
          description: 'Complete the React component for the Kanban board',
          createdAt: '2023-12-12 10:00:00',
        },
        {
          id: 'task2',
          description:
            'Implement drag-and-drop functionality using a suitable library',
          createdAt: '2023-12-13 15:30:00',
        },
        {
          id: 'task3',
          description: 'Integrate Tailwind CSS for styling',
          createdAt: '2023-12-14 09:15:00',
        },
      ],
    },
    {
      id: 'inProgress',
      title: 'IN PROGRESS',
      tasks: [
        {
          id: 'task2',
          description:
            'Implement drag-and-drop functionality using a suitable library',
          createdAt: '2023-12-13 15:30:00',
        },
        {
          id: 'task3',
          description: 'Integrate Tailwind CSS for styling',
          createdAt: '2023-12-14 09:15:00',
        },
      ],
    },
    {
      id: 'done',
      title: 'DONE',
      tasks: [
        {
          id: 'task4',
          description:
            'Implement drag-and-drop functionality using a suitable library',
          createdAt: '2023-12-13 15:30:00',
        },
        {
          id: 'task5',
          description: 'Integrate Tailwind CSS for styling',
          createdAt: '2023-12-14 09:15:00',
        },
      ],
    },
  ]);

  const onDragEnd = (result) => {
    // Handle task reordering and column changes here
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      // Reorder tasks within the same column
      const column = columns.find((column) => column.id === source.droppableId);
      const tasks = [...column.tasks];
      const [reorderedTask] = tasks.splice(source.index, 1);
      tasks.splice(destination.index, 0, reorderedTask);
      setColumns(
        columns.map((column) =>
          column.id === source.droppableId ? { ...column, tasks } : column,
        ),
      );
    } else {
      // Move task to a different column
      const sourceColumn = columns.find(
        (column) => column.id === source.droppableId,
      );
      const destinationColumn = columns.find(
        (column) => column.id === destination.droppableId,
      );

      const sourceTasks = [...sourceColumn.tasks];
      const [reorderedTask] = sourceTasks.splice(source.index, 1);

      const newSourceColumn = {
        ...sourceColumn,
        tasks: sourceTasks,
      };

      const newDestinationColumn = {
        ...destinationColumn,
        tasks: [...destinationColumn.tasks, reorderedTask],
      };

      setColumns(
        columns.map((column) =>
          column.id === source.droppableId
            ? newSourceColumn
            : newDestinationColumn,
        ),
      );
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
