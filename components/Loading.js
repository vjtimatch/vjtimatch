export default function Loading() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4"></div>
      <p className="text-muted-foreground text-lg">Loading...</p>
    </div>
  );
}
