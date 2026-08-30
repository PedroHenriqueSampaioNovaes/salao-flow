import { TableCell, TableRow } from '@/src/components/ui/table';

export default function EmptyBlockedTimesRow() {
  return (
    <TableRow>
      <TableCell colSpan={100}>
        <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="font-bold text-base">Nenhum horário bloqueado</p>
          <p className="max-w-sm text-sm text-secondary">
            A agenda de seus funcionários está totalmente disponível. Adicione
            um bloqueio para impedir agendamentos em datas e horas específicas.
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}
