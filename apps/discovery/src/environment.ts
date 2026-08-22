export type Environment = 'local' | 'staging' | 'production';

/**
 * Determines the current environment based on the NODE_ENV environment variable.
 *
 * @returns {Environment} The current environment ('local', 'staging', or 'production').
 */
export function getEnvironment(): Environment {
  const environment = process.env.NODE_ENV;

  switch (environment) {
    case 'local':
      return 'local';
    case 'staging':
      return 'staging';
    default:
      return 'production';
  }
}

export function valueForEnvironment<T>(record: Record<Environment, T>): T {
  return record[getEnvironment()];
}
