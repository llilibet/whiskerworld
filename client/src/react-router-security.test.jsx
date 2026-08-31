import { describe, expect, it } from 'vitest';
import pkg from '../package.json';

function parseVersion(version) {
  return version
    .replace(/^[^\d]*/, '')
    .split('.')
    .map((part) => Number.parseInt(part, 10) || 0);
}

function compareVersions(current, required) {
  const currentParts = parseVersion(current);
  const requiredParts = parseVersion(required);
  const length = Math.max(currentParts.length, requiredParts.length);

  for (let i = 0; i < length; i += 1) {
    const currentPart = currentParts[i] ?? 0;
    const requiredPart = requiredParts[i] ?? 0;

    if (currentPart > requiredPart) return 1;
    if (currentPart < requiredPart) return -1;
  }

  return 0;
}

describe('React Router security requirements', () => {
  it('uses a patched version without the open redirect vulnerability', () => {
    const requiredVersion = '6.30.6';
    const currentVersion = pkg.dependencies['react-router-dom'];

    expect(compareVersions(currentVersion, requiredVersion)).toBeGreaterThanOrEqual(0);
  });
});
