import test from 'node:test';
import assert from 'node:assert/strict';
import { __testables } from './index.js';

test('parseAllowedOrigins parses comma separated values', () => {
  const parsed = __testables.parseAllowedOrigins('https://a.com, https://b.com ,,');
  assert.deepEqual(parsed, ['https://a.com', 'https://b.com']);
});

test('resolveOrigin returns null for disallowed origin', () => {
  const origin = __testables.resolveOrigin('https://x.com', ['https://a.com']);
  assert.equal(origin, null);
});

test('trimMessages keeps latest 12 valid messages and trims long content', () => {
  const messages = Array.from({ length: 15 }, (_, i) => ({ role: 'user', content: `m${i}` }));
  messages.push({ role: 'assistant', content: 'x'.repeat(5000) });

  const trimmed = __testables.trimMessages(messages);
  assert.equal(trimmed.length, 12);
  assert.equal(trimmed.at(-1).content.length, 4000);
});
