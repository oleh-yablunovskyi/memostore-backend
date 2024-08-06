export function getSSLConfig(env: string) {
  const configs = {
    production: { require: true, rejectUnauthorized: true },
    deploy: { require: true, rejectUnauthorized: false },
    local: false,
  };
  if (!configs[env] === undefined) {
    throw new Error('Set network in your .env file');
  }
  return configs[env];
}
