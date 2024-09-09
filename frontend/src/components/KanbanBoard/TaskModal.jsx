import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { backend } from '@/lib/utils';

function TaskModal({ task, isReadOnly, children, refreshTasks }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state

  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO', // Assuming default status is 'TODO'
    },
  });

  // Set form values when task is provided
  useEffect(() => {
    if (task) {
      setValue('title', task.title);
      setValue('description', task.description);
      setValue('status', task.status);
    } else {
      reset(); // Reset form for creating a new task
    }
  }, [task, setValue, reset, isOpen]);

  // Handle form submission
  const onSubmitForm = async (data) => {
    try {
      setIsLoading(true); // Set isLoading to true
      const url = task ? `/tasks/${task.id}` : '/tasks';
      const method = task ? 'PUT' : 'POST';
      const response = await backend.request({
        url,
        method,
        data,
      });
      const result = response.data;
      refreshTasks();
      closeModal();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false); // Set isLoading to false
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger onClick={openModal} asChild>
        <Button className="text-white bg-blue-400 px-2 py-1 rounded">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isReadOnly ? 'Task Details' : task ? 'Edit Task' : 'Create Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="flex flex-col space-y-2">
            <label>
              Title:
              <input
                type="text"
                className={`w-full p-2 border rounded ${
                  errors.title && 'border-red-500'
                }`}
                {...register('title', { required: 'Title is required' })}
                disabled={isReadOnly}
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}
            </label>
            <label>
              Description:
              <textarea
                className={`w-full p-2 border rounded ${
                  errors.description && 'border-red-500'
                }`}
                {...register('description', {
                  required: 'Description is required',
                })}
                disabled={isReadOnly}
                placeholder="Enter task description"
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </label>
            {!isReadOnly && (
              <label>
                Status:
                <select
                  className="w-full p-2 border rounded"
                  {...register('status')}
                  disabled={isReadOnly}
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </label>
            )}
          </div>
          <DialogFooter className="mt-5 sm:justify-end space-x-2">
            <DialogClose asChild>
              <Button type="button" variant="default">
                Close
              </Button>
            </DialogClose>
            {!isReadOnly && (
              <Button
                type="submit"
                className="bg-green-500 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : task ? 'Save' : 'Create'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TaskModal;
