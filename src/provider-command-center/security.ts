const secretKeyPattern = /(secret|token|password|api[_-]?key|authorization|service[_-]?role|signature)/i;
const secretValuePatterns = [
  /\bsk_(?:live|test)_[A-Za-z0-9]{12,}\b/g,
  /\bSG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  /\bAC[a-fA-F0-9]{32}\b/g,
  /\b[A-Za-z0-9_-]{32,}\b/g,
] as const;
const embeddedAssignmentPattern =
  /((?:secret|token|password|api[_-]?key|authorization|service[_-]?role|signature)[A-Z0-9_-]*\s*[:=]\s*)[^\s,;]+/gi;

export function redactSecrets(value: unknown): unknown {
  if (typeof value === "string") {
    const assignmentsRedacted = value.replace(embeddedAssignmentPattern, "$1[REDACTED]");
    return secretValuePatterns.reduce((safe, pattern) => safe.replace(pattern, "[REDACTED]"), assignmentsRedacted);
  }
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [
      key,
      secretKeyPattern.test(key) ? "[REDACTED]" : redactSecrets(item),
    ]));
  }
  return value;
}

export function assertNoRawSecret(value: unknown): void {
  const serialized = JSON.stringify(redactSecrets(value));
  if (secretValuePatterns.some(pattern => {
    pattern.lastIndex = 0;
    return pattern.test(serialized);
  })) throw new Error("Secret-like value escaped central redaction.");
}

export function isFounder(actor: {id: string; roles: readonly string[]}): boolean {
  return Boolean(actor.id.trim()) && actor.roles.includes("FOUNDER");
}
