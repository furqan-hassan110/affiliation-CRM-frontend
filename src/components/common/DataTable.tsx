import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data found',
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
        <p className="text-lg font-medium text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map(column => (
              <TableHead
                key={column.key}
                className={cn(
                  'text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                  column.className
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(item => (
            <TableRow
              key={item.id}
              className={cn(
                'transition-colors',
                onRowClick && 'cursor-pointer hover:bg-muted/50'
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map(column => (
                <TableCell key={column.key} className={column.className}>
                  {column.render
                    ? column.render(item)
                    : (item as any)[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
