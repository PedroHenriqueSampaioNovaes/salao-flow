'use client';

import { useClientsContext } from '@/src/common/contexts/clients-context';

import PageHeader from '../../_components/PageHeader';

import CreateClientDialog from './CreateClientDialog';
import ClientRow from './ClientRow';

import { useDeleteClient } from '../_hooks/useDeleteClient';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/components/ui/alert-dialog';
import EmptyClientsRow from './EmptyClientsRow';

const columns = ['Cliente', 'Telefone', 'Visitas', 'Status'];

export default function Clients() {
  const { clients } = useClientsContext();
  const { clientToDelete, requestDelete, cancelDelete, confirmDelete } =
    useDeleteClient();

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Gerencie contatos, visitas e histórico dos seus clientes."
        action={<CreateClientDialog />}
      />

      <div className="bg-white rounded-2xl shadow shadow-neutral/20 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={column} wide={index === 0}>
                  {column}
                </TableHead>
              ))}
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <ClientRow
                key={client.id}
                client={client}
                onDelete={requestDelete}
              />
            ))}
            {clients.length === 0 && <EmptyClientsRow />}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!clientToDelete}
        onOpenChange={(open) => !open && cancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este cliente? Todos os agendamentos
            feitos por ele serão excluídos. Essa ação não pode ser desfeita.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir cliente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
