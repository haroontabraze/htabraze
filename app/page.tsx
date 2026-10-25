import Link from "next/link";
import DownloadBook from "./think-tax/download-book";

export default function TemporaryLandingPage() {
  return (
    <section className="temporary-landing wrap">
      <div className="landing-author">
        <div className="profile-photo landing-photo" role="img" aria-label="Headshot of Haroon Tabraze" />
        <div>
          <div className="eyebrow">Haroon Tabraze · PhD · FCA · CIPA</div>
          <h1>Think Tax is ready.</h1>
          <p className="landing-intro">The book is now available for download. I hope you find it useful.</p>
          <DownloadBook showLmsLink />
        </div>
      </div>
      <div className="landing-bottom">
        <p className="temporary-note">This temporary page will stay here while the full site is being developed. The LMS is still putting its lesson plan together.</p>
        <div className="landing-links">
          <Link href="/about">About the author</Link>
          <a href="https://pk.linkedin.com/in/haroon-tabraze-b686b136" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://x.com/htabraze" target="_blank" rel="noreferrer">X / Twitter</a>
          <a href="https://www.facebook.com/htabraze" target="_blank" rel="noreferrer">Facebook</a>
        </div>
      </div>
    </section>
  );
}
