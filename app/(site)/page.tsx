import { HoursTable, OpenStatus } from "@/components/ClinicHours";
import { LeadForm } from "@/components/LeadForm";
import { LogoMark } from "@/components/LogoMark";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: site.name,
  slogan: site.tagline,
  telephone: ["+639128188078", "+63883230178"],
  email: site.email,
  medicalSpecialty: "PrimaryCare",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: "Cagayan de Oro City",
    addressRegion: "Misamis Oriental",
    postalCode: "9000",
    addressCountry: "PH",
  },
  // Sunday is appointment-only, so only walk-in days are listed for search engines.
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  employee: { "@type": "Physician", name: site.doctor, medicalSpecialty: "PrimaryCare" },
};

const care = [
  {
    title: "Chronic conditions",
    text: "Ongoing care and follow-up for hypertension, diabetes, high cholesterol, hyperthyroidism, and asthma.",
  },
  { title: "Mental health", text: "Care for anxiety and depression, in an unhurried, private consultation." },
  { title: "Women's health", text: "PCOS, breast exams, and general wellness check-ups." },
  { title: "Children", text: "UTI, pneumonia, diarrhea, asthma, and other common childhood illnesses." },
  { title: "Common infections", text: "Eye, ear, and skin infections, for patients of any age." },
];

const vaccines = [
  "Flu",
  "Rotavirus",
  "Pneumococcal (PCV)",
  "Typhoid",
  "Japanese encephalitis",
  "Meningococcal",
  "Hepatitis B",
  "Tetanus",
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Hero: mint echoes the clinic's cover photo */}
      <section className="hero" id="top" aria-labelledby="hero-title">
        <LogoMark id="hero" className="hero-mark" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title">
              Primary care for the <em>whole family.</em>
            </h1>
            <p className="lede">
              A family medicine clinic in Kauswagan, Cagayan de Oro. Check-ups, long-term care, vaccines, quick lab
              tests, and animal bite treatment for every age, from newborns to grandparents.
            </p>
            <div className="actions">
              <a className="btn btn-primary" href={site.bookingUrl} target="_blank" rel="noopener">
                Book a consultation
              </a>
              <a className="btn btn-secondary" href={site.mobile.href}>
                Call {site.mobile.display}
              </a>
            </div>
            <p className="hero-note">
              In-clinic consultation ₱500. iCare health card accepted. <a href="#request">Prefer we call you?</a>
            </p>
          </div>

          <aside className="today-card" aria-labelledby="today-title">
            <h2 className="today-title" id="today-title">
              Clinic hours
            </h2>
            <OpenStatus />
            <dl className="hours-mini">
              <div>
                <dt>Mon to Sat</dt>
                <dd>9:00 AM – 6:00 PM</dd>
              </div>
              <div>
                <dt>Sunday</dt>
                <dd>2:00 – 5:00 PM, by appointment only</dd>
              </div>
            </dl>
            <p className="today-address">
              {site.address.line1}, {site.address.line2}. Near Mercury Drug, with ample parking.
            </p>
            <a className="text-link" href={site.mapsUrl} target="_blank" rel="noopener">
              Get directions on Google Maps
            </a>
          </aside>
        </div>

        <div className="wrap">
          <a className="bite-callout" href="#animal-bite">
            <strong>Bitten or scratched by an animal?</strong>
            <span>Wash the wound with soap and running water now, then read what to do next.</span>
          </a>
        </div>
      </section>

      {/* Services */}
      <section className="section services" id="services" aria-labelledby="services-title">
        <div className="wrap services-grid">
          <div className="services-intro">
            <h2 id="services-title">What we treat</h2>
            <p>
              Family medicine covers patients of every age, so a child&apos;s fever and a parent&apos;s blood pressure
              can be seen by the same doctor, in the same visit if needed.
            </p>
            <p className="services-ask">
              Not sure if we handle your concern? Call <a href={site.mobile.href}>{site.mobile.display}</a> and ask.
            </p>
          </div>

          <ul className="care-list">
            {care.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="wrap services-extra">
          <div className="vaccines">
            <h3>Vaccinations for kids and adults</h3>
            <ul className="tag-list">
              {vaccines.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
            <p className="fine">Call ahead to check that your vaccine is in stock.</p>
          </div>

          <div className="tests">
            <p className="tests-figure" aria-hidden="true">
              <span>3</span> min
            </p>
            <h3>Lab tests while you wait</h3>
            <p>Urinalysis, uric acid, and blood sugar tests done right in the clinic, with results in 3 minutes.</p>
          </div>
        </div>
      </section>

      {/* Animal Bite Center: the only dark band, so urgent information stands apart */}
      <section className="section band" id="animal-bite" aria-labelledby="bite-title">
        <div className="wrap band-grid">
          <div className="band-intro">
            <h2 id="bite-title">Animal Bite Center</h2>
            <p className="lede">
              Bites and scratches from dogs, cats, and other animals can carry rabies. Rabies is preventable when
              treatment starts early, so come in the same day.
            </p>
            <p>At the clinic, the wound is cleaned and checked, and anti-rabies and tetanus vaccines are given when needed.</p>
            <div className="actions">
              <a className="btn btn-light" href={site.mobile.href}>
                Call {site.mobile.display}
              </a>
            </div>
          </div>

          <div className="band-steps">
            <h3>What to do right after a bite</h3>
            <ol className="steps">
              <li>
                <strong>Wash the wound right away.</strong>
                Use soap and running water for about 15 minutes.
              </li>
              <li>
                <strong>Apply an antiseptic if you have one.</strong>
                Povidone-iodine works. Skip home remedies on the wound.
              </li>
              <li>
                <strong>Come to the clinic the same day.</strong>
                If you can, note what animal it was and whether it has had its rabies shots.
              </li>
            </ol>
            <p className="band-note">
              <strong>Clinic closed?</strong> Go to the nearest hospital emergency room or animal bite treatment center.
              Don&apos;t wait for us to open.
            </p>
          </div>
        </div>
      </section>

      {/* Doctor */}
      <section className="section doctor" id="doctor" aria-labelledby="doctor-title">
        <div className="wrap doctor-grid">
          <figure className="doctor-photo">
            {/* TODO: replace with the doctor's portrait (4:5 ratio, at least 800 x 1000 px) using next/image. */}
            <div className="photo-placeholder" role="img" aria-label={`Photo placeholder for ${site.doctor}`}>
              <LogoMark id="photo" className="photo-mark" />
              <span>
                Doctor&apos;s photo
                <br />
                coming soon
              </span>
            </div>
          </figure>

          <div className="doctor-copy">
            <h2 id="doctor-title">Meet your doctor</h2>
            <p className="doctor-name">{site.doctor}</p>
            <p className="doctor-role">Family Medicine Specialist and clinic owner</p>

            <ul className="badges" aria-label="Credentials">
              <li>RN, MD, CFP</li>
              <li>Board-certified, Philippine Academy of Family Physicians</li>
              <li>5 years in practice</li>
            </ul>

            <dl className="credentials">
              <div>
                <dt>Medical degree</dt>
                <dd>Xavier University – Ateneo de Cagayan, Dr. Jose P. Rizal School of Medicine, 2016</dd>
              </div>
              <div>
                <dt>Residency</dt>
                <dd>Northern Mindanao Medical Center, 2022</dd>
              </div>
              <div>
                <dt>Memberships</dt>
                <dd>
                  Board member, PAFP Misamis Oriental Chapter
                  <br />
                  Philippine Medical Association
                  <br />
                  Misamis Oriental Medical Society
                </dd>
              </div>
            </dl>

            <div className="actions">
              <a className="btn btn-primary" href={site.mobile.href}>
                Call {site.mobile.display}
              </a>
              <a className="btn btn-secondary" href={site.bookingUrl} target="_blank" rel="noopener">
                Book on SeriousMD
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Fees */}
      <section className="section fees" id="fees" aria-labelledby="fees-title">
        <div className="wrap fees-layout">
          <div className="fees-intro">
            <h2 id="fees-title">Consultation fees</h2>
            <p>Visit the clinic or consult from home. Both are with {site.doctorShort}.</p>
          </div>
          <div className="fees-grid">
            <article className="fee">
              <h3>At the clinic</h3>
              <p className="price">₱500</p>
              <ul className="fee-details">
                <li>Medical certificate: add ₱300</li>
                <li>Mon to Sat, 9:00 AM – 6:00 PM</li>
                <li>Sunday, 2:00 – 5:00 PM, by appointment only</li>
                <li>iCare health card accepted</li>
              </ul>
              <a className="btn btn-secondary" href={site.mobile.href}>
                Call to schedule
              </a>
            </article>

            <article className="fee">
              <h3>Online consultation</h3>
              <p className="price">₱405 – 500</p>
              <ul className="fee-details">
                <li>Consult from home, no travel needed</li>
                <li>Mon to Sun, 8:00 AM – 9:00 PM</li>
                <li>Booked through SeriousMD</li>
              </ul>
              <a className="btn btn-primary" href={site.bookingUrl} target="_blank" rel="noopener">
                Book an online consult
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* Call-back request (saved as a lead) */}
      <section className="section request" id="request" aria-labelledby="request-title">
        <div className="wrap request-grid">
          <div className="request-intro">
            <h2 id="request-title">Ask the clinic to call you</h2>
            <p>
              Leave your number and the clinic will call you back during clinic hours to answer questions or set a
              schedule.
            </p>
            <p className="request-urgent">
              <strong>Animal bite or anything urgent?</strong> Don&apos;t wait for a call back. Call{" "}
              <a href={site.mobile.href}>{site.mobile.display}</a> now.
            </p>
          </div>
          <LeadForm />
        </div>
      </section>

      {/* Visit */}
      <section className="section visit" id="visit" aria-labelledby="visit-title">
        <div className="wrap visit-grid">
          <div className="visit-where">
            <h2 id="visit-title">Visit the clinic</h2>
            <address>
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.city}
            </address>
            <p className="landmark">{site.address.landmark}</p>
            <a className="text-link" href={site.mapsUrl} target="_blank" rel="noopener">
              Get directions on Google Maps
            </a>

            <dl className="contact">
              <div>
                <dt>Mobile</dt>
                <dd>
                  <a href={site.mobile.href}>{site.mobile.display}</a>
                </dd>
              </div>
              <div>
                <dt>Landline</dt>
                <dd>
                  <a href={site.landline.href}>{site.landline.display}</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="visit-hours">
            <h3>Opening hours</h3>
            <OpenStatus />
            <HoursTable />
            <p className="fine">Online consultations run daily, 8:00 AM – 9:00 PM.</p>
          </div>
        </div>
      </section>
    </>
  );
}
