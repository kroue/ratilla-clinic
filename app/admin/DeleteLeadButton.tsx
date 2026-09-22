"use client";

import { deleteLead } from "./actions";

export function DeleteLeadButton({ id, name }: { id: number; name: string }) {
  return (
    <form
      action={deleteLead.bind(null, id)}
      onSubmit={(event) => {
        if (!window.confirm(`Delete the request from ${name}? This can't be undone.`)) event.preventDefault();
      }}
    >
      <button type="submit" className="btn btn-danger btn-compact">
        Delete
      </button>
    </form>
  );
}
