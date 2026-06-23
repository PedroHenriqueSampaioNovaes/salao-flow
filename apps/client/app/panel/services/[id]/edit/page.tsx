import EditForm from './_components/EditForm';

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: serviceId } = await params;

  return <EditForm serviceId={serviceId} />;
}
