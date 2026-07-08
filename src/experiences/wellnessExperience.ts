export type WellnessModuleId =
  | "wellness_dashboard"
  | "movement"
  | "nutrition"
  | "sleep_and_recovery"
  | "mind_and_reflection"
  | "purpose_and_growth"
  | "human_os_integration"
  | "safety_and_boundaries"
  | "future_expansion_hooks"
  | "adam_eve_support";

export type MovementPractice =
  | "walking"
  | "strength"
  | "mobility"
  | "stretching"
  | "yoga"
  | "recovery";

export type NutritionPractice =
  | "recipes"
  | "meal_planning"
  | "grocery_lists"
  | "hydration"
  | "healthy_substitutions"
  | "nutrition_education";

export type SleepRecoveryPractice =
  | "wind_down_routine"
  | "sleep_habits"
  | "rest_reflections"
  | "recovery_reminders";

export type MindReflectionPractice =
  | "journaling"
  | "gratitude"
  | "breathing_exercises"
  | "stress_reduction"
  | "guided_reflection";

export type PurposeGrowthPractice =
  | "daily_intention"
  | "service"
  | "stewardship"
  | "personal_goals"
  | "habit_building";

export type WellnessIntegration =
  | "spark"
  | "adam_eve"
  | "the_table"
  | "podcast"
  | "founder_letters"
  | "community"
  | "humanity_laws_book_themes"
  | "experience_orchestrator";

export type WellnessFutureHook =
  | "wearable_integrations"
  | "fitness_trackers"
  | "health_data_with_explicit_consent"
  | "family_wellness"
  | "group_challenges"
  | "preventive_education"
  | "longevity_education"
  | "human_os_research";

export interface WellnessModule {
  id: WellnessModuleId;
  title: string;
  purpose: string;
  status: "manual_ready" | "educational_only" | "future_provider_required";
  medicalBoundaryRequired: true;
}

export interface WellnessDashboardModel {
  dailyCheckIn: true;
  todaysWellnessFocus: true;
  weeklyReflection: true;
  habitStreaks: "gentle_optional_not_pressure";
  progressSummary: "member_owned";
}

export interface WellnessSafetyBoundaries {
  noDiagnosis: true;
  noPrescription: true;
  noEmergencyHandlingBeyondReferral: true;
  noMedicalReplacement: true;
  noMedicalClaims: true;
  noShameBasedLanguage: true;
  noCoerciveHabitPressure: true;
  userChoiceFirst: true;
  accessibilityAndDifferentAbilityLevelsRespected: true;
  emergencyGuidance: "If a member may be in danger or needs urgent help, recommend appropriate emergency or qualified professional help.";
}

export interface AdamEveWellnessSupport {
  may: readonly ["encourage", "explain", "help_reflect", "help_build_routines", "suggest_gentle_next_steps"];
  mustNever: readonly ["diagnose", "prescribe", "claim_medical_authority", "override_user_choice", "shame_or_pressure_member"];
  aiTransparencyRequired: true;
  qualifiedCareEncouragedWhenAppropriate: true;
}

export interface HumanOSWellnessPlatform {
  name: "Human OS Wellness Platform";
  purpose: string;
  educationalSupportOnly: true;
  modules: readonly WellnessModule[];
  dashboard: WellnessDashboardModel;
  movement: readonly MovementPractice[];
  nutrition: readonly NutritionPractice[];
  sleepRecovery: readonly SleepRecoveryPractice[];
  mindReflection: readonly MindReflectionPractice[];
  purposeGrowth: readonly PurposeGrowthPractice[];
  integrations: readonly WellnessIntegration[];
  safety: WellnessSafetyBoundaries;
  futureHooks: readonly WellnessFutureHook[];
  adamEveSupport: AdamEveWellnessSupport;
  launchReady: false;
}

export const WellnessModules: readonly WellnessModule[] = [
  { id: "wellness_dashboard", title: "Wellness Dashboard", purpose: "Daily check-in, today's focus, weekly reflection, gentle habit streaks, and member-owned progress summary.", status: "manual_ready", medicalBoundaryRequired: true },
  { id: "movement", title: "Movement", purpose: "Walking, strength, mobility, stretching, yoga, and recovery as educational options.", status: "educational_only", medicalBoundaryRequired: true },
  { id: "nutrition", title: "Nutrition", purpose: "Recipes, meal planning, grocery lists, hydration, healthy substitutions, and nutrition education.", status: "educational_only", medicalBoundaryRequired: true },
  { id: "sleep_and_recovery", title: "Sleep & Recovery", purpose: "Wind-down routines, sleep habits, rest reflections, and recovery reminders.", status: "educational_only", medicalBoundaryRequired: true },
  { id: "mind_and_reflection", title: "Mind & Reflection", purpose: "Journaling, gratitude, breathing exercises, stress reduction, and guided reflection.", status: "educational_only", medicalBoundaryRequired: true },
  { id: "purpose_and_growth", title: "Purpose & Growth", purpose: "Daily intention, service, stewardship, personal goals, and habit building.", status: "manual_ready", medicalBoundaryRequired: true },
  { id: "human_os_integration", title: "Human OS Integration", purpose: "Connect Wellness naturally to Spark, Adam and Eve, The Table, Podcast, Founder Letters, Community, book themes, and Experience Orchestrator.", status: "manual_ready", medicalBoundaryRequired: true },
  { id: "safety_and_boundaries", title: "Safety & Boundaries", purpose: "Keep wellness educational and supportive only; never diagnose, prescribe, replace care, shame, or coerce.", status: "manual_ready", medicalBoundaryRequired: true },
  { id: "future_expansion_hooks", title: "Future Expansion Hooks", purpose: "Prepare consent-gated hooks for wearables, trackers, health data, family wellness, group challenges, education, longevity, and research.", status: "future_provider_required", medicalBoundaryRequired: true },
  { id: "adam_eve_support", title: "Adam & Eve Support", purpose: "Encourage, explain, reflect, build routines, and suggest gentle next steps without medical authority.", status: "manual_ready", medicalBoundaryRequired: true },
];

export function createHumanOSWellnessPlatform(): HumanOSWellnessPlatform {
  return {
    name: "Human OS Wellness Platform",
    purpose: "Create a launch-safe Wellness / Human OS experience that helps members build sustainable habits for physical, mental, emotional, relational, and purpose-driven flourishing.",
    educationalSupportOnly: true,
    modules: WellnessModules,
    dashboard: {
      dailyCheckIn: true,
      todaysWellnessFocus: true,
      weeklyReflection: true,
      habitStreaks: "gentle_optional_not_pressure",
      progressSummary: "member_owned",
    },
    movement: ["walking", "strength", "mobility", "stretching", "yoga", "recovery"],
    nutrition: ["recipes", "meal_planning", "grocery_lists", "hydration", "healthy_substitutions", "nutrition_education"],
    sleepRecovery: ["wind_down_routine", "sleep_habits", "rest_reflections", "recovery_reminders"],
    mindReflection: ["journaling", "gratitude", "breathing_exercises", "stress_reduction", "guided_reflection"],
    purposeGrowth: ["daily_intention", "service", "stewardship", "personal_goals", "habit_building"],
    integrations: ["spark", "adam_eve", "the_table", "podcast", "founder_letters", "community", "humanity_laws_book_themes", "experience_orchestrator"],
    safety: {
      noDiagnosis: true,
      noPrescription: true,
      noEmergencyHandlingBeyondReferral: true,
      noMedicalReplacement: true,
      noMedicalClaims: true,
      noShameBasedLanguage: true,
      noCoerciveHabitPressure: true,
      userChoiceFirst: true,
      accessibilityAndDifferentAbilityLevelsRespected: true,
      emergencyGuidance: "If a member may be in danger or needs urgent help, recommend appropriate emergency or qualified professional help.",
    },
    futureHooks: ["wearable_integrations", "fitness_trackers", "health_data_with_explicit_consent", "family_wellness", "group_challenges", "preventive_education", "longevity_education", "human_os_research"],
    adamEveSupport: {
      may: ["encourage", "explain", "help_reflect", "help_build_routines", "suggest_gentle_next_steps"],
      mustNever: ["diagnose", "prescribe", "claim_medical_authority", "override_user_choice", "shame_or_pressure_member"],
      aiTransparencyRequired: true,
      qualifiedCareEncouragedWhenAppropriate: true,
    },
    launchReady: false,
  };
}
