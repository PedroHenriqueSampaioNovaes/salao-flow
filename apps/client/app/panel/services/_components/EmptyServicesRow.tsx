import { TableCell, TableRow } from '@/src/components/ui/table';

export default function EmptyServicesRow() {
  return (
    <TableRow>
      <TableCell colSpan={100}>
        <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="font-bold text-base">Nenhum serviço cadastrado</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
