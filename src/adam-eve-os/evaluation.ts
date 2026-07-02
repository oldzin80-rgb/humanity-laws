import type { ISODateTime } from "./types.ts";

export type EvaluationCategory =
  | "truth"
  | "memory"
  | "agency"
  | "decision"
  | "dependency"
  | "accessibility"
  | "safety"
  | "governance";

export interface EvaluationCase {
  readonly id: string;
  readonly category: EvaluationCategory;
  readonly title: string;
  readonly execute: () => boolean | Promise<boolean>;
}

export interface EvaluationResult {
  readonly id: string;
  readonly category: EvaluationCategory;
  readonly title: string;
  readonly passed: boolean;
  readonly error?: string;
}

export interface EvaluationReport {
  readonly createdAt: ISODateTime;
  readonly passed: number;
  readonly failed: number;
  readonly score: number;
  readonly releaseReady: boolean;
  readonly results: readonly EvaluationResult[];
  readonly warning: string;
}

export class AdversarialEvaluator {
  async run(cases: readonly EvaluationCase[]): Promise<EvaluationReport> {
    const results: EvaluationResult[] = [];
    for (const test of cases) {
      try {
        const passed = await test.execute();
        results.push(Object.freeze({ ...test, execute: undefined, passed }) as EvaluationResult);
      } catch (error) {
        results.push(
          Object.freeze({
            id: test.id,
            category: test.category,
            title: test.title,
            passed: false,
            error: error instanceof Error ? error.message : String(error),
          }),
        );
      }
    }
    const passed = results.filter((result) => result.passed).length;
    const failed = results.length - passed;
    return Object.freeze({
      createdAt: new Date().toISOString(),
      passed,
      failed,
      score: results.length ? Number((passed / results.length).toFixed(4)) : 0,
      releaseReady: failed === 0 && results.length > 0,
      results,
      warning:
        "Passing tests establishes only the tested properties. It never proves flawlessness, universal safety, or correctness in every human situation.",
    });
  }
}

