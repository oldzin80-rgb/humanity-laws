import test from "node:test";
import assert from "node:assert/strict";
import { createHumanOSWellnessPlatform } from "../src/experiences/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";

test("Human OS Wellness Platform includes all major modules", () => {
  const platform = createHumanOSWellnessPlatform();
  const moduleIds = platform.modules.map((module) => module.id);

  assert.equal(platform.name, "Human OS Wellness Platform");
  assert.equal(platform.educationalSupportOnly, true);
  for (const expected of [
    "wellness_dashboard",
    "movement",
    "nutrition",
    "sleep_and_recovery",
    "mind_and_reflection",
    "purpose_and_growth",
    "human_os_integration",
    "safety_and_boundaries",
    "future_expansion_hooks",
    "adam_eve_support",
  ]) {
    assert.ok(moduleIds.includes(expected as never), `Missing ${expected}`);
  }
  assert.ok(platform.modules.every((module) => module.medicalBoundaryRequired === true));
});

test("Wellness Dashboard supports check-ins, focus, reflection, gentle streaks, and member-owned progress", () => {
  const dashboard = createHumanOSWellnessPlatform().dashboard;

  assert.equal(dashboard.dailyCheckIn, true);
  assert.equal(dashboard.todaysWellnessFocus, true);
  assert.equal(dashboard.weeklyReflection, true);
  assert.equal(dashboard.habitStreaks, "gentle_optional_not_pressure");
  assert.equal(dashboard.progressSummary, "member_owned");
});

test("Wellness modules include movement, nutrition, sleep, mind, and purpose practices", () => {
  const platform = createHumanOSWellnessPlatform();

  assert.deepEqual(platform.movement, ["walking", "strength", "mobility", "stretching", "yoga", "recovery"]);
  assert.deepEqual(platform.nutrition, ["recipes", "meal_planning", "grocery_lists", "hydration", "healthy_substitutions", "nutrition_education"]);
  assert.deepEqual(platform.sleepRecovery, ["wind_down_routine", "sleep_habits", "rest_reflections", "recovery_reminders"]);
  assert.deepEqual(platform.mindReflection, ["journaling", "gratitude", "breathing_exercises", "stress_reduction", "guided_reflection"]);
  assert.deepEqual(platform.purposeGrowth, ["daily_intention", "service", "stewardship", "personal_goals", "habit_building"]);
});

test("Safety boundaries prevent diagnosis, prescriptions, medical replacement, claims, shame, and coercion", () => {
  const safety = createHumanOSWellnessPlatform().safety;

  assert.equal(safety.noDiagnosis, true);
  assert.equal(safety.noPrescription, true);
  assert.equal(safety.noEmergencyHandlingBeyondReferral, true);
  assert.equal(safety.noMedicalReplacement, true);
  assert.equal(safety.noMedicalClaims, true);
  assert.equal(safety.noShameBasedLanguage, true);
  assert.equal(safety.noCoerciveHabitPressure, true);
  assert.equal(safety.userChoiceFirst, true);
  assert.equal(safety.accessibilityAndDifferentAbilityLevelsRespected, true);
  assert.match(safety.emergencyGuidance, /emergency or qualified professional help/);
});

test("Human OS Integration connects Wellness to the rest of the ecosystem", () => {
  const integrations = createHumanOSWellnessPlatform().integrations;

  assert.deepEqual(integrations, ["spark", "adam_eve", "the_table", "podcast", "founder_letters", "community", "humanity_laws_book_themes", "experience_orchestrator"]);
});

test("Future wellness hooks are placeholders requiring consent and provider review", () => {
  const hooks = createHumanOSWellnessPlatform().futureHooks;

  assert.deepEqual(hooks, ["wearable_integrations", "fitness_trackers", "health_data_with_explicit_consent", "family_wellness", "group_challenges", "preventive_education", "longevity_education", "human_os_research"]);
});

test("Adam and Eve wellness support is encouraging but never medical authority", () => {
  const support = createHumanOSWellnessPlatform().adamEveSupport;

  assert.deepEqual(support.may, ["encourage", "explain", "help_reflect", "help_build_routines", "suggest_gentle_next_steps"]);
  assert.deepEqual(support.mustNever, ["diagnose", "prescribe", "claim_medical_authority", "override_user_choice", "shame_or_pressure_member"]);
  assert.equal(support.aiTransparencyRequired, true);
  assert.equal(support.qualifiedCareEncouragedWhenAppropriate, true);
});

test("Wellness page renders Human OS platform and medical boundaries clearly", () => {
  const page = routePage("/wellness");
  const html = renderPageModelToHtml(page);

  assert.equal(page.title, "Human OS Wellness");
  assert.match(html, /Daily check-in\. One focus\. Gentle progress\./);
  assert.match(html, /Educational support only/);
  assert.match(html, /does not diagnose, prescribe treatment, replace a qualified professional, or make medical claims/);
  assert.match(html, /Movement, nutrition, sleep, and recovery/);
  assert.match(html, /Reflection without pressure/);
  assert.match(html, /Daily intention and stewardship/);
  assert.match(html, /Health data requires explicit consent/);
  assert.match(html, /Encouragement, not medical authority/);
  assert.doesNotMatch(html, /I can diagnose|I will prescribe|guaranteed health|medical authority over/i);
});

test("Human OS Wellness Platform does not change launchReady", () => {
  const platform = createHumanOSWellnessPlatform();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(platform.launchReady, false);
  assert.equal(report.launchReady, false);
});
