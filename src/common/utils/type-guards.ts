export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const hasMessage = (value: unknown): value is { message: string } =>
  isRecord(value) && typeof value['message'] === 'string';
