import EditForm from './_components/EditForm';

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: blockedTimeId } = await params;

  return <EditForm blockedTimeId={blockedTimeId} />;
}
