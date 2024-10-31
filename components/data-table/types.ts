import { ColumnDef } from "@tanstack/react-table";

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  filterColumn?: keyof TData;
  onAdd?: () => void;
  onEdit?: (data: TData) => void;
  onDelete?: (data: TData) => void;
  onRefresh?: () => void;
  searchPlaceholder?: string;
  toolbarButtons?: React.ReactNode;
  filterableColumns?: {
    id: keyof TData;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
}

export interface DataTableToolbarProps<TData>
  extends Pick<
    DataTableProps<TData>,
    | "onAdd"
    | "onRefresh"
    | "searchPlaceholder"
    | "toolbarButtons"
    | "filterableColumns"
  > {
  table: any;
  filterColumn:any
}

export interface RowActionsProps<TData> {
  row: TData;
  actions: {
    label: string;
    onClick: (row: TData) => void;
    icon?: React.ComponentType<{ className?: string }>;
    variant?: "default" | "destructive";
  }[];
}
