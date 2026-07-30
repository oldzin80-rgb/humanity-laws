import assert from"node:assert/strict";import test from"node:test";
import{buildExecutiveSnapshot,detectAnomaly,forecastTrend,recommend,recordFounderDecision,type KpiObservation,type ScorecardDefinition}from"../src/provider-command-center/index.js";
const definition:ScorecardDefinition={id:"founder-scorecard",version:1,name:"Launch",founderId:"founder",active:true,metrics:[
 {domain:"MEMBERSHIP",metric:"active_members",weight:2,target:100,higherIsBetter:true},
 {domain:"INFRASTRUCTURE",metric:"error_rate",weight:1,target:1,higherIsBetter:false},
 {domain:"PROVIDERS",metric:"verified_count",weight:1,target:6,higherIsBetter:true},
]};
const observation=(patch:Partial<KpiObservation>):KpiObservation=>({id:"o",domain:"MEMBERSHIP",metric:"active_members",value:80,unit:"count",observedAt:"2026-07-30T00:00:00Z",evidenceState:"VERIFIED",evidenceReferences:["evidence:1"],sourceSystem:"canonical",...patch});
test("scorecard combines canonical evidence deterministically",()=>{const s=buildExecutiveSnapshot(definition,[observation({}),observation({id:"e",domain:"INFRASTRUCTURE",metric:"error_rate",value:.5}),observation({id:"p",domain:"PROVIDERS",metric:"verified_count",value:6})],"2026-07-30T12:00:00Z");assert.equal(s.readinessScore,90);assert.equal(s.advisoryOnly,true)});
test("launchReady remains false regardless of score",()=>{const obs=definition.metrics.map((m,i)=>observation({id:String(i),domain:m.domain,metric:m.metric,value:m.higherIsBetter?m.target:0}));assert.equal(buildExecutiveSnapshot(definition,obs,"2026-07-30T12:00:00Z").launchReady,false)});
test("missing evidence is unverified and blocks",()=>{const s=buildExecutiveSnapshot(definition,[],"2026-07-30T12:00:00Z");assert.equal(s.results[0]?.status,"UNVERIFIED");assert.ok(s.blockers.length>0)});
test("conflicting evidence blocks rather than averaging",()=>{const s=buildExecutiveSnapshot(definition,[observation({evidenceState:"CONFLICTING"})],"2026-07-30T12:00:00Z");assert.equal(s.results[0]?.status,"BLOCKED")});
test("stale evidence is capped and visible",()=>{const s=buildExecutiveSnapshot(definition,[observation({observedAt:"2026-01-01T00:00:00Z"})],"2026-07-30T12:00:00Z");assert.equal(s.results[0]?.status,"WATCH");assert.ok((s.results[0]?.score??100)<=50)});
test("forecast is bounded and states evidence count",()=>{const f=forecastTrend("members",[10,20,30],1);assert.equal(f.predicted,40);assert.equal(f.sourceCount,3);assert.equal(f.confidence,"MEDIUM")});
test("insufficient forecast evidence is low confidence",()=>assert.equal(forecastTrend("revenue",[10],1).confidence,"LOW"));
test("anomaly detection requires history",()=>assert.equal(detectAnomaly("cost",100,[100],["e"]),undefined));
test("material anomaly is evidence-backed",()=>{const a=detectAnomaly("cost",300,[100,100,100],["evidence:cost"]);assert.equal(a?.severity,"CRITICAL");assert.deepEqual(a?.evidenceReferences,["evidence:cost"])});
test("recommendations are advisory and never execute",()=>{const r=recommend({id:"r",title:"Investigate",rationale:"Evidence changed",evidenceReferences:["e"],confidence:.8,risk:"LOW",expiresAt:"2026-08-01"});assert.equal(r.automaticActions,0);assert.equal(r.requiresFounderDecision,true)});
test("Founder decisions are immutable records with zero external actions",()=>{const d=recordFounderDecision({id:"d",founderId:"founder",recommendationId:"r",decision:"DEFERRED",reason:"Need current evidence",expectedVersion:1,recordedAt:"2026-07-30"});assert.equal(d.externalActions,0);assert.equal(d.immutable,true)});
test("decision requires founder and reason",()=>assert.throws(()=>recordFounderDecision({id:"d",founderId:"",recommendationId:"r",decision:"DECLINED",reason:"",expectedVersion:1,recordedAt:"x"}),/FOUNDER/));
