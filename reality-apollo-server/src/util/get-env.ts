
export function getEnv(env: string, fallback?: string): string {
  return process.env[env] ?? fallback
}
