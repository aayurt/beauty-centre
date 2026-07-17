"use client"

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-2xl">!</span>
        </div>
        <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
