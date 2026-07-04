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
  ["Spark", "/spark"],
  ["Adam & Eve", "/council"],
  ["The Table", "/table"],
  ["Library", "/library"],
];

const secondaryNav: Array<readonly [string, string]> = [
  ["Dashboard", "/dashboard"],
  ["Council", "/council"],
  ["Podcast", "/podcast"],
  ["Founder", "/founder"],
  ["Wellness", "/wellness"],
  ["Community", "/community"],
  ["Settings", "/member-room"],
  ["Membership", "/membership"],
];

export function renderPageModelToHtml(page: PageModel): string {
  const authPanel = renderAuthPanel(page);
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
    .map(([label, href]) => `<a href="${href}"${isCurrentNav(page, label, href) ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("");
  const secondary = secondaryNav
    .map(([label, href]) => `<a href="${href}"${isCurrentNav(page, label, href) ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("");

  const roomIndicator = renderRoomIndicator(page);
  const nextSteps = renderNextStepCards(page);
  const pathways = renderConnectedPathways(page);
  const emptyState = page.emptyState ? renderEmptyState(page.emptyState, page.actions[0]) : "";

  const statusPill = page.kind === "PUBLIC" ? "Open home" : page.kind === "MEMBER" ? "Member room" : page.kind === "ADMIN" ? "Stewardship" : page.kind;
  const sessionControls = page.kind === "MEMBER" || page.kind === "ADMIN" ? `<button class="session-link" type="button" data-auth-logout>Log out</button>` : "";

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="description" content="${escapeHtml(page.subtitle)}"/><title>${escapeHtml(page.seoTitle)}</title><style>${launchCss()}</style></head><body data-page-kind="${escapeHtml(page.kind)}" data-page-id="${escapeHtml(page.pageId)}"><a class="skip-link" href="#content">Skip to content</a><div class="ambient" aria-hidden="true"></div><main id="content" class="shell"><nav class="nav" aria-label="Primary navigation"><a class="brand" href="/" aria-label="Humanity Laws home"><span class="brand-mark">HL</span><span>Humanity Laws</span></a><div class="nav-links">${nav}</div><details class="profile-menu"><summary>More</summary><div class="profile-links">${secondary}</div></details><span class="status-pill">${escapeHtml(statusPill)}</span>${sessionControls}</nav><header class="hero">${roomIndicator}<p class="eyebrow">${escapeHtml(page.accessibilitySummary)}</p><h1>${escapeHtml(page.title)}</h1><p class="hero-copy">${escapeHtml(page.subtitle)}</p>${authPanel}<div class="actions">${actions}</div></header><section class="threshold" aria-label="Humanity Laws promise"><span>Peace</span><span>Truth</span><span>Dignity</span><span>Daily return</span></section>${sections}${emptyState}${nextSteps}${pathways}<footer class="footer"><p>Humanity Laws is built for honest growth. Adam and Eve are AI companions and never replace human judgment.</p><a href="/launch-status">Evidence-derived launch status</a></footer></main><script>${authClientScript()}</script></body></html>`;
}

function isCurrentNav(page: PageModel, label: string, href: string): boolean {
  if (href === "/" && page.pageId === "home") return true;
  if (href === "/book" && page.pageId === "book") return true;
  if (href === "/council" && ["adam", "eve", "council"].includes(page.pageId)) return true;
  if (href === "/table" && page.pageId === "table") return true;
  if (href === "/library" && page.pageId === "library") return true;
  return page.pageId.toLowerCase() === label.toLowerCase().replaceAll(" ", "-");
}

function roomName(page: PageModel): string {
  const rooms: Record<string, string> = {
    home: "Front Door",
    dashboard: "Living Room",
    book: "Study",
    spark: "Inspiration Room",
    adam: "Conversation Room",
    eve: "Conversation Room",
    council: "Council Chamber",
    table: "Dining Room",
    library: "Personal Library",
    podcast: "Listening Room",
    founder: "Founder Study",
    wellness: "Garden",
    community: "Community Room",
    "member-room": "Member Room",
    join: "Membership",
    login: "Sign In",
    signup: "Account",
    admin: "Stewardship",
    "launch-status": "Launch Status",
    hardcover: "Book Store",
  };
  return rooms[page.pageId] ?? "Humanity Laws";
}

function renderRoomIndicator(page: PageModel): string {
  const room = roomName(page);
  const current = page.pageId === "home" ? "Home" : `Home / ${room}`;
  return `<p class="room-indicator" aria-label="Room indicator">You're in ${escapeHtml(room)} <span>${escapeHtml(current)}</span></p>`;
}

function renderNextStepCards(page: PageModel): string {
  const actions = page.actions.slice(0, 3);
  if (!actions.length) return "";
  return `<section class="next-steps" aria-label="Natural next steps"><p class="eyebrow">Next step</p><h2>What you can do now</h2><div class="next-grid">${actions
    .map((action) => `<a class="next-card" href="${escapeHtml(action.href)}"><span>${escapeHtml(action.label)}</span><small>${escapeHtml(nextStepDescription(action.label))}</small></a>`)
    .join("")}</div></section>`;
}

function nextStepDescription(label: string): string {
  const normalized = label.toLowerCase();
  if (normalized.includes("dashboard")) return "Return to your main hub.";
  if (normalized.includes("spark")) return "Start one clear reflection.";
  if (normalized.includes("council")) return "Use Adam and Eve for deeper perspective.";
  if (normalized.includes("book")) return "Read the foundation.";
  if (normalized.includes("library")) return "Save and find what matters.";
  if (normalized.includes("table")) return "Visit the room for gratitude and connection.";
  if (normalized.includes("stripe")) return "Continue through secure checkout.";
  if (normalized.includes("join")) return "Open membership options.";
  return "Continue through the house.";
}

function renderConnectedPathways(page: PageModel): string {
  const pathways: Record<string, Array<readonly [string, string]>> = {
    home: [["Read the Book", "/book"], ["Start Spark", "/spark"], ["Join", "/membership"]],
    dashboard: [["Start Spark", "/spark"], ["Talk with Adam & Eve", "/council"], ["Open Library", "/library"]],
    book: [["Create a Spark", "/spark"], ["Discuss with Adam & Eve", "/council"], ["Save to Library", "/library"]],
    spark: [["Reflect with Adam & Eve", "/council"], ["Save to Library", "/library"], ["Explore the Book", "/book"]],
    adam: [["Open Council", "/council"], ["Read the Book", "/book"], ["Save to Library", "/library"]],
    eve: [["Open Council", "/council"], ["Visit The Table", "/table"], ["Save to Library", "/library"]],
    council: [["Read the Book", "/book"], ["Save to Library", "/library"], ["Return to Dashboard", "/dashboard"]],
    table: [["Save to Library", "/library"], ["Talk with Adam & Eve", "/council"], ["Start Spark", "/spark"]],
    podcast: [["Start Spark", "/spark"], ["Talk with Adam & Eve", "/council"], ["Open Library", "/library"]],
    founder: [["Listen", "/podcast"], ["Open Library", "/library"], ["Return to Dashboard", "/dashboard"]],
    wellness: [["Start Spark", "/spark"], ["Talk with Adam & Eve", "/council"], ["Save to Library", "/library"]],
    community: [["Visit The Table", "/table"], ["Open Council", "/council"], ["Return to Dashboard", "/dashboard"]],
    library: [["Read the Book", "/book"], ["Start Spark", "/spark"], ["Talk with Adam & Eve", "/council"]],
  };
  const items = pathways[page.pageId];
  if (!items?.length) return "";
  return `<section class="connected-pathways" aria-label="Connected pathways"><p class="eyebrow">Connected rooms</p><h2>This connects naturally to</h2><div class="pathway-row">${items
    .map(([label, href]) => `<a href="${href}">${escapeHtml(label)}</a>`)
    .join("")}</div></section>`;
}

function renderEmptyState(message: string, action?: PageModel["actions"][number]): string {
  const link = action ? `<a class="button button-secondary" href="${escapeHtml(action.href)}">${escapeHtml(action.label)}</a>` : "";
  return `<section class="empty-state" aria-label="Empty state"><p>${escapeHtml(message)}</p>${link}</section>`;
}

function renderAuthPanel(page: PageModel): string {
  if (page.pageId === "signup") {
    return `<form class="auth-form" data-auth-form="signup"><label>Name<input required autocomplete="name" name="displayName" type="text"/></label><label>Email<input required autocomplete="email" name="email" type="email"/></label><label>Password<input required autocomplete="new-password" minlength="8" name="password" type="password"/></label><button class="button button-primary" type="submit">Create account</button><p class="auth-message" role="status" data-auth-message></p></form>`;
  }

  if (page.pageId === "login") {
    return `<form class="auth-form" data-auth-form="login"><label>Email<input required autocomplete="email" name="email" type="email"/></label><label>Password<input required autocomplete="current-password" minlength="8" name="password" type="password"/></label><button class="button button-primary" type="submit">Sign in</button><p class="auth-message" role="status" data-auth-message></p></form>`;
  }

  return "";
}

function authClientScript(): string {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  return `(()=>{const A="hl_auth_session_v1",M="hl_members_v1",S="hl_membership_status_v1",C={url:${JSON.stringify(supabaseUrl)},anonKey:${JSON.stringify(supabaseAnonKey)}};const now=()=>Date.now();const days=30*24*60*60*1000;const path=location.pathname;const authUrl=p=>C.url.replace(/\\/$/,"")+"/auth/v1"+p;const headers=token=>({"apikey":C.anonKey,"Authorization":"Bearer "+(token||C.anonKey),"Content-Type":"application/json"});const apiHeaders=s=>({"Authorization":"Bearer "+s.accessToken,"Content-Type":"application/json"});const hasSupabase=()=>Boolean(C.url&&C.anonKey);const getMembers=()=>{try{return JSON.parse(localStorage.getItem(M)||"{}")}catch{return{}}};const setMembers=v=>localStorage.setItem(M,JSON.stringify(v));const getSession=()=>{try{const s=JSON.parse(localStorage.getItem(A)||"null");return s&&s.expiresAt>now()?s:null}catch{return null}};const storeSession=s=>{localStorage.setItem(A,JSON.stringify(s));return s};const storeSupabaseSession=d=>storeSession({provider:"supabase",memberId:d.user?.id||d.user?.email,email:d.user?.email,displayName:d.user?.user_metadata?.display_name||d.user?.email,accessToken:d.access_token,refreshToken:d.refresh_token,createdAt:now(),expiresAt:now()+((d.expires_in||3600)*1000)});const setLocalSession=m=>storeSession({provider:"local",memberId:m.memberId,email:m.email,displayName:m.displayName,createdAt:now(),expiresAt:now()+days});const setMembership=v=>localStorage.setItem(S,JSON.stringify({active:Boolean(v.active),bookAccess:Boolean(v.bookAccess),membershipStatus:v.membershipStatus||"FREE",checkedAt:now()}));const getMembership=()=>{try{return JSON.parse(localStorage.getItem(S)||"null")}catch{return null}};const clear=()=>{localStorage.removeItem(A);localStorage.removeItem(S)};const next=()=>new URLSearchParams(location.search).get("next")||"/dashboard";const memberOnly=["/dashboard","/book","/member-room","/spark","/adam","/eve","/council","/founder","/wellness","/table","/library","/community","/admin"];const checkoutStart={\"/checkout/monthly\":\"MONTHLY_7\",\"/checkout/yearly\":\"YEARLY_70\",\"/checkout/book\":\"DIGITAL_BOOK\"};const isCheckoutSuccess=path==="/checkout/success";const needsSession=memberOnly.includes(path)||checkoutStart[path]||isCheckoutSuccess;if(needsSession&&!getSession()){location.replace("/login?next="+encodeURIComponent(path+location.search));return}const sayGlobal=t=>{const p=document.querySelector("[data-auth-message]")||document.createElement("p");p.textContent=t;p.className="auth-message";if(!p.parentElement)document.querySelector(".hero")?.appendChild(p)};const checkMembership=async()=>{const s=getSession();if(!s?.accessToken)return{active:false,bookAccess:false};const r=await fetch("/api/membership-status",{headers:apiHeaders(s)});const d=await r.json().catch(()=>({active:false,bookAccess:false}));if(r.ok)setMembership(d);return d};const paidOnly=["/dashboard","/book","/member-room","/spark","/adam","/eve","/council","/founder","/wellness","/table","/library","/community","/admin"];if(paidOnly.includes(path)){checkMembership().then(d=>{const ok=path==="/book"?d.bookAccess:d.active;if(!ok)location.replace(path==="/book"?"/membership?book=required":"/membership?membership=required")}).catch(()=>location.replace("/membership?membership=unverified"))}if(checkoutStart[path]){document.querySelectorAll(".button-primary").forEach(b=>b.addEventListener("click",async e=>{e.preventDefault();const s=getSession();if(!s?.accessToken){location.assign("/login?next="+encodeURIComponent(path));return}try{sayGlobal("Opening secure Stripe checkout...");const r=await fetch("/api/checkout",{method:"POST",headers:apiHeaders(s),body:JSON.stringify({planId:checkoutStart[path]})});const d=await r.json();if(!r.ok||!d.checkoutUrl)throw new Error(d.error||"Checkout could not start.");location.assign(d.checkoutUrl)}catch(error){sayGlobal(error instanceof Error?error.message:"Checkout could not start.")}}))}if(isCheckoutSuccess){const sid=new URLSearchParams(location.search).get("session_id");if(sid){const s=getSession();fetch("/api/membership-status",{method:"POST",headers:apiHeaders(s),body:JSON.stringify({sessionId:sid})}).then(r=>r.json().then(d=>({ok:r.ok,d}))).then(({ok,d})=>{if(ok&&(d.active||d.bookAccess)){setMembership(d);sayGlobal(d.active?"Membership is active. Your dashboard is unlocked.":"Digital book access is active.")}else{sayGlobal(d.error||"Membership could not be verified yet.")}}).catch(()=>sayGlobal("Membership could not be verified yet."))}}document.querySelectorAll("[data-auth-logout]").forEach(b=>b.addEventListener("click",async()=>{const s=getSession();clear();if(hasSupabase()&&s?.accessToken){try{await fetch(authUrl("/logout"),{method:"POST",headers:headers(s.accessToken)})}catch{}}location.assign("/login")}));const form=document.querySelector("[data-auth-form]");if(!form)return;const msg=form.querySelector("[data-auth-message]");const say=t=>{if(msg)msg.textContent=t};const supabaseRequest=async(endpoint,body)=>{const r=await fetch(authUrl(endpoint),{method:"POST",headers:headers(),body:JSON.stringify(body)});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.msg||d.error_description||d.error||"Authentication failed.");return d};form.addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(form);const email=String(fd.get("email")||"").trim().toLowerCase();const password=String(fd.get("password")||"");const displayName=String(fd.get("displayName")||"").trim();if(!email||password.length<8){say("Use an email and a password with at least 8 characters.");return}try{if(hasSupabase()){if(form.getAttribute("data-auth-form")==="signup"){const data=await supabaseRequest("/signup",{email,password,data:{display_name:displayName||email.split("@")[0]}});if(data.session){storeSupabaseSession(data.session)}else if(data.access_token){storeSupabaseSession(data)}else{say("Check your email to confirm your account.");return}location.assign(next());return}const data=await supabaseRequest("/token?grant_type=password",{email,password});storeSupabaseSession(data);location.assign(next());return}const members=getMembers();if(form.getAttribute("data-auth-form")==="signup"){const member=members[email]||{memberId:"member_"+crypto.randomUUID(),email,displayName:displayName||email.split("@")[0],createdAt:new Date().toISOString()};member.displayName=displayName||member.displayName;member.password=password;members[email]=member;setMembers(members);setLocalSession(member);location.assign(next());return}const member=members[email];if(!member||member.password!==password){say("Email or password is not correct.");return}setLocalSession(member);location.assign(next())}catch(error){say(error instanceof Error?error.message:"Authentication failed.")}})})();`;
}

export function launchCss(): string {
  return `:root{color-scheme:dark;--black:${HumanityLawsTheme.colors.black};--deep:${HumanityLawsTheme.colors.deepBlack};--ivory:${HumanityLawsTheme.colors.ivory};--soft:${HumanityLawsTheme.colors.softIvory};--gold:${HumanityLawsTheme.colors.softGold};--antique:${HumanityLawsTheme.colors.antiqueGold};--gray:${HumanityLawsTheme.colors.warmGray};--clay:${HumanityLawsTheme.colors.clay};--line:rgba(255,255,255,.13);--glass:rgba(255,255,255,.055)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;min-height:100vh;background:radial-gradient(circle at 18% 0%,rgba(216,184,102,.18),transparent 30%),radial-gradient(circle at 92% 18%,rgba(255,255,255,.08),transparent 28%),linear-gradient(135deg,#050505 0%,#11100d 48%,#050505 100%);color:var(--ivory);font-family:${HumanityLawsTheme.typography.body};-webkit-font-smoothing:antialiased}.ambient{position:fixed;inset:0;pointer-events:none;background:linear-gradient(120deg,transparent,rgba(255,255,255,.045),transparent);mask-image:radial-gradient(circle at center,black,transparent 72%)}.skip-link{position:absolute;left:-999px}.skip-link:focus{left:16px;top:16px;z-index:5;background:var(--ivory);color:#000;padding:10px 14px;border-radius:999px}.shell{width:min(1180px,100%);margin:0 auto;padding:22px clamp(18px,4vw,44px) 76px}.nav{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:14px;padding:16px 0 18px;backdrop-filter:blur(22px)}.brand{display:flex;align-items:center;gap:10px;color:var(--ivory);text-decoration:none;font-weight:700;letter-spacing:-.02em}.brand-mark{display:grid;place-items:center;width:38px;height:38px;border:1px solid rgba(216,184,102,.5);border-radius:14px;background:linear-gradient(145deg,rgba(216,184,102,.18),rgba(255,255,255,.04));color:var(--gold);font-size:.76rem}.nav-links{display:flex;align-items:center;gap:8px;padding:6px;border:1px solid rgba(255,255,255,.09);border-radius:999px;background:rgba(255,255,255,.035)}.nav-links a,.profile-links a{color:var(--gray);text-decoration:none;font-size:.9rem;padding:9px 12px;border-radius:999px;transition:background ${HumanityLawsTheme.motion.defaultDurationMs}ms ease,color ${HumanityLawsTheme.motion.defaultDurationMs}ms ease}.nav-links a:hover,.nav-links a[aria-current=page],.profile-links a:hover,.profile-links a[aria-current=page]{background:rgba(255,255,255,.075);color:var(--ivory)}.profile-menu{position:relative}.profile-menu summary{list-style:none;cursor:pointer;border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:9px 12px;color:var(--soft);background:rgba(255,255,255,.035)}.profile-menu summary::-webkit-details-marker{display:none}.profile-links{position:absolute;right:0;top:44px;display:grid;min-width:190px;padding:10px;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:rgba(8,8,8,.94);box-shadow:0 24px 70px rgba(0,0,0,.38)}.status-pill{white-space:nowrap;color:#120f09;background:linear-gradient(135deg,#f3dc95,#bc8f3c);border-radius:999px;padding:9px 12px;font-size:.78rem;font-weight:700}.session-link{border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,255,255,.045);color:var(--ivory);padding:9px 12px;font:inherit;font-size:.84rem;cursor:pointer}.hero{padding:clamp(56px,11vw,120px) 0 38px}.room-indicator{display:inline-flex;gap:10px;align-items:center;margin:0 0 16px;padding:8px 12px;border:1px solid rgba(255,255,255,.1);border-radius:999px;color:var(--soft);background:rgba(255,255,255,.035);font-size:.88rem}.room-indicator span{color:var(--gold)}.eyebrow{letter-spacing:.18em;text-transform:uppercase;color:var(--gold);font-size:.74rem;font-weight:800;margin:0 0 14px}h1{font-size:clamp(3.4rem,10vw,8.8rem);line-height:.88;margin:0 0 24px;letter-spacing:-.075em;max-width:980px}h2{font-size:clamp(1.8rem,4.6vw,3.8rem);line-height:1;margin:0 0 16px;letter-spacing:-.055em}.hero-copy,.room p,.footer p,.empty-state p{font-size:clamp(1.02rem,2vw,1.25rem);line-height:1.75;max-width:760px;color:#e8dece}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.button{position:relative;display:inline-flex;align-items:center;justify-content:center;min-height:48px;border:1px solid rgba(216,184,102,.42);border-radius:999px;padding:13px 20px;text-decoration:none;color:var(--ivory);background:rgba(255,255,255,.055);box-shadow:0 14px 34px rgba(0,0,0,.28);transition:transform 200ms ease,background 200ms ease}.button:hover{transform:translateY(-2px);background:rgba(255,255,255,.095)}.button-primary{background:linear-gradient(135deg,#f5df99,#b98d3d);color:#080604;border:0;font-weight:800}.button-tertiary{border-color:rgba(255,255,255,.18);color:var(--gray)}.auth-form{display:grid;gap:14px;width:min(440px,100%);margin-top:30px;padding:22px;border:1px solid var(--line);border-radius:28px;background:rgba(255,255,255,.055)}.auth-form label{display:grid;gap:7px;color:var(--soft);font-weight:700}.auth-form input{width:100%;border:1px solid rgba(255,255,255,.18);border-radius:16px;background:rgba(0,0,0,.28);color:var(--ivory);padding:13px 14px;font:inherit}.auth-form button{width:100%;cursor:pointer}.auth-message{min-height:1.4em;margin:0;color:var(--gold)}.threshold{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:18px 0 26px}.threshold span{border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:16px;color:var(--soft);background:rgba(255,255,255,.035);text-align:center}.room,.next-steps,.connected-pathways,.empty-state{position:relative;overflow:hidden;margin:18px 0;padding:clamp(24px,4vw,42px);border:1px solid var(--line);border-radius:34px;background:linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.028));box-shadow:0 28px 80px rgba(0,0,0,.28);backdrop-filter:blur(18px)}.room-glow{position:absolute;right:-90px;top:-90px;width:220px;height:220px;border-radius:999px;background:rgba(216,184,102,.11);filter:blur(12px)}.fine-list{display:grid;gap:10px;margin:22px 0 0;padding:0;list-style:none}.fine-list li{position:relative;padding-left:26px;color:#e9dfcf;line-height:1.6}.fine-list li:before{content:"";position:absolute;left:0;top:.72em;width:8px;height:8px;border-radius:999px;background:var(--gold)}.next-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.next-card{display:grid;gap:7px;min-height:116px;padding:18px;border:1px solid rgba(255,255,255,.12);border-radius:24px;text-decoration:none;background:rgba(255,255,255,.035);color:var(--ivory)}.next-card span{font-weight:800}.next-card small{color:var(--gray);line-height:1.5}.pathway-row{display:flex;gap:10px;flex-wrap:wrap}.pathway-row a{color:var(--ivory);text-decoration:none;border:1px solid rgba(216,184,102,.32);border-radius:999px;padding:11px 14px;background:rgba(255,255,255,.045)}.empty-state{display:flex;align-items:center;justify-content:space-between;gap:18px}.footer{display:flex;justify-content:space-between;gap:24px;align-items:center;margin-top:28px;padding-top:28px;border-top:1px solid rgba(255,255,255,.1);color:var(--gray)}.footer a{color:var(--gold);text-decoration:none}@media(max-width:980px){.nav{flex-wrap:wrap}.nav-links{order:3;width:100%;justify-content:center}.next-grid{grid-template-columns:1fr}}@media(max-width:820px){.nav{align-items:flex-start}.nav-links{display:none}.profile-menu{margin-left:auto}.status-pill{display:none}.hero{padding-top:54px}.threshold{grid-template-columns:1fr 1fr}.actions,.empty-state{flex-direction:column;align-items:stretch}.button{width:100%}.footer{display:block}.shell{padding-bottom:46px}}@media(max-width:480px){h1{font-size:3.2rem}.threshold{grid-template-columns:1fr}.room,.next-steps,.connected-pathways,.empty-state{border-radius:26px}.room-indicator{display:grid;border-radius:18px}}`;
}
