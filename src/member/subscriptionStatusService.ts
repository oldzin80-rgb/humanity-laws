import type { MemberRepository } from "./memberService.js";
import { activateMember } from "./memberService.js";
export class SubscriptionStatusService { constructor(private readonly members: MemberRepository) {} async markActiveFromPayment(memberId: string) { return activateMember(this.members, memberId); } }
