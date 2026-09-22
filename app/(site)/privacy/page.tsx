import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: `How ${site.name} handles the details you send through this website.`,
};

// TODO: have the clinic (and its data protection officer, if one is appointed) review this notice.
export default function PrivacyPage() {
  return (
    <section className="section prose-page" aria-labelledby="privacy-title">
      <div className="wrap prose">
        <h1 id="privacy-title">Privacy notice</h1>
        <p className="fine">Last updated September 2026</p>

        <h2>What we collect</h2>
        <p>
          When you send a call-back request on this website, {site.name} receives your name, phone number, email
          address (if you give one), the reason for your visit, the best time to call, and your message.
        </p>

        <h2>How we use it</h2>
        <p>
          We use these details only to contact you about your request. We don&apos;t sell them or use them for
          marketing.
        </p>

        <h2>Who can see it</h2>
        <p>
          Requests are stored in a database that only clinic staff can open, using a password-protected page. To stop
          spam, we keep a one-way scrambled code (a hash) of your internet address, not the address itself.
        </p>

        <h2>Health information</h2>
        <p>
          The reason for your visit can be health information. Please don&apos;t put detailed medical history in the
          message. Share it with the doctor during your consultation instead.
        </p>

        <h2>Your rights</h2>
        <p>
          The Data Privacy Act of 2012 gives you the right to see, correct, and ask us to delete the personal data we
          hold about you. To do any of these, email <a href={`mailto:${site.email}`}>{site.email}</a> or call{" "}
          <a href={site.mobile.href}>{site.mobile.display}</a>.
        </p>
      </div>
    </section>
  );
}
