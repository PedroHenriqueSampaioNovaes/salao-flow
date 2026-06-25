import EditForm from './_components/EditForm';

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: expedientId } = await params;

  return <EditForm expedientId={expedientId} />;
}
