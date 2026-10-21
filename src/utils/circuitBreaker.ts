export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitSnapshot {
  state: CircuitState;
  failures: number;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
}

export class CircuitOpenError extends Error {
  constructor() {
    super('Circuit breaker is open');
    this.name = 'CircuitOpenError';
  }
}

export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private lastSuccessTime = 0;
  private state: CircuitState = 'CLOSED';
  private halfOpenCallInProgress = false;

  constructor(
    private readonly failureThreshold = 3,
    private readonly resetTimeoutMs = 30_000
  ) {}

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime < this.resetTimeoutMs) {
        throw new CircuitOpenError();
      }
      this.state = 'HALF_OPEN';
    }

    if (this.state === 'HALF_OPEN') {
      if (this.halfOpenCallInProgress) throw new CircuitOpenError();
      this.halfOpenCallInProgress = true;
    }

    try {
      const result = await fn();
      this.failures = 0;
      this.state = 'CLOSED';
      this.lastSuccessTime = Date.now();
      return result;
    } catch (error) {
      this.failures = this.state === 'HALF_OPEN' ? this.failureThreshold : this.failures + 1;
      this.lastFailureTime = Date.now();
      if (this.failures >= this.failureThreshold) this.state = 'OPEN';
      throw error;
    } finally {
      this.halfOpenCallInProgress = false;
    }
  }

  snapshot(): CircuitSnapshot {
    return {
      state: this.state,
      failures: this.failures,
      lastSuccessAt: this.lastSuccessTime ? new Date(this.lastSuccessTime).toISOString() : null,
      lastFailureAt: this.lastFailureTime ? new Date(this.lastFailureTime).toISOString() : null,
    };
  }
}
