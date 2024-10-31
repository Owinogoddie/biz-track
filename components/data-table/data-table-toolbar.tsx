import { PlusIcon, RefreshCcw } from 'lucide-react';
// import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableToolbarProps } from './types';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

export function DataTableToolbar<TData>({
  table,
  onAdd,
  onRefresh,
  searchPlaceholder = 'Filter...',
  toolbarButtons,
  filterableColumns,
  filterColumn
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {filterableColumns?.map(({ id, title, options }) => {
          const column = table.getColumn(id as string);
          if (!column) return null;

          return (
            <DataTableFacetedFilter
              key={id as string}
              column={column}
              title={title}
              options={options}
            />
          );
        })}

        {toolbarButtons}
      </div>

      <div className="flex items-center gap-2">
        {onAdd && (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={onAdd}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New
          </Button>
        )}
        
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={onRefresh}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        )}

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}