"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  return (
    <form className="form-card" action={formAction}>
      {state.error && (
        <p className="form-alert form-alert-error" role="alert">
          {state.error}
        </p>
      )}
      <div className="field">
        <label htmlFor="admin-password">Password</label>
        <input id="admin-password" name="password" type="password" autoComplete="current-password" required autoFocus />
      </div>
      <button type="submit" className="btn btn-primary btn-submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
