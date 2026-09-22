"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="form-card admin-error" role="alert">
      <h1>Couldn&apos;t load the requests</h1>
      <p>The database didn&apos;t respond. Try again in a moment. If it keeps happening, check the Neon dashboard.</p>
      <button type="button" className="btn btn-primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
