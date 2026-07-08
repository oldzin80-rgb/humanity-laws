export type PerformanceBudgetKey =
  | "initial_load"
  | "route_transition"
  | "dashboard_render"
  | "checkout_entry"
  | "membership_status_check"
  | "spark_start"
  | "podcast_page"
  | "wellness_page"
  | "community_page"
  | "social_command_center"
  | "static_asset_size";

export type PerformanceTelemetryMetric =
  | "load_time"
  | "route_transition_time"
  | "checkout_start_time"
  | "sign_in_completion_time"
  | "interaction_response_time"
  | "static_build_size"
  | "slow_room_warning";

export interface SpeedBudget {
  key: PerformanceBudgetKey;
  target: string;
  launchCritical: boolean;
}

export interface FastCheckInStandard {
  signInEntryOptimized: true;
  memberStatusLookupLightweight: true;
  dashboardArrivalFast: true;
  savedSessionHandling: true;
  readableLoadingStates: true;
  gracefulErrorFallbacks: true;
}

export interface FastCheckoutStandard {
  planSelectionResponsive: true;
  stripeHandoffReady: true;
  checkoutButtonFast: true;
  membershipReturnStateClear: true;
  noDuplicateWaits: true;
  noUnnecessaryNetworkCalls: true;
}

export interface TransitionSpeedStandard {
  pageToPageRoutingLightweight: true;
  preloadCoreRoutes: readonly string[];
  lightweightSharedComponents: true;
  noBlockingAnimations: true;
  reducedMotionFallback: true;
  instantNextStepRendering: true;
}

export interface WholeAppPerformanceAudit {
  detects: readonly ["heavy_components", "duplicate_imports", "unnecessary_renders", "oversized_static_files", "blocking_synchronous_work", "repeated_calculations", "redundant_experience_hydration"];
  gracefulFallbackOverDelay: true;
}

export interface PerformanceTelemetryModel {
  metrics: readonly PerformanceTelemetryMetric[];
  placeholderOnlyUntilMonitoringConfigured: true;
  noPrivateContent: true;
}

export interface PerformanceGuardianRules {
  rules: readonly ["no_unnecessary_fake_loading_screens", "no_mobile_slow_decorative_effects", "no_unbounded_client_work", "no_duplicated_page_logic", "no_blocking_adam_eve_events", "no_blocking_placeholders", "graceful_fallback_over_delay"];
  speedIsPermanentLaunchRequirement: true;
}

export interface MobileSpeedFirstStandard {
  iPhonePerformancePriority: true;
  fastTapResponse: true;
  compressedStaticAssets: true;
  minimalLayoutShift: true;
  readableLoadingStates: true;
  smoothButLightAnimation: true;
}

export interface ContinuousSpeedChecks {
  routesRenderQuickly: true;
  staticFileCountReasonable: true;
  criticalPagesExposeLightweightInitialState: true;
  launchReadyRequiresFullLaunchReview: true;
}

export interface PerformanceSpeedGuardian {
  name: "Performance & Speed Guardian";
  purpose: string;
  budgets: readonly SpeedBudget[];
  fastCheckIn: FastCheckInStandard;
  fastCheckout: FastCheckoutStandard;
  transitionSpeed: TransitionSpeedStandard;
  wholeAppAudit: WholeAppPerformanceAudit;
  telemetry: PerformanceTelemetryModel;
  guardianRules: PerformanceGuardianRules;
  mobileSpeedFirst: MobileSpeedFirstStandard;
  continuousSpeedChecks: ContinuousSpeedChecks;
  launchReady: false;
}

export const DefaultSpeedBudgets: readonly SpeedBudget[] = [
  { key: "initial_load", target: "render static shell before integrations", launchCritical: true },
  { key: "route_transition", target: "next step visible immediately", launchCritical: true },
  { key: "dashboard_render", target: "lightweight member hub first", launchCritical: true },
  { key: "checkout_entry", target: "checkout button responds without duplicate waits", launchCritical: true },
  { key: "membership_status_check", target: "single clear membership lookup", launchCritical: true },
  { key: "spark_start", target: "preparing state appears immediately", launchCritical: true },
  { key: "podcast_page", target: "listening room renders without live media dependency", launchCritical: false },
  { key: "wellness_page", target: "manual wellness foundation renders without provider dependency", launchCritical: false },
  { key: "community_page", target: "honest placeholder renders without fake feed dependency", launchCritical: false },
  { key: "social_command_center", target: "admin command center renders without vendor calls", launchCritical: false },
  { key: "static_asset_size", target: "static export remains small enough for staging review", launchCritical: true },
];

export function createPerformanceSpeedGuardian(): PerformanceSpeedGuardian {
  return {
    name: "Performance & Speed Guardian",
    purpose: "Protect speed across check-in, checkout, transitions, routing, pages, static build, mobile experience, and future integrations.",
    budgets: DefaultSpeedBudgets,
    fastCheckIn: {
      signInEntryOptimized: true,
      memberStatusLookupLightweight: true,
      dashboardArrivalFast: true,
      savedSessionHandling: true,
      readableLoadingStates: true,
      gracefulErrorFallbacks: true,
    },
    fastCheckout: {
      planSelectionResponsive: true,
      stripeHandoffReady: true,
      checkoutButtonFast: true,
      membershipReturnStateClear: true,
      noDuplicateWaits: true,
      noUnnecessaryNetworkCalls: true,
    },
    transitionSpeed: {
      pageToPageRoutingLightweight: true,
      preloadCoreRoutes: ["/", "/dashboard", "/spark", "/book", "/membership", "/checkout/monthly"],
      lightweightSharedComponents: true,
      noBlockingAnimations: true,
      reducedMotionFallback: true,
      instantNextStepRendering: true,
    },
    wholeAppAudit: {
      detects: ["heavy_components", "duplicate_imports", "unnecessary_renders", "oversized_static_files", "blocking_synchronous_work", "repeated_calculations", "redundant_experience_hydration"],
      gracefulFallbackOverDelay: true,
    },
    telemetry: {
      metrics: ["load_time", "route_transition_time", "checkout_start_time", "sign_in_completion_time", "interaction_response_time", "static_build_size", "slow_room_warning"],
      placeholderOnlyUntilMonitoringConfigured: true,
      noPrivateContent: true,
    },
    guardianRules: {
      rules: ["no_unnecessary_fake_loading_screens", "no_mobile_slow_decorative_effects", "no_unbounded_client_work", "no_duplicated_page_logic", "no_blocking_adam_eve_events", "no_blocking_placeholders", "graceful_fallback_over_delay"],
      speedIsPermanentLaunchRequirement: true,
    },
    mobileSpeedFirst: {
      iPhonePerformancePriority: true,
      fastTapResponse: true,
      compressedStaticAssets: true,
      minimalLayoutShift: true,
      readableLoadingStates: true,
      smoothButLightAnimation: true,
    },
    continuousSpeedChecks: {
      routesRenderQuickly: true,
      staticFileCountReasonable: true,
      criticalPagesExposeLightweightInitialState: true,
      launchReadyRequiresFullLaunchReview: true,
    },
    launchReady: false,
  };
}
