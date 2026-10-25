import DownloadBook from "./download-book";

export const metadata = {
  title: "Think Tax | Haroon Tabraze",
  description: "Download Think Tax by Haroon Tabraze, PhD, FCA, CIPA."
};

export default function ThinkTaxPage() {
  return (
    <div className="think-tax-page wrap">
      <div className="eyebrow">A book by Haroon Tabraze, PhD, FCA, CIPA</div>
      <div className="think-tax-layout">
        <div className="think-tax-cover" aria-label="Think Tax book cover placeholder">
          <span className="cover-kicker">A BOOK BY</span>
          <strong>THINK<br />TAX</strong>
          <span className="cover-author">HAROON TABRAZE · PhD · FCA · CIPA</span>
        </div>
        <section className="think-tax-copy">
          <h1><em>Think Tax</em></h1>
          <p className="profile-lead">By Haroon Tabraze, PhD, FCA, CIPA.</p>
          <p>Use the button below to open the book download page on MEGA.</p>
          <DownloadBook />
          <p className="download-note">The counter records clicks on the download button. MEGA does not report whether a file download was completed.</p>
        </section>
      </div>
    </div>
  );
}
