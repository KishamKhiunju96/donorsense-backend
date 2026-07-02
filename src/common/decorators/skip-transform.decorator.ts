import { SetMetadata } from '@nestjs/common';

export const SKIP_RESPONSE_TRANSFORM_KEY = 'skipResponseTransform';
export const SkipTransform = () =>
  SetMetadata(SKIP_RESPONSE_TRANSFORM_KEY, true);
