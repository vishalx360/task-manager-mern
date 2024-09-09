import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react';
import Column from './Column';
import Task from './Task';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import TaskModal from './TaskModal';
import { backend } from '@/lib/utils';
import Fuse from 'fuse.js';

export default function KanbanBoard() {
  const [columns, setColumns] = useState({});
  const [activeTask, setActiveTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [fuse, setFuse] = useState(null);

  const refreshTasks = useCallback(async () => {
    try {
      const response = await backend.get('/tasks');
      const initialTasks = response.data;

      const categorizedColumns = {
        todo: {
          id: 'todo',
          title: 'TODO',
          tasks: initialTasks.filter((task) => task.status === 'TODO'),
        },
        inProgress: {
          id: 'inProgress',
          title: 'IN PROGRESS',
          tasks: initialTasks.filter((task) => task.status === 'IN_PROGRESS'),
        },
        done: {
          id: 'done',
          title: 'DONE',
          tasks: initialTasks.filter((task) => task.status === 'DONE'),
        },
      };

      setColumns(categorizedColumns);

      // Initialize Fuse.js with tasks data for fuzzy search
      const tasks = initialTasks.map((task) => ({
        ...task,
        columnId: categorizedColumns[task.status.toLowerCase()]?.id,
      }));

      setFuse(
        new Fuse(tasks, {
          keys: ['title', 'description'],
          threshold: 0.3,
        }),
      );
    } catch (error) {
      console.error('Error fetching initial tasks:', error);
    }
  }, []);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const handleDragStart = (event) => {
    const { active } = event;
    const { columnId, index } = active.data.current;
    const task = columns[columnId].tasks[index];
    setActiveTask({ ...task, columnId, index });
  };

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 0.01,
    },
  });
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    keyboardSensor,
    pointerSensor,
  );

  const handleDragEnd = async (event) => {
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

      // Make network call to update the task

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
      try {
        const STATUS_MAPPING = {
          todo: 'TODO',
          inProgress: 'IN_PROGRESS',
          done: 'DONE',
        };
        const task = movedTask;

        const response = await backend.request({
          url: `/tasks/${task.id}`,
          method: 'PUT',
          data: {
            title: task.title,
            description: task.description,
            status: STATUS_MAPPING[targetColumnId],
          },
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }

    setActiveTask(null);
  };

  // Sort tasks based on the selected sortBy option
  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });
  };

  // Filter tasks based on the search query and apply sorting
  const getFilteredColumns = () => {
    if (!searchQuery || !fuse) {
      const sortedColumns = Object.values(columns).reduce((acc, column) => {
        acc[column.id] = {
          ...column,
          tasks: sortTasks([...column.tasks]),
        };
        return acc;
      }, {});
      return sortedColumns;
    }

    const result = fuse.search(searchQuery).map((result) => result.item);
    const filteredColumns = Object.values(columns).reduce((acc, column) => {
      acc[column.id] = {
        ...column,
        tasks: sortTasks(result.filter((task) => task.columnId === column.id)),
      };
      return acc;
    }, {});

    return filteredColumns;
  };

  return (
    <main className="container mx-auto max-w-7xl">
      <div className="p-2">
        <TaskModal
          task={null}
          isReadOnly={false}
          onSubmit={(newTask) => console.log('Created Task:', newTask)}
          refreshTasks={refreshTasks}
        >
          New Task
        </TaskModal>
      </div>
      <div className="m-2 border-1  border-gray-300 flex justify-between items-center bg-white p-5 rounded shadow-lg">
        <div className="flex items-center gap-5">
          <Label htmlFor="search" className=" ">
            Search:
          </Label>
          <Input
            id="search"
            className="border-2 border-gray-300 p-2"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-5">
          <Label htmlFor="sortBy" className=" ">
            Sort By:
          </Label>
          <select
            id="sortBy"
            className="border-2 border-gray-300 p-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        autoScroll
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
        <div className="flex space-x-4 p-4">
          {Object.values(getFilteredColumns()).map((column) => (
            <Column
              key={column.id}
              column={column}
              refreshTasks={refreshTasks}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? <Task task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </main>
  );
}
