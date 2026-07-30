export type ExecutiveDomain="LAUNCH"|"MEMBERSHIP"|"FINANCE"|"MARKETING"|"SUPPORT"|"INFRASTRUCTURE"|"PROVIDERS"|"AI"|"PRODUCT";
export type EvidenceState="VERIFIED"|"STALE"|"MISSING"|"CONFLICTING";
export interface KpiObservation{id:string;domain:ExecutiveDomain;metric:string;value:number;unit:string;observedAt:string;evidenceState:EvidenceState;evidenceReferences:readonly string[];sourceSystem:string}
export interface ScorecardDefinition{id:string;version:number;name:string;metrics:readonly {domain:ExecutiveDomain;metric:string;weight:number;target:number;higherIsBetter:boolean}[];founderId:string;active:boolean}
export interface KpiResult{domain:ExecutiveDomain;metric:string;score:number;value?:number;status:"HEALTHY"|"WATCH"|"BLOCKED"|"UNVERIFIED";evidenceReferences:readonly string[]}
export interface ExecutiveSnapshot{scorecardId:string;scorecardVersion:number;readinessScore:number;launchReady:false;results:readonly KpiResult[];blockers:readonly string[];generatedAt:string;advisoryOnly:true}

export function buildExecutiveSnapshot(definition:ScorecardDefinition,observations:readonly KpiObservation[],now:string):ExecutiveSnapshot{
 const results=definition.metrics.map(metric=>{
  const candidates=observations.filter(o=>o.domain===metric.domain&&o.metric===metric.metric).sort((a,b)=>Date.parse(b.observedAt)-Date.parse(a.observedAt));
  const current=candidates[0];
  if(!current||current.evidenceState==="MISSING")return{domain:metric.domain,metric:metric.metric,score:0,status:"UNVERIFIED" as const,evidenceReferences:[]};
  if(current.evidenceState==="CONFLICTING")return{domain:metric.domain,metric:metric.metric,score:0,status:"BLOCKED" as const,value:current.value,evidenceReferences:current.evidenceReferences};
  const stale=current.evidenceState==="STALE"||Date.parse(now)-Date.parse(current.observedAt)>7*86400000;
  const ratio=metric.higherIsBetter?current.value/metric.target:metric.target/Math.max(current.value,0.0001);
  const score=Math.max(0,Math.min(100,Math.round(ratio*100)));
  return{domain:metric.domain,metric:metric.metric,score:stale?Math.min(score,50):score,status:stale?"WATCH" as const:score>=80?"HEALTHY" as const:score>=50?"WATCH" as const:"BLOCKED" as const,value:current.value,evidenceReferences:current.evidenceReferences};
 });
 const totalWeight=definition.metrics.reduce((s,m)=>s+m.weight,0)||1;
 const readinessScore=Math.round(results.reduce((sum,result,index)=>sum+result.score*definition.metrics[index]!.weight,0)/totalWeight);
 const blockers=results.filter(r=>r.status==="BLOCKED"||r.status==="UNVERIFIED").map(r=>`${r.domain}:${r.metric}:${r.status}`);
 return{scorecardId:definition.id,scorecardVersion:definition.version,readinessScore,launchReady:false,results,blockers,generatedAt:now,advisoryOnly:true};
}

export interface Forecast{metric:string;method:"LINEAR_TREND";horizonPeriods:number;predicted:number;lower:number;upper:number;confidence:"LOW"|"MEDIUM";sourceCount:number}
export function forecastTrend(metric:string,values:readonly number[],horizonPeriods=1):Forecast{
 if(values.length<3)return{metric,method:"LINEAR_TREND",horizonPeriods,predicted:values.at(-1)??0,lower:0,upper:values.at(-1)??0,confidence:"LOW",sourceCount:values.length};
 const slope=(values.at(-1)!-values[0]!)/(values.length-1);const predicted=values.at(-1)!+slope*horizonPeriods;
 const spread=Math.max(...values)-Math.min(...values);
 return{metric,method:"LINEAR_TREND",horizonPeriods,predicted,lower:predicted-spread,upper:predicted+spread,confidence:"MEDIUM",sourceCount:values.length};
}
export interface Anomaly{metric:string;severity:"INFO"|"WARNING"|"CRITICAL";observed:number;baseline:number;reason:string;evidenceReferences:readonly string[]}
export function detectAnomaly(metric:string,observed:number,history:readonly number[],evidenceReferences:readonly string[]):Anomaly|undefined{
 if(history.length<3)return undefined;const baseline=history.reduce((a,b)=>a+b,0)/history.length;const deviation=Math.abs(observed-baseline)/Math.max(Math.abs(baseline),1);
 if(deviation<.25)return undefined;return{metric,severity:deviation>=1?"CRITICAL":deviation>=.5?"WARNING":"INFO",observed,baseline,reason:"Observed value differs materially from the evidence-backed historical baseline.",evidenceReferences};
}
export interface StrategicRecommendation{id:string;title:string;rationale:string;evidenceReferences:readonly string[];confidence:number;risk:"LOW"|"MEDIUM"|"HIGH";expiresAt:string;advisoryOnly:true;automaticActions:0;requiresFounderDecision:true}
export function recommend(input:Omit<StrategicRecommendation,"advisoryOnly"|"automaticActions"|"requiresFounderDecision">):StrategicRecommendation{return{...input,advisoryOnly:true,automaticActions:0,requiresFounderDecision:true}}
export interface FounderDecision{id:string;founderId:string;recommendationId:string;decision:"ACCEPTED_FOR_PLANNING"|"DECLINED"|"DEFERRED";reason:string;expectedVersion:number;recordedAt:string;externalActions:0;immutable:true}
export function recordFounderDecision(input:Omit<FounderDecision,"externalActions"|"immutable">):FounderDecision{
 if(!input.founderId||!input.reason.trim())throw new Error("FOUNDER_AND_REASON_REQUIRED");return{...input,externalActions:0,immutable:true};
}
