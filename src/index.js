/*
 * vigenere-cipher-kit public surface.
 *
 * Re-exports the core functions so callers can `import { encipher, decipher }
 * from 'vigenere-cipher-kit'`.
 */

export { encipher, decipher, ALPHABET } from './core.js';
