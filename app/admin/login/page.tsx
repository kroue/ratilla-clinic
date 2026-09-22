import { redirect } from "next/navigation";
import { adminConfigured, isSignedIn } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (await isSignedIn()) redirect("/admin");

  return (
    <section className="admin-login" aria-labelledby="login-title">
      <h1 id="login-title">Sign in to see call-back requests</h1>
      {adminConfigured() ? (
        <LoginForm />
      ) : (
        <p className="form-alert form-alert-error" role="alert">
          Admin access isn&apos;t set up yet. Add an <code>ADMIN_PASSWORD</code> environment variable in Vercel (or in{" "}
          <code>.env.local</code> for local development), then reload this page.
        </p>
      )}
    </section>
  );
}
