"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const bookUrl = "https://mega.nz/file/gEl1BK6K#445Z_yC4QRtF7dsKRkbhI7gaCMil8dZn0Ssppc2RYOY";

function toCount(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}

export default function DownloadBook({ showLmsLink = false }: { showLmsLink?: boolean }) {
  const [count, setCount] = useState<number | null>(null);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return;
    const supabase = createClient();
    supabase.rpc("get_think_tax_download_clicks").then(({ data, error }) => {
      const nextCount = toCount(data);
      if (!error && nextCount !== null) {
        setCount(nextCount);
        setAvailable(true);
      }
    });
  }, []);

  function recordClick() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return;
    const supabase = createClient();
    void supabase.rpc("record_think_tax_download_click").then(({ data, error }) => {
      const nextCount = toCount(data);
      if (!error && nextCount !== null) {
        setCount(nextCount);
        setAvailable(true);
      }
    });
  }

  return (
    <div className="download-panel">
      <a className="button download-button" href={bookUrl} target="_blank" rel="noreferrer" onClick={recordClick}>
        Download <em>Think Tax</em> <span aria-hidden="true">↗</span>
      </a>
      {showLmsLink && <a className="button button-quiet lms-link-button" href="https://iba1.gnomio.com" target="_blank" rel="noreferrer">Link to LMS <span aria-hidden="true">↗</span></a>}
      <p className="download-count" aria-live="polite">
        {available && count !== null
          ? `${count.toLocaleString()} download button ${count === 1 ? "click" : "clicks"}`
          : "Download counter will appear when the site database is connected."}
      </p>
    </div>
  );
}
