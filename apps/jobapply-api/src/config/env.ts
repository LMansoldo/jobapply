const REQUIRED = ['MONGODB_URI', 'JWT_SECRET', 'GOOGLE_AI_API_KEY', 'ATS_AGENT_URL', 'ALLOWED_ORIGINS'] as const;

export function validateEnv(): void {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  if ((process.env.JWT_SECRET as string).length < 32) {
    console.error('JWT_SECRET must be at least 32 characters');
    process.exit(1);
  }
}
