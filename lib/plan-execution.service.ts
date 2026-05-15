export const VALID_REMAINING_STATUSES = ['pending', 'ready', 'running'] as const;

export type RemainingStatus = (typeof VALID_REMAINING_STATUSES)[number];

export interface PlanStep {
  id: string;
  status: RemainingStatus | 'completed' | 'failed' | 'skipped' | 'blocked';
  dependsOn: string[];
}

const LOG_PREFIX = '[PlanExecution]';

function logWarn(message: string, ...args: unknown[]): void {
  console.warn(`${LOG_PREFIX} ${message}`, ...args);
}

function logInfo(message: string, ...args: unknown[]): void {
  console.log(`${LOG_PREFIX} ${message}`, ...args);
}

function hasRemainingStatus(status: string): status is RemainingStatus {
  return (VALID_REMAINING_STATUSES as readonly string[]).includes(status);
}

export function getRemainingDependents<T extends { id: string; status: string; dependsOn: string[] }>(
  completedStepId: string,
  steps: T[],
): T[] {
  if (!steps.length) {
    logWarn('getRemainingDependents called with empty steps array');
    return [];
  }

  const completedStep = steps.find((s) => s.id === completedStepId);
  if (!completedStep) {
    logWarn(`completedStepId "${completedStepId}" not found in steps`);
    return [];
  }

  const dependentsMap = buildDependentsMap(steps);

  const visited = new Set<string>();
  const queue: string[] = [completedStepId];
  const remaining: T[] = [];

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const directDependents = dependentsMap.get(currentId);
    if (!directDependents) continue;

    for (const dependent of directDependents) {
      if (visited.has(dependent.id)) continue;

      if (hasRemainingStatus(dependent.status)) {
        remaining.push(dependent);
      }

      queue.push(dependent.id);
    }
  }

  logInfo(`Found ${remaining.length} remaining dependent(s) for step "${completedStepId}"`);
  return remaining;
}

export function buildDependentsMap<T extends { id: string; dependsOn: string[] }>(steps: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const step of steps) {
    for (const depId of step.dependsOn) {
      if (!map.has(depId)) {
        map.set(depId, []);
      }
      map.get(depId)!.push(step);
    }
  }
  return map;
}
