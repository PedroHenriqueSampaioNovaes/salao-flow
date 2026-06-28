import EditForm from './_components/EditForm';

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: clientId } = await params;

  return <EditForm clientId={Number(clientId)} />;
}
