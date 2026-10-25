import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="profile-page wrap">
      <div className="profile-hero">
        <div className="profile-photo" role="img" aria-label="Headshot of Haroon Tabraze" />
        <div>
          <div className="eyebrow">PhD · FCA · CIPA · Educator</div>
          <h1>Haroon Tabraze</h1>
          <p className="profile-lead">Faculty member, Department of Accounting and Law, IBA Karachi; Principal Adviser to AAOIFI for capacity building.</p>
        </div>
      </div>
      <div className="profile-body">
        <section>
          <h2>About</h2>
          <p>Haroon Tabraze holds a PhD in Accounting, is a Fellow of the Institute of Chartered Accountants of Pakistan and a Certified Islamic Professional Accountant. He completed the ACCA examinations and attained fellowship in 2005.</p>
          <p>At IBA Karachi, he teaches Taxation and Accounting for Shari’ah-based Financial Products. At AAOIFI, he advises on capacity building and works as a master trainer. He has delivered professional training for central banks and Islamic banks in Pakistan, Türkiye, Afghanistan, Kyrgyzstan, Uzbekistan, Saudi Arabia, Bahrain and the Philippines.</p>
          <p>Previously, he served as Director Technical Services at ICAP and as a partner at Baker Tilly MIQ. His other roles included Head of Information Technology at a listed company and Deputy Director Corporate Affairs at ICAP. He has served on ICAP’s Education Committee and the State Bank of Pakistan’s Shariah Advisory Committee.</p>
          <p>His book <em>Think Tax</em> and related learning resources are available on this site.</p>
          <Link className="button" href="/think-tax">Visit the Think Tax page <span aria-hidden="true">↗</span></Link>
        </section>
        <aside className="profile-facts">
          <span className="course-kicker">AREAS OF INTEREST</span>
          <div>Taxation</div><div>Accounting</div><div>Professional education</div>
          <a href="https://www.ca.com.pk" target="_blank" rel="noreferrer">Website · ca.com.pk</a>
          <a href="https://pk.linkedin.com/in/haroon-tabraze-b686b136" target="_blank" rel="noreferrer">LinkedIn · @htabraze</a>
          <a href="https://x.com/htabraze" target="_blank" rel="noreferrer">X / Twitter · @htabraze</a>
          <a href="https://www.facebook.com/htabraze" target="_blank" rel="noreferrer">Facebook · @htabraze</a>
        </aside>
      </div>
    </div>
  );
}
