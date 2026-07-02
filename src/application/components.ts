import type { PageModel } from "./types.js";
import { HumanityLawsTheme } from "./theme.js";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const primaryNav: Array<readonly [string, string]> = [
  ["Home", "/"],
  ["Book", "/book"],
  ["Join", "/join"],
  ["Spark", "/spark"],
  ["Council", "/council"],
  ["Founder", "/founder"],
];

export function renderPageModelToHtml(page: PageModel): string {
  const actions = page.actions
    .map(
      (action) =>
        `<a class="button button-${action.kind.toLowerCase()}" href="${escapeHtml(action.href)}" aria-label="${escapeHtml(action.ariaLabel ?? action.label)}"><span>${escapeHtml(action.label)}</span></a>`,
    )
    .join("");

  const sections = page.sections
    .map((section, index) => {
      const bullets = section.bullets?.length
        ? `<ul class="fine-list">${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : "";
      return `<section class="room room-${index + 1}"><div class="room-glow" aria-hidden="true"></div><p class="eyebrow">${escapeHtml(section.eyebrow ?? "Humanity Laws")}</p><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.body)}</p>${bullets}</section>`;
    })
    .join("");

  const nav = primaryNav
    .map(([label, href]) => `<a href="${href}"${page.pageId.toLowerCase() === label.toLowerCase() ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("");

  const statusPill = page.kind === "PUBLIC" ? "Open home" : page.kind === "MEMBER" ? "Member room" : page.kind === "ADMIN" ? "Stewardship" : page.kind;

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="description" content="${escapeHtml(page.subtitle)}"/><title>${escapeHtml(page.seoTitle)}</title><style>${launchCss()}</style></head><body><a class="skip-link" href="#content">Skip to content</a><div class="ambient" aria-hidden="true"></div><main id="content" class="shell"><nav class="nav" aria-label="Primary navigation"><a class="brand" href="/" aria-label="Humanity Laws home"><span class="brand-mark">HL</span><span>Humanity Laws</span></a><div class="nav-links">${nav}</div><span class="status-pill">${escapeHtml(statusPill)}</span></nav><header class="hero"><p class="eyebrow">${escapeHtml(page.accessibilitySummary)}</p><h1>${escapeHtml(page.title)}</h1><p class="hero-copy">${escapeHtml(page.subtitle)}</p><div class="actions">${actions}</div></header><section class="threshold" aria-label="Humanity Laws promise"><span>Peace</span><span>Truth</span><span>Dignity</span><span>Daily return</span></section>${sections}<footer class="footer"><p>Humanity Laws is built for honest growth. Adam and Eve are AI companions and never replace human judgment.</p><a href="/launch-status">Evidence-derived launch status</a></footer></main></body></html>`;
}

export function launchCss(): string {
  return `:root{color-scheme:dark;--black:${HumanityLawsTheme.colors.black};--deep:${HumanityLawsTheme.colors.deepBlack};--ivory:${HumanityLawsTheme.colors.ivory};--soft:${HumanityLawsTheme.colors.softIvory};--gold:${HumanityLawsTheme.colors.softGold};--antique:${HumanityLawsTheme.colors.antiqueGold};--gray:${HumanityLawsTheme.colors.warmGray};--clay:${HumanityLawsTheme.colors.clay};--line:rgba(255,255,255,.13);--glass:rgba(255,255,255,.055)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;min-height:100vh;background:radial-gradient(circle at 18% 0%,rgba(216,184,102,.18),transparent 30%),radial-gradient(circle at 92% 18%,rgba(255,255,255,.08),transparent 28%),linear-gradient(135deg,#050505 0%,#11100d 48%,#050505 100%);color:var(--ivory);font-family:${HumanityLawsTheme.typography.body};-webkit-font-smoothing:antialiased}.ambient{position:fixed;inset:0;pointer-events:none;background:linear-gradient(120deg,transparent,rgba(255,255,255,.045),transparent);mask-image:radial-gradient(circle at center,black,transparent 72%)}.skip-link{position:absolute;left:-999px}.skip-link:focus{left:16px;top:16px;z-index:5;background:var(--ivory);color:#000;padding:10px 14px;border-radius:999px}.shell{width:min(1180px,100%);margin:0 auto;padding:22px clamp(18px,4vw,44px) 76px}.nav{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:18px;padding:16px 0 18px;backdrop-filter:blur(22px)}.brand{display:flex;align-items:center;gap:10px;color:var(--ivory);text-decoration:none;font-weight:700;letter-spacing:-.02em}.brand-mark{display:grid;place-items:center;width:38px;height:38px;border:1px solid rgba(216,184,102,.5);border-radius:14px;background:linear-gradient(145deg,rgba(216,184,102,.18),rgba(255,255,255,.04));color:var(--gold);font-size:.76rem}.nav-links{display:flex;align-items:center;gap:8px;padding:6px;border:1px solid rgba(255,255,255,.09);border-radius:999px;background:rgba(255,255,255,.035)}.nav-links a{color:var(--gray);text-decoration:none;font-size:.9rem;padding:9px 12px;border-radius:999px;transition:background ${HumanityLawsTheme.motion.defaultDurationMs}ms ease,color ${HumanityLawsTheme.motion.defaultDurationMs}ms ease}.nav-links a:hover,.nav-links a[aria-current=page]{background:rgba(255,255,255,.075);color:var(--ivory)}.status-pill{white-space:nowrap;color:#120f09;background:linear-gradient(135deg,#f3dc95,#bc8f3c);border-radius:999px;padding:9px 12px;font-size:.78rem;font-weight:700}.hero{padding:clamp(56px,11vw,120px) 0 38px}.eyebrow{letter-spacing:.18em;text-transform:uppercase;color:var(--gold);font-size:.74rem;font-weight:800;margin:0 0 14px}h1{font-size:clamp(3.4rem,10vw,8.8rem);line-height:.88;margin:0 0 24px;letter-spacing:-.075em;max-width:980px}h2{font-size:clamp(1.8rem,4.6vw,3.8rem);line-height:1;margin:0 0 16px;letter-spacing:-.055em}.hero-copy,.room p,.footer p{font-size:clamp(1.02rem,2vw,1.25rem);line-height:1.75;max-width:760px;color:#e8dece}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.button{position:relative;display:inline-flex;align-items:center;justify-content:center;min-height:48px;border:1px solid rgba(216,184,102,.42);border-radius:999px;padding:13px 20px;text-decoration:none;color:var(--ivory);background:rgba(255,255,255,.055);box-shadow:0 14px 34px rgba(0,0,0,.28);transition:transform 200ms ease,background 200ms ease}.button:hover{transform:translateY(-2px);background:rgba(255,255,255,.095)}.button-primary{background:linear-gradient(135deg,#f5df99,#b98d3d);color:#080604;border:0;font-weight:800}.button-tertiary{border-color:rgba(255,255,255,.18);color:var(--gray)}.threshold{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:18px 0 26px}.threshold span{border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:16px;color:var(--soft);background:rgba(255,255,255,.035);text-align:center}.room{position:relative;overflow:hidden;margin:18px 0;padding:clamp(24px,4vw,42px);border:1px solid var(--line);border-radius:34px;background:linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.028));box-shadow:0 28px 80px rgba(0,0,0,.28);backdrop-filter:blur(18px)}.room-glow{position:absolute;right:-90px;top:-90px;width:220px;height:220px;border-radius:999px;background:rgba(216,184,102,.11);filter:blur(12px)}.fine-list{display:grid;gap:10px;margin:22px 0 0;padding:0;list-style:none}.fine-list li{position:relative;padding-left:26px;color:#e9dfcf;line-height:1.6}.fine-list li:before{content:"";position:absolute;left:0;top:.72em;width:8px;height:8px;border-radius:999px;background:var(--gold)}.footer{display:flex;justify-content:space-between;gap:24px;align-items:center;margin-top:28px;padding-top:28px;border-top:1px solid rgba(255,255,255,.1);color:var(--gray)}.footer a{color:var(--gold);text-decoration:none}@media(max-width:820px){.nav{align-items:flex-start}.nav-links{display:none}.status-pill{display:none}.hero{padding-top:54px}.threshold{grid-template-columns:1fr 1fr}.actions{flex-direction:column}.button{width:100%}.footer{display:block}.shell{padding-bottom:46px}}@media(max-width:480px){h1{font-size:3.2rem}.threshold{grid-template-columns:1fr}.room{border-radius:26px}}`;
}
