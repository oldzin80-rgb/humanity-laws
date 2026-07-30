export const SupportStates = ["NEW","TRIAGED","WAITING_FOR_MEMBER","WAITING_FOR_INTERNAL_ACTION","IN_PROGRESS","ESCALATED","RESOLVED","CLOSED","REOPENED","BLOCKED","DUPLICATE","SPAM","SAFETY_REVIEW","PRIVACY_REVIEW","UNKNOWN"] as const;
export type SupportState = typeof SupportStates[number];
export const SupportCategories = ["ACCOUNT_ACCESS","LOGIN_VERIFICATION","MEMBERSHIP_ACTIVATION","BILLING_PAYMENT","FAILED_PAYMENT","CANCELLATION_REQUEST","REFUND_REQUEST","BOOK_DOWNLOAD","LULU_FULFILLMENT","PROFILE_PREFERENCES","SPARK_NOTIFICATION","ADAM_EVE_FUNCTIONALITY","MEMORY_TIMELINE_LEGACY","PRIVACY_REQUEST","CONSENT_PREFERENCE","TECHNICAL_PROBLEM","ACCESSIBILITY","CONTENT_REPORT","SAFETY_CONCERN","GENERAL_FEEDBACK","FOUNDER_ESCALATION"] as const;
export type SupportCategory = typeof SupportCategories[number];
export type IntakeChannel = "IN_APP"|"WEB"|"EMAIL"|"SMS"|"FOUNDER";
export type VerificationState = "UNVERIFIED"|"SESSION_VERIFIED"|"DESTINATION_VERIFIED"|"MANUALLY_VERIFIED";

const transitions: Record<SupportState, readonly SupportState[]> = {
 NEW:["TRIAGED","DUPLICATE","SPAM","SAFETY_REVIEW","PRIVACY_REVIEW"], TRIAGED:["IN_PROGRESS","WAITING_FOR_MEMBER","WAITING_FOR_INTERNAL_ACTION","ESCALATED","BLOCKED"],
 WAITING_FOR_MEMBER:["IN_PROGRESS","ESCALATED","CLOSED"], WAITING_FOR_INTERNAL_ACTION:["IN_PROGRESS","ESCALATED","BLOCKED"],
 IN_PROGRESS:["WAITING_FOR_MEMBER","WAITING_FOR_INTERNAL_ACTION","ESCALATED","RESOLVED","BLOCKED","SAFETY_REVIEW","PRIVACY_REVIEW"],
 ESCALATED:["IN_PROGRESS","RESOLVED","BLOCKED"], RESOLVED:["CLOSED","REOPENED"], CLOSED:["REOPENED"],
 REOPENED:["TRIAGED","IN_PROGRESS","ESCALATED"], BLOCKED:["TRIAGED","IN_PROGRESS","CLOSED"], DUPLICATE:["REOPENED"], SPAM:[],
 SAFETY_REVIEW:["ESCALATED","IN_PROGRESS","RESOLVED"], PRIVACY_REVIEW:["WAITING_FOR_MEMBER","WAITING_FOR_INTERNAL_ACTION","IN_PROGRESS","RESOLVED"],
 UNKNOWN:["TRIAGED","BLOCKED"],
};
export function transitionSupport(from: SupportState, to: SupportState): SupportState {
 if (!transitions[from].includes(to)) throw new Error(`FORBIDDEN_SUPPORT_TRANSITION:${from}:${to}`);
 return to;
}

export interface SupportIntake {
 id:string; idempotencyKey:string; memberId?:string; channel:IntakeChannel; category:SupportCategory;
 message:string; locale:string; environment:"LOCAL"|"DEVELOPMENT"|"STAGING"|"PRODUCTION";
 verification:VerificationState; advertisingConsent:boolean; communicationAllowed:boolean; suppressed:boolean;
 expectedVersion:number; currentVersion:number; receivedAt:string;
}
export interface SupportCase {
 id:string; memberReference?:string; channel:IntakeChannel; category:SupportCategory; priority:"LOW"|"NORMAL"|"HIGH"|"URGENT";
 state:SupportState; queue:string; privacy:"STANDARD"|"RESTRICTED"; safety:"STANDARD"|"URGENT_REVIEW";
 minimizedSummary:string; dueAt:string; immutableEventReference:string; auditReference:string; outboxReference?:string;
 externalCalls:0; productionMutations:0;
}
const sensitivePatterns = [
 /(?:\b\d[ -]*?){13,19}\b/g, /password\s*[:=]\s*\S+/gi, /verification\s*code\s*[:=]?\s*\d+/gi,
 /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, /\+?\d[\d\s().-]{8,}/g,
];
export function minimizeSupportText(text:string):string {
 return sensitivePatterns.reduce((value, pattern) => value.replace(pattern, "[REDACTED]"), text).slice(0,1000);
}
export function routeSupport(category:SupportCategory) {
 if (category==="SAFETY_CONCERN") return {queue:"RESTRICTED_SAFETY",priority:"URGENT" as const,state:"SAFETY_REVIEW" as const,privacy:"RESTRICTED" as const};
 if (category==="PRIVACY_REQUEST") return {queue:"RESTRICTED_PRIVACY",priority:"HIGH" as const,state:"PRIVACY_REVIEW" as const,privacy:"RESTRICTED" as const};
 if (["REFUND_REQUEST","CANCELLATION_REQUEST","BILLING_PAYMENT","FAILED_PAYMENT","LULU_FULFILLMENT"].includes(category)) return {queue:"FOUNDER_FINANCE_FULFILLMENT",priority:"HIGH" as const,state:"TRIAGED" as const,privacy:"RESTRICTED" as const};
 return {queue:"MEMBER_SUPPORT",priority:"NORMAL" as const,state:"TRIAGED" as const,privacy:"STANDARD" as const};
}
export class SupportIntakeRuntime {
 private readonly seen=new Map<string,SupportCase>(); readonly cases:SupportCase[]=[]; readonly externalCalls=0;
 intake(input:SupportIntake):SupportCase {
  const prior=this.seen.get(input.idempotencyKey); if(prior)return structuredClone(prior);
  const route=routeSupport(input.category);
  const highRisk=["ACCOUNT_ACCESS","CANCELLATION_REQUEST","REFUND_REQUEST","PRIVACY_REQUEST","LULU_FULFILLMENT"].includes(input.category);
  const blocked=input.expectedVersion!==input.currentVersion || (highRisk&&input.verification==="UNVERIFIED");
  const ackAllowed=input.environment!=="PRODUCTION"&&input.communicationAllowed&&!input.suppressed;
  const result:SupportCase={id:input.id,memberReference:input.memberId,channel:input.channel,category:input.category,
   priority:route.priority,state:blocked?"BLOCKED":route.state,queue:route.queue,privacy:route.privacy,
   safety:input.category==="SAFETY_CONCERN"?"URGENT_REVIEW":"STANDARD",minimizedSummary:minimizeSupportText(input.message),
   dueAt:new Date(Date.parse(input.receivedAt)+(route.priority==="URGENT"?15:route.priority==="HIGH"?240:1440)*60000).toISOString(),
   immutableEventReference:`support-event:${input.id}:1`,auditReference:`audit:support:${input.id}`,
   outboxReference:ackAllowed&&!blocked?`outbox:support-ack:${input.id}`:undefined,externalCalls:0,productionMutations:0};
  this.seen.set(input.idempotencyKey,result);this.cases.push(result);return structuredClone(result);
 }
}

export interface KnowledgeArticle {id:string;locale:string;version:number;owner:string;reviewAt:string;evidenceReferences:readonly string[];approved:boolean;memberWording:string;operatorGuidance:string;prohibitedDisclosures:readonly string[]}
export interface SupportDraft {caseId:string;articleId:string;articleVersion:number;body:string;status:"DRAFT";unknown:boolean;requiresHumanApproval:true;canSend:false;canClose:false;externalCalls:0}
export function draftSupportReply(caseId:string, article:KnowledgeArticle, facts:Readonly<Record<string,string>>):SupportDraft {
 const missing=!article.approved||article.evidenceReferences.length===0;
 return {caseId,articleId:article.id,articleVersion:article.version,body:missing?"UNKNOWN — authoritative support information is unavailable.":`${article.memberWording} ${Object.values(facts).map(minimizeSupportText).join(" ")}`.trim(),status:"DRAFT",unknown:missing,requiresHumanApproval:true,canSend:false,canClose:false,externalCalls:0};
}

export type HighRiskAction="CANCEL_MEMBERSHIP"|"ISSUE_REFUND"|"CHANGE_ORDER"|"PRIVACY_EXPORT"|"PRIVACY_DELETE";
export function requestHighRiskAction(action:HighRiskAction,verification:VerificationState){
 return {action,status:verification==="UNVERIFIED"?"BLOCKED" as const:"AWAITING_FOUNDER_APPROVAL" as const,executed:false,providerCalls:0,evidenceRequired:true};
}
export function privacyRequestStatus(input:{verified:boolean;legalHold:boolean;systemEvidence:readonly string[];requiredSystems:number}){
 return {status:!input.verified?"IDENTITY_REQUIRED":input.legalHold?"LEGAL_HOLD":input.systemEvidence.length<input.requiredSystems?"EVIDENCE_INCOMPLETE":"READY_FOR_HUMAN_CONFIRMATION",completed:false};
}
