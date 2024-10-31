import { Cross2Icon, PlusCircledIcon, ReloadIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onAdd?: () => void;
  onRefresh?: () => void;
  filterColumn?: any;
  searchPlaceholder?: string;
  toolbarButtons?: React.ReactNode;
  filterableColumns?: {
    id: any;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
}

export function DataTableToolbar<TData>({
  table,
  onAdd,
  onRefresh,
  filterColumn,
  searchPlaceholder = 'Filter...',
  toolbarButtons,
  filterableColumns,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {filterColumn && (
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {filterableColumns && (
          <div className="flex gap-x-2">
            {filterableColumns.map(({ id, title, options }) => {
              const column = table.getColumn(id);
              if (!column) return null;
              
              return (
                <DataTableFacetedFilter
                  key={id}
                  column={column}
                  title={title}
                  options={options}
                />
              );
            })}
          </div>
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {toolbarButtons}
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="h-8"
          >
            <ReloadIcon className="h-4 w-4" />
          </Button>
        )}
        {onAdd && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAdd}
            className="h-8"
          >
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            Add
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}