import { site } from "@/lib/site";

/** Thin marquee-less bar above the nav. Admin-editable text lives in lib/site.ts for now. */
export function AnnouncementBar() {
  return (
    <div className="bg-ink text-mist border-b border-graphite">
      <div className="container-screen flex items-center justify-center py-2">
        <p className="eyebrow text-[0.65rem] text-mist/80 text-center">
          {site.announcement}
        </p>
      </div>
    </div>
  );
}
