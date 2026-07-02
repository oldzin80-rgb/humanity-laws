import type { ManualReview } from "../../admin/index.js";
import type { ReleaseApproval } from "../../admin/index.js";
import type { PageModel } from "../types.js";
import { getHumanityLawsArchiveManifest } from "../../humanity-laws-source/bookRegistry.js";

export function createAdminPage(params: { latestReview?: ManualReview | null; latestApproval?: ReleaseApproval | null } = {}): PageModel {
  const manifest = getHumanityLawsArchiveManifest();
  return {
    pageId: "admin",
    kind: "ADMIN",
    title: "Stewardship Dashboard",
    subtitle: "Review evidence, record human judgment, and protect the launch gate.",
    seoTitle: "Admin — Humanity Laws",
    accessibilitySummary: "Admin dashboard page",
    actions: [{ label: "Launch Status", href: "/launch-status", kind: "PRIMARY" }],
    sections: [
      { eyebrow: "Manual review", title: "Human judgment remains required.", body: params.latestReview ? `Latest review by ${params.latestReview.reviewer}: ${params.latestReview.approved ? "approved" : "not approved"}.` : "Manual review has not been recorded." },
      { eyebrow: "Release approval", title: "Release requires explicit approval.", body: params.latestApproval ? `Latest approval by ${params.latestApproval.approver}: ${params.latestApproval.approved ? "approved" : "not approved"}.` : "Release approval has not been recorded." },
      { eyebrow: "Archive evidence", title: "Book source is visible but does not approve launch.", body: `The preserved Humanity Laws archive is visible for review: ${manifest.source.pageCount} pages, SHA-256 ${manifest.source.sha256}.` },
      { title: "Evidence boundary", body: "The dashboard may display evidence and blockers, but it must not fabricate deployment, release readiness, or lifecycle advancement." },
    ],
  };
}
