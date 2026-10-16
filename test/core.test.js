import { test } from 'node:test';
import assert from 'node:assert/strict';

import { encipher, decipher, ALPHABET } from '../src/index.js';

test('encipher shifts plaintext letters by the repeating keyword', () => {
  // Classic textbook example: HELLO + KEY -> RIJVS
  assert.equal(encipher('HELLO', 'KEY'), 'RIJVS');
});

test('decipher reverses encipher for uppercase input', () => {
  assert.equal(decipher('RIJVS', 'KEY'), 'HELLO');
});

test('encipher then decipher round-trips arbitrary case input', () => {
  const original = 'AttackAtDawn';
  assert.equal(decipher(encipher(original, 'Lemon'), 'Lemon'), 'ATTACKATDAWN');
});

test('non-letters pass through and do not advance the keyword', () => {
  // 'A B' and 'AB' must produce the same letter output, because the space
  // does not consume a keyword character.
  assert.equal(encipher('A B', 'K'), 'K L');
  assert.equal(encipher('A B', 'K').replace(/[^A-Z]/g, ''),
               encipher('AB', 'K'));
});

test('digit and punctuation characters are preserved', () => {
  assert.equal(encipher('MEET AT 9PM!', 'Z'), 'LDDS ZS 9OL!');
});

test('lowercase keyword behaves the same as uppercase', () => {
  assert.equal(encipher('HELLO', 'key'), encipher('HELLO', 'KEY'));
});

test('keyword shorter than plaintext repeats correctly', () => {
  assert.equal(encipher('ABCABC', 'A'), 'ABCABC');
  assert.equal(encipher('ABCABC', 'B'), 'BCDBCD');
});

test('keyword longer than plaintext is used only as far as needed', () => {
  assert.equal(encipher('HI', 'SECRETKEYWORD'), 'ZM');
});

test('decipher of ciphertext not produced by this library still shifts back', () => {
  // Arbitrary cipher text; decipher should still apply the inverse shift.
  assert.equal(decipher('ZZZZ', 'A'), 'ZZZZ');
});

test('empty string text returns empty string', () => {
  assert.equal(encipher('', 'KEY'), '');
  assert.equal(decipher('', 'KEY'), '');
});

test('keyword with only non-letter characters throws', () => {
  assert.throws(() => encipher('HELLO', '123'), /at least one A-Z letter/);
});

test('empty keyword throws a TypeError', () => {
  assert.throws(() => encipher('HELLO', ''), TypeError);
});

test('non-string text throws a TypeError', () => {
  assert.throws(() => encipher(42, 'KEY'), TypeError);
});

test('ALPHABET export has exactly 26 uppercase letters', () => {
  assert.equal(ALPHABET, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  assert.equal(ALPHABET.length, 26);
});
