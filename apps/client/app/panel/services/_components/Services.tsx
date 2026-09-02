'use client';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import PageHeader from '../../_components/PageHeader';

import CreateServiceDialog from './CreateServiceDialog';
import ServiceRow from './ServiceRow';
import EmptyServicesRow from './EmptyServicesRow';

import { useDeleteService } from '../_hooks/useDeleteService';

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

const columns = ['Serviço', 'Preço', 'Duração', 'Status'];

export default function Services() {
  const { services } = usePanelContext();
  const { serviceToDelete, requestDelete, cancelDelete, confirmDelete } =
    useDeleteService();

  return (
    <div>
      <PageHeader
        title="Serviços"
        description="Gerencie os serviços oferecidos no seu empreendimento."
        action={<CreateServiceDialog />}
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
            {services.map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                onDelete={requestDelete}
              />
            ))}
            {services.length === 0 && <EmptyServicesRow />}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!serviceToDelete}
        onOpenChange={(open) => !open && cancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir serviço</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este serviço? Essa ação não pode
            ser desfeita.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir serviço
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
