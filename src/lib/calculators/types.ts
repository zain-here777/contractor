export type CalcSuccess<T> = {
  ok: true;
  value: T;
  warnings?: string[];
};

export type CalcFailure = {
  ok: false;
  error: string;
};

export type CalcResult<T> = CalcSuccess<T> | CalcFailure;

export function ok<T>(value: T, warnings?: string[]): CalcSuccess<T> {
  return warnings && warnings.length > 0
    ? { ok: true, value, warnings }
    : { ok: true, value };
}

export function fail(error: string): CalcFailure {
  return { ok: false, error };
}
