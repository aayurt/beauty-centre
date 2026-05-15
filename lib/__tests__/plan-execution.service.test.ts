import { describe, it, expect } from 'vitest';
import { getRemainingDependents, buildDependentsMap } from '../plan-execution.service';

interface TestStep {
  id: string;
  status: string;
  dependsOn: string[];
}

function createStep(id: string, status: string, dependsOn: string[] = []): TestStep {
  return { id, status, dependsOn };
}

describe('getRemainingDependents', () => {
  it('returns empty array when steps array is empty', () => {
    const result = getRemainingDependents('step-1', []);
    expect(result).toEqual([]);
  });

  it('returns empty array when completedStepId is not found', () => {
    const steps = [createStep('step-1', 'completed')];
    const result = getRemainingDependents('non-existent', steps);
    expect(result).toEqual([]);
  });

  it('returns empty array when completed step has no dependents', () => {
    const steps = [createStep('step-1', 'completed')];
    const result = getRemainingDependents('step-1', steps);
    expect(result).toEqual([]);
  });

  it('finds direct pending dependent', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'pending', ['step-1']),
    ];
    const result = getRemainingDependents('step-1', steps);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('step-2');
  });

  it('finds direct ready dependent', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'ready', ['step-1']),
    ];
    const result = getRemainingDependents('step-1', steps);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('step-2');
  });

  it('finds direct running dependent', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'running', ['step-1']),
    ];
    const result = getRemainingDependents('step-1', steps);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('step-2');
  });

  it('excludes completed dependent', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'completed', ['step-1']),
    ];
    const result = getRemainingDependents('step-1', steps);
    expect(result).toEqual([]);
  });

  it('excludes failed dependent', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'failed', ['step-1']),
    ];
    const result = getRemainingDependents('step-1', steps);
    expect(result).toEqual([]);
  });

  it('excludes skipped dependent', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'skipped', ['step-1']),
    ];
    const result = getRemainingDependents('step-1', steps);
    expect(result).toEqual([]);
  });

  it('finds transitive dependents at arbitrary depth', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'pending', ['step-1']),
      createStep('step-3', 'pending', ['step-2']),
      createStep('step-4', 'pending', ['step-3']),
      createStep('step-5', 'pending', ['step-4']),
    ];
    const result = getRemainingDependents('step-1', steps);
    expect(result).toHaveLength(4);
    expect(result.map((s) => s.id)).toEqual(['step-2', 'step-3', 'step-4', 'step-5']);
  });

  it('traverses through completed steps to find deeper dependents', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'completed', ['step-1']),
      createStep('step-3', 'pending', ['step-2']),
    ];
    const result = getRemainingDependents('step-1', steps);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('step-3');
  });

  it('handles diamond-shaped dependency graph without duplicates', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'pending', ['step-1']),
      createStep('step-3', 'pending', ['step-1']),
      createStep('step-4', 'pending', ['step-2', 'step-3']),
    ];
    const result = getRemainingDependents('step-1', steps);
    expect(result).toHaveLength(3);
    const ids = result.map((s) => s.id).sort();
    expect(ids).toEqual(['step-2', 'step-3', 'step-4']);
  });

  it('handles circular dependencies without infinite loop', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'pending', ['step-3']),
      createStep('step-3', 'pending', ['step-2']),
    ];
    const result = getRemainingDependents('step-1', steps);
    expect(result).toEqual([]);
  });

  it('handles step with no direct link to completed step in circular graph', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'pending', ['step-2']),
    ];
    const result = getRemainingDependents('step-1', steps);
    expect(result).toEqual([]);
  });

  it('finds multiple dependents at same level', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'pending', ['step-1']),
      createStep('step-3', 'pending', ['step-1']),
      createStep('step-4', 'ready', ['step-1']),
    ];
    const result = getRemainingDependents('step-1', steps);
    expect(result).toHaveLength(3);
  });

  it('filters correct statuses only (pending, ready, running)', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'pending', ['step-1']),
      createStep('step-3', 'ready', ['step-1']),
      createStep('step-4', 'running', ['step-1']),
      createStep('step-5', 'completed', ['step-1']),
      createStep('step-6', 'failed', ['step-1']),
      createStep('step-7', 'skipped', ['step-1']),
      createStep('step-8', 'blocked', ['step-1']),
    ];
    const result = getRemainingDependents('step-1', steps);
    expect(result).toHaveLength(3);
    expect(result.map((s) => s.id).sort()).toEqual(['step-2', 'step-3', 'step-4']);
  });

  it('handles large depth chain efficiently', () => {
    const steps: TestStep[] = [];
    for (let i = 1; i <= 100; i++) {
      steps.push(createStep(`step-${i}`, i === 1 ? 'completed' : 'pending', [`step-${i - 1}`]));
    }
    const result = getRemainingDependents('step-1', steps);
    expect(result).toHaveLength(99);
  });

  it('handles fan-out then fan-in graph', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'pending', ['step-1']),
      createStep('step-3', 'pending', ['step-1']),
      createStep('step-4', 'pending', ['step-1']),
      createStep('step-5', 'pending', ['step-2', 'step-3', 'step-4']),
    ];
    const result = getRemainingDependents('step-1', steps);
    expect(result).toHaveLength(4);
  });

  it('returns dependents in BFS order', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'pending', ['step-1']),
      createStep('step-3', 'pending', ['step-1']),
      createStep('step-4', 'pending', ['step-2']),
      createStep('step-5', 'pending', ['step-3']),
    ];
    const result = getRemainingDependents('step-1', steps);
    expect(result[0].id).toBe('step-2');
    expect(result[1].id).toBe('step-3');
  });
});

describe('buildDependentsMap', () => {
  it('builds correct reverse dependency map', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'pending', ['step-1']),
      createStep('step-3', 'pending', ['step-1']),
    ];
    const map = buildDependentsMap(steps);
    expect(map.get('step-1')).toHaveLength(2);
    expect(map.get('step-1')!.map((s) => s.id).sort()).toEqual(['step-2', 'step-3']);
  });

  it('returns empty map when no dependents exist', () => {
    const steps = [createStep('step-1', 'completed')];
    const map = buildDependentsMap(steps);
    expect(map.size).toBe(0);
  });

  it('handles multiple dependency levels', () => {
    const steps = [
      createStep('step-1', 'completed'),
      createStep('step-2', 'pending', ['step-1']),
      createStep('step-3', 'pending', ['step-2']),
    ];
    const map = buildDependentsMap(steps);
    expect(map.get('step-1')).toHaveLength(1);
    expect(map.get('step-2')).toHaveLength(1);
    expect(map.get('step-3')).toBeUndefined();
  });
});
