export type ISODateTime = string;
export type Identifier = string;
export type Domain =
  | "identity"
  | "relationships"
  | "health"
  | "mind"
  | "spirit"
  | "learning"
  | "work"
  | "money"
  | "home"
  | "community"
  | "creativity"
  | "future";

export interface Clock {
  now(): Date;
}

export interface IdFactory {
  create(prefix?: string): Identifier;
}

export interface SystemDependencies {
  readonly clock: Clock;
  readonly ids: IdFactory;
}

export const systemClock: Clock = Object.freeze({ now: () => new Date() });

export const randomIds: IdFactory = Object.freeze({
  create: (prefix = "ae") =>
    `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
});

export const defaultDependencies: SystemDependencies = Object.freeze({
  clock: systemClock,
  ids: randomIds,
});

export const clamp = (value: number, min = 0, max = 1): number =>
  Math.min(max, Math.max(min, value));

export const freeze = <T>(value: T): Readonly<T> => Object.freeze(value);

