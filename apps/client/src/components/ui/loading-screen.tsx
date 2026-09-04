import Loading from '@/src/components/ui/loading';

export default function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="-ml-4 min-h-[calc(100dvh-var(--header)-3.25rem)] flex flex-col items-center justify-center gap-1">
      <Loading />
      {message}
    </div>
  );
}
