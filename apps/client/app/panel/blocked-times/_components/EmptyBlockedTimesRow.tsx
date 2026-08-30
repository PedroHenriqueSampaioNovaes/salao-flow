export default function EmptyBlockedTimesRow() {
  return (
    <tr className="border-b border-neutral/20 last:border-0">
      <td colSpan={100}>
        <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="font-bold text-base">Nenhum horário bloqueado</p>
          <p className="max-w-sm text-sm text-secondary">
            A agenda de seus funcionários está totalmente disponível. Adicione
            um bloqueio para impedir agendamentos em datas e horas específicas.
          </p>
        </div>
      </td>
    </tr>
  );
}
