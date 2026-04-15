import { Throttle } from '@nestjs/throttler';

// Strict rate for authentication, payment
export const StrictThrottler = () =>
  Throttle({
    default: {
      ttl: 1000,
      limit: 3,
    },
  });

// Moderate rate for orders
export const ModerateThrottler = () =>
  Throttle({
    default: {
      ttl: 1000,
      limit: 5,
    },
  });

// Relaxed rate for general endpoints
export const RelaxedThrottler = () =>
  Throttle({
    default: {
      ttl: 1000,
      limit: 20,
    },
  });
