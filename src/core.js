/*
 * vigenere-cipher-kit — core encoding logic.
 *
 * The Vigenère cipher is a polyalphabetic substitution: each plaintext
 * letter is shifted by a value derived from a keyword, cycling the keyword
 * across non-space gaps. This module isolates the alphabet mechanics so it
 * can be reused or tested without the public API wrapper.
 */

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Precomputed map from letter to index for O(1) lookups; avoids scanning the
// alphabet string repeatedly which would be O(26) per character.
const LETTER_INDEX = new Map();
for (let i = 0; i < ALPHABET.length; i++) {
  LETTER_INDEX.set(ALPHABET[i], i);
}

const MOD = ALPHABET.length;

/**
 * Raise a clear, specific error when a keyword contains no usable letters.
 *
 * Why a dedicated check instead of letting division-by-zero happen: a bare
 * "range error" from an empty keyword is confusing; we tell the caller
 * exactly which precondition failed.
 */
function assertUsableKeyword(keyword) {
  if (typeof keyword !== 'string' || keyword.length === 0) {
    throw new TypeError('keyword must be a non-empty string');
  }
  const hasLetter = keyword
    .toUpperCase()
    .split('')
    .some((c) => LETTER_INDEX.has(c));
  if (!hasLetter) {
    throw new Error('keyword must contain at least one A-Z letter');
  }
}

/**
 * Reduce a keyword to its uppercase A-Z letters only. Non-letters are skipped
 * so a keyword like "My Key 2" behaves as "MYKEY".
 */
function normalizeKeyword(keyword) {
  assertUsableKeyword(keyword);
  const result = [];
  for (const raw of keyword.toUpperCase()) {
    if (LETTER_INDEX.has(raw)) {
      result.push(raw);
    }
  }
  return result.join('');
}

/**
 * Transform text by applying a per-letter Caesar shift controlled by the
 * keyword. `direction` is +1 to encipher, -1 to decipher.
 *
 * Design decision: non-letters pass through untouched and do NOT advance the
 * keyword pointer. This is the classic Tabula Recta behavior and means
 * "A B" and "AB" produce the same enciphered letter sequence for the
 * letters that do appear.
 */
function transform(text, keyword, direction) {
  if (typeof text !== 'string') {
    throw new TypeError('text must be a string');
  }
  const key = normalizeKeyword(keyword);
  const upper = text.toUpperCase();
  const out = [];
  let keyIndex = 0;

  for (let i = 0; i < upper.length; i++) {
    const ch = upper[i];
    if (LETTER_INDEX.has(ch)) {
      const shift = LETTER_INDEX.get(key[keyIndex % key.length]) * direction;
      // Use modular arithmetic: +direction for encipher, -direction for
      // decipher. Adding MOD before taking the modulus ensures a positive
      // result for decipherment's negative intermediate.
      const newIndex =
        (LETTER_INDEX.get(ch) + shift + MOD) % MOD;
      out.push(ALPHABET[newIndex]);
      keyIndex++;
    } else {
      out.push(text[i]);
    }
  }
  return out.join('');
}

/**
 * Encipher `text` with `keyword`. Output is uppercase; non-letters pass
 * through unchanged and do not advance the keyword.
 */
export function encipher(text, keyword) {
  return transform(text, keyword, 1);
}

/**
 * Decipher `text` that was enciphered with `keyword`. Input is treated as
 * case-insensitive; non-letters pass through unchanged.
 */
export function decipher(text, keyword) {
  return transform(text, keyword, -1);
}
