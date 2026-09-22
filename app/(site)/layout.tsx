import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/site";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <div className="footer-brand">
            <LogoMark id="footer" className="brand-mark" />
            <div>
              <p className="brand-name">Ratilla</p>
              <p className="brand-sub">Medical Clinic</p>
            </div>
          </div>
          <p className="footer-tagline">{site.tagline}</p>
          <p className="footer-contact">
            <a href={site.mobile.href}>{site.mobile.display}</a>
            <a href={site.landline.href}>{site.landline.display}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <Link href="/privacy">Privacy notice</Link>
          </p>
          <p className="footer-fine">
            This website shares general information and does not replace a consultation. In an emergency, go to the
            nearest hospital.
          </p>
          <p className="footer-fine">© {new Date().getFullYear()} {site.name}</p>
        </div>
      </footer>

      <div className="action-bar" role="group" aria-label="Quick contact">
        <a className="btn btn-secondary" href={site.mobile.href}>
          Call
        </a>
        <a className="btn btn-primary" href={site.bookingUrl} target="_blank" rel="noopener">
          Book online
        </a>
      </div>
    </>
  );
}
