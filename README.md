# vigenere-cipher-kit

Enciphers and deciphers text using a polyalphabetic substitution controlled by a repeating keyword.

## Usage

```js
import { encipher, decipher } from 'vigenere-cipher-kit';

encipher('ATTACKATDAWN', 'LEMON');   // -> 'LXFOPVEFRNHR'
decipher('LXFOPVEFRNHR', 'LEMON');   // -> 'ATTACKATDAWN'
```

## Why this exists

There are Vigenère implementations that quietly handle Unicode, mixed alphabets, or autokey variants. This one does not, and that is the point: a single, predictable 26-letter A–Z implementation with no third-party dependencies and no configuration surface. If you need classic Vigenère over English letters, this will not surprise you.

## Behavior you should know

Output is always uppercase. Input is treated case-insensitively for letters; lowercase letters are uppercased before shifting.

Non-letters (spaces, digits, punctuation) pass through unchanged **and do not advance the keyword pointer**. This is the classic Tabula Recta rule: `encipher('A B', 'K')` produces `'B C'`, and the `B` depends only on the first `A`, not on the space.

A keyword must contain at least one A–Z letter. `'123'` throws; `''` throws. Keyword case is ignored.
