"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitLead } from "@/app/actions/lead";
import { CALL_TIMES, REASONS, type LeadField, type LeadFormState } from "@/lib/lead-options";
import { site } from "@/lib/site";

const initialState: LeadFormState = { status: "idle" };

export function LeadForm() {
  // Changing the key remounts the form, which clears it for a new request.
  const [formKey, setFormKey] = useState(0);
  return <RequestForm key={formKey} onReset={() => setFormKey((k) => k + 1)} />;
}

function RequestForm({ onReset }: { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(submitLead, initialState);
  const [reason, setReason] = useState("");
  const mountedAt = useRef(0);
  const elapsedRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);

  if (state.status === "success") {
    return (
      <div className="form-card form-success" role="status">
        <h3>Thanks, {state.firstName}. Your request is in.</h3>
        <p>
          The clinic will call <strong>{state.phone}</strong> during clinic hours. If it&apos;s urgent, call{" "}
          <a href={site.mobile.href}>{site.mobile.display}</a>.
        </p>
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          Send another request
        </button>
      </div>
    );
  }

  const errors = state.status === "invalid" ? state.errors : {};
  const values = state.status === "invalid" || state.status === "error" ? state.values : {};
  const selectedReason = reason || values.reason || "";

  const fieldProps = (field: LeadField) => ({
    id: `lead-${field}`,
    name: field,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `lead-${field}-error` : undefined,
  });
  const errorFor = (field: LeadField) =>
    errors[field] ? (
      <p className="field-error" id={`lead-${field}-error`}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <form
      className="form-card"
      action={formAction}
      noValidate
      onSubmit={() => {
        if (elapsedRef.current && mountedAt.current) {
          elapsedRef.current.value = String(Math.round(performance.now() - mountedAt.current));
        }
      }}
    >
      {state.status === "invalid" && (
        <p className="form-alert form-alert-error" role="alert">
          Please check the {Object.keys(errors).length === 1 ? "field" : "fields"} marked below.
        </p>
      )}
      {state.status === "error" && (
        <p className="form-alert form-alert-error" role="alert">
          {state.message}
        </p>
      )}

      <div className="field">
        <label htmlFor="lead-name">Full name</label>
        <input {...fieldProps("name")} type="text" autoComplete="name" required maxLength={100} defaultValue={values.name} />
        {errorFor("name")}
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="lead-phone">Phone number</label>
          <input
            {...fieldProps("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="09XX XXX XXXX"
            required
            maxLength={20}
            defaultValue={values.phone}
          />
          {errorFor("phone")}
        </div>
        <div className="field">
          <label htmlFor="lead-email">
            Email <span className="optional">(optional)</span>
          </label>
          <input {...fieldProps("email")} type="email" autoComplete="email" maxLength={254} defaultValue={values.email} />
          {errorFor("email")}
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="lead-reason">Reason for your visit</label>
          <select
            {...fieldProps("reason")}
            required
            defaultValue={values.reason ?? ""}
            onChange={(event) => setReason(event.target.value)}
          >
            <option value="" disabled>
              Choose one
            </option>
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          {errorFor("reason")}
        </div>
        <div className="field">
          <label htmlFor="lead-preferredTime">Best time to call</label>
          <select {...fieldProps("preferredTime")} defaultValue={values.preferredTime || "any"}>
            {CALL_TIMES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedReason === "animal-bite" && (
        <div className="form-alert form-alert-urgent" role="alert">
          <strong>Don&apos;t wait for a call back.</strong> Wash the wound with soap and running water, then call{" "}
          <a href={site.mobile.href}>{site.mobile.display}</a> or come in today.
        </div>
      )}

      <div className="field">
        <label htmlFor="lead-message">
          Message <span className="optional">(optional)</span>
        </label>
        <textarea {...fieldProps("message")} rows={4} maxLength={1000} defaultValue={values.message} />
        <p className="hint">Keep it short. Share your medical history with the doctor during your visit.</p>
        {errorFor("message")}
      </div>

      <div className="field field-check">
        <input
          id="lead-consent"
          name="consent"
          type="checkbox"
          value="yes"
          required
          defaultChecked={values.consent === "yes"}
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? "lead-consent-error" : undefined}
        />
        <label htmlFor="lead-consent">
          I agree that {site.name} may keep these details and contact me about this request. See the{" "}
          <Link href="/privacy">privacy notice</Link>.
        </label>
        {errorFor("consent")}
      </div>

      {/* Spam traps: hidden from people, filled in by bots. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="lead-website">Website</label>
        <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={elapsedRef} type="hidden" name="elapsed" defaultValue="" />

      <button type="submit" className="btn btn-primary btn-submit" disabled={pending}>
        {pending ? "Sending…" : "Request a call back"}
      </button>
    </form>
  );
}
