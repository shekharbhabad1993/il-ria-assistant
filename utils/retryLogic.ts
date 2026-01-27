/**
 * Retry utility with exponential backoff for handling API overload errors
 */

interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 8000,
  backoffMultiplier: 2
};

/**
 * Sleep utility for delays
 */
const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if error is a retryable 503 or rate limit error
 */
const isRetryableError = (error: any): boolean => {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorCode = error?.error?.code || error?.code;

  return (
    errorCode === 503 ||
    errorCode === 429 ||
    errorMessage.includes('overloaded') ||
    errorMessage.includes('unavailable') ||
    errorMessage.includes('rate limit')
  );
};

/**
 * Execute a function with exponential backoff retry logic
 *
 * @param fn - Async function to retry
 * @param options - Retry configuration
 * @returns Result of the function or throws error after max retries
 */
export async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // If it's the last attempt or error is not retryable, throw immediately
      if (attempt === config.maxRetries || !isRetryableError(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt),
        config.maxDelayMs
      );

      console.log(
        `API call failed (attempt ${attempt + 1}/${config.maxRetries + 1}). ` +
        `Retrying in ${delay}ms...`,
        error
      );

      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Try with primary model, fallback to flash model if it fails
 */
export async function tryWithFallbackModel<T>(
  primaryFn: () => Promise<T>,
  fallbackFn: () => Promise<T>
): Promise<T> {
  try {
    // Try primary model with retry logic
    return await retryWithExponentialBackoff(primaryFn, {
      maxRetries: 2,
      initialDelayMs: 1000
    });
  } catch (primaryError) {
    console.log('Primary model failed, trying fallback flash model...');

    try {
      // Try fallback flash model with retry logic
      return await retryWithExponentialBackoff(fallbackFn, {
        maxRetries: 2,
        initialDelayMs: 500
      });
    } catch (fallbackError) {
      // Both failed, throw the fallback error
      throw fallbackError;
    }
  }
}
