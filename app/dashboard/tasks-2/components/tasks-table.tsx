'use client'
import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { RowActions } from '@/components/data-table/data-table-row-actions';
import { TaskForm } from '@/components/forms/task-form';
import { tasks } from '../../tasks/data/tasks';

export interface Task {
  id: string;
  title: string;
  status: 'backlog' | 'todo' | 'in progress' | 'done' | 'canceled';
  priority: 'low' | 'medium' | 'high';
  label: string;
}

export function TasksTable() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleAdd = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedTask) {
      console.log('Deleting task:', selectedTask);
      setIsDeleteOpen(false);
      setSelectedTask(null);
    }
  };

  const handleFormSubmit = (data: Omit<Task, 'id'>) => {
    if (selectedTask) {
      console.log('Updating task:', { ...selectedTask, ...data });
    } else {
      console.log('Creating task:', data);
    }
    setIsFormOpen(false);
    setSelectedTask(null);
  };

  const columns: ColumnDef<Task>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Task" />
      ),
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue('status')}</Badge>
      ),
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <RowActions
          row={row.original}
          actions={[
            {
              label: 'Edit',
              onClick: handleEdit,
              icon: Pencil,
            },
            {
              label: 'Delete',
              onClick: handleDelete,
              icon: Trash2,
              variant: 'destructive',
            },
          ]}
        />
      ),
    },
  ];

  const taskss: Task[] = tasks

  const filterableColumns = [
    {
      id: 'status' as keyof Task,
      title: 'Status',
      options: [
        { label: 'Backlog', value: 'backlog' },
        { label: 'Todo', value: 'todo' },
        { label: 'In Progress', value: 'in progress' },
        { label: 'Done', value: 'done' },
        { label: 'Canceled', value: 'canceled' },
      ],
    },
    {
      id: 'priority' as keyof Task,
      title: 'Priority',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
    },
  ];
 
  return (
    <>
      <div className="container mx-auto py-10">
        <DataTable
          data={taskss}
          columns={columns}
          filterColumn="title"
          searchPlaceholder="Search tasks..."
          onAdd={handleAdd}
          filterableColumns={filterableColumns}
        />
      </div>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task
              "{selectedTask?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {selectedTask ? 'Edit Task' : 'Create Task'}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <TaskForm
              initialData={selectedTask || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}