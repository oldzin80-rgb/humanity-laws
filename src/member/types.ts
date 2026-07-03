export type MemberRole = "MEMBER" | "FOUNDER" | "ADMIN";
export type MembershipStatus = "FREE" | "ACTIVE" | "PAST_DUE" | "CANCELLED";
export type SubscriptionPlanId = "MONTHLY_7" | "YEARLY_70";
export type CommercePlanId = SubscriptionPlanId | "DIGITAL_BOOK";
export interface MemberProfile { memberId: string; email: string; displayName: string; roles: MemberRole[]; membershipStatus: MembershipStatus; createdAt: string; updatedAt: string }
export interface AuthSession { sessionId: string; memberId: string; authenticated: boolean; roles: MemberRole[]; createdAt: string; expiresAt: string }
export interface MemberSubscription { subscriptionId: string; memberId: string; planId: SubscriptionPlanId; status: MembershipStatus; providerSubscriptionId?: string; createdAt: string; updatedAt: string }
