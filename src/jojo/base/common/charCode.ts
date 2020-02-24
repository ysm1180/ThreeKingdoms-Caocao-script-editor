/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

// Names from https://blog.codinghorror.com/ascii-pronunciation-rules-for-programmers/

/**
 * An inlined enum containing useful character codes (to be used with String.charCodeAt).
 * Please leave the const keyword such that it gets inlined when compiled to JavaScript!
 */
export const enum CharCode {
  Null = 0,
  /**
   * The `\t` character.
   */
  Tab = 9,
  /**
   * The `\n` character.
   */
  LineFeed = 10,
  /**
   * The `\r` character.
   */
  CarriageReturn = 13,
  Space = 32,
  /**
   * The `!` character.
   */
  ExclamationMark = 33,
  /**
   * The `"` character.
   */
  DoubleQuote = 34,
  /**
   * The `#` character.
   */
  Hash = 35,
  /**
   * The `$` character.
   */
  DollarSign = 36,
  /**
   * The `%` character.
   */
  PercentSign = 37,
  /**
   * The `&` character.
   */
  Ampersand = 38,
  /**
   * The `'` character.
   */
  SingleQuote = 39,
  /**
   * The `(` character.
   */
  OpenParen = 40,
  /**
   * The `)` character.
   */
  CloseParen = 41,
  /**
   * The `*` character.
   */
  Asterisk = 42,
  /**
   * The `+` character.
   */
  Plus = 43,
  /**
   * The `,` character.
   */
  Comma = 44,
  /**
   * The `-` character.
   */
  Dash = 45,
  /**
   * The `.` character.
   */
  Period = 46,
  /**
   * The `/` character.
   */
  Slash = 47,

  Digit0 = 48,
  Digit1 = 49,
  Digit2 = 50,
  Digit3 = 51,
  Digit4 = 52,
  Digit5 = 53,
  Digit6 = 54,
  Digit7 = 55,
  Digit8 = 56,
  Digit9 = 57,

  /**
   * The `:` character.
   */
  Colon = 58,
  /**
   * The `;` character.
   */
  Semicolon = 59,
  /**
   * The `<` character.
   */
  LessThan = 60,
  /**
   * The `=` character.
   */
  Equals = 61,
  /**
   * The `>` character.
   */
  GreaterThan = 62,
  /**
   * The `?` character.
   */
  QuestionMark = 63,
  /**
   * The `@` character.
   */
  AtSign = 64,

  A = 65,
  B = 66,
  C = 67,
  D = 68,
  E = 69,
  F = 70,
  G = 71,
  H = 72,
  I = 73,
  J = 74,
  K = 75,
  L = 76,
  M = 77,
  N = 78,
  O = 79,
  P = 80,
  Q = 81,
  R = 82,
  S = 83,
  T = 84,
  U = 85,
  V = 86,
  W = 87,
  X = 88,
  Y = 89,
  Z = 90,

  /**
   * The `[` character.
   */
  OpenSquareBracket = 91,
  /**
   * The `\` character.
   */
  Backslash = 92,
  /**
   * The `]` character.
   */
  CloseSquareBracket = 93,
  /**
   * The `^` character.
   */
  Caret = 94,
  /**
   * The `_` character.
   */
  Underline = 95,
  /**
   * The ``(`)`` character.
   */
  BackTick = 96,

  a = 97,
  b = 98,
  c = 99,
  d = 100,
  e = 101,
  f = 102,
  g = 103,
  h = 104,
  i = 105,
  j = 106,
  k = 107,
  l = 108,
  m = 109,
  n = 110,
  o = 111,
  p = 112,
  q = 113,
  r = 114,
  s = 115,
  t = 116,
  u = 117,
  v = 118,
  w = 119,
  x = 120,
  y = 121,
  z = 122,

  /**
   * The `{` character.
   */
  OpenCurlyBrace = 123,
  /**
   * The `|` character.
   */
  Pipe = 124,
  /**
   * The `}` character.
   */
  CloseCurlyBrace = 125,
  /**
   * The `~` character.
   */
  Tilde = 126,

  /**
   * Unicode Character 'LINE SEPARATOR' (U+2028)
   * http://www.fileformat.info/info/unicode/char/2028/index.htm
   */
  LINE_SEPARATOR_2028 = 8232,

  // http://www.fileformat.info/info/unicode/category/Sk/list.htm
  U_CIRCUMFLEX = 0x005e, // U+005E	CIRCUMFLEX
  U_GRAVE_ACCENT = 0x0060, // U+0060	GRAVE ACCENT
  U_DIAERESIS = 0x00a8, // U+00A8	DIAERESIS
  U_MACRON = 0x00af, // U+00AF	MACRON
  U_ACUTE_ACCENT = 0x00b4, // U+00B4	ACUTE ACCENT
  U_CEDILLA = 0x00b8, // U+00B8	CEDILLA
  U_MODIFIER_LETTER_LEFT_ARROWHEAD = 0x02c2, // U+02C2	MODIFIER LETTER LEFT ARROWHEAD
  U_MODIFIER_LETTER_RIGHT_ARROWHEAD = 0x02c3, // U+02C3	MODIFIER LETTER RIGHT ARROWHEAD
  U_MODIFIER_LETTER_UP_ARROWHEAD = 0x02c4, // U+02C4	MODIFIER LETTER UP ARROWHEAD
  U_MODIFIER_LETTER_DOWN_ARROWHEAD = 0x02c5, // U+02C5	MODIFIER LETTER DOWN ARROWHEAD
  U_MODIFIER_LETTER_CENTRED_RIGHT_HALF_RING = 0x02d2, // U+02D2	MODIFIER LETTER CENTRED RIGHT HALF RING
  U_MODIFIER_LETTER_CENTRED_LEFT_HALF_RING = 0x02d3, // U+02D3	MODIFIER LETTER CENTRED LEFT HALF RING
  U_MODIFIER_LETTER_UP_TACK = 0x02d4, // U+02D4	MODIFIER LETTER UP TACK
  U_MODIFIER_LETTER_DOWN_TACK = 0x02d5, // U+02D5	MODIFIER LETTER DOWN TACK
  U_MODIFIER_LETTER_PLUS_SIGN = 0x02d6, // U+02D6	MODIFIER LETTER PLUS SIGN
  U_MODIFIER_LETTER_MINUS_SIGN = 0x02d7, // U+02D7	MODIFIER LETTER MINUS SIGN
  U_BREVE = 0x02d8, // U+02D8	BREVE
  U_DOT_ABOVE = 0x02d9, // U+02D9	DOT ABOVE
  U_RING_ABOVE = 0x02da, // U+02DA	RING ABOVE
  U_OGONEK = 0x02db, // U+02DB	OGONEK
  U_SMALL_TILDE = 0x02dc, // U+02DC	SMALL TILDE
  U_DOUBLE_ACUTE_ACCENT = 0x02dd, // U+02DD	DOUBLE ACUTE ACCENT
  U_MODIFIER_LETTER_RHOTIC_HOOK = 0x02de, // U+02DE	MODIFIER LETTER RHOTIC HOOK
  U_MODIFIER_LETTER_CROSS_ACCENT = 0x02df, // U+02DF	MODIFIER LETTER CROSS ACCENT
  U_MODIFIER_LETTER_EXTRA_HIGH_TONE_BAR = 0x02e5, // U+02E5	MODIFIER LETTER EXTRA-HIGH TONE BAR
  U_MODIFIER_LETTER_HIGH_TONE_BAR = 0x02e6, // U+02E6	MODIFIER LETTER HIGH TONE BAR
  U_MODIFIER_LETTER_MID_TONE_BAR = 0x02e7, // U+02E7	MODIFIER LETTER MID TONE BAR
  U_MODIFIER_LETTER_LOW_TONE_BAR = 0x02e8, // U+02E8	MODIFIER LETTER LOW TONE BAR
  U_MODIFIER_LETTER_EXTRA_LOW_TONE_BAR = 0x02e9, // U+02E9	MODIFIER LETTER EXTRA-LOW TONE BAR
  U_MODIFIER_LETTER_YIN_DEPARTING_TONE_MARK = 0x02ea, // U+02EA	MODIFIER LETTER YIN DEPARTING TONE MARK
  U_MODIFIER_LETTER_YANG_DEPARTING_TONE_MARK = 0x02eb, // U+02EB	MODIFIER LETTER YANG DEPARTING TONE MARK
  U_MODIFIER_LETTER_UNASPIRATED = 0x02ed, // U+02ED	MODIFIER LETTER UNASPIRATED
  U_MODIFIER_LETTER_LOW_DOWN_ARROWHEAD = 0x02ef, // U+02EF	MODIFIER LETTER LOW DOWN ARROWHEAD
  U_MODIFIER_LETTER_LOW_UP_ARROWHEAD = 0x02f0, // U+02F0	MODIFIER LETTER LOW UP ARROWHEAD
  U_MODIFIER_LETTER_LOW_LEFT_ARROWHEAD = 0x02f1, // U+02F1	MODIFIER LETTER LOW LEFT ARROWHEAD
  U_MODIFIER_LETTER_LOW_RIGHT_ARROWHEAD = 0x02f2, // U+02F2	MODIFIER LETTER LOW RIGHT ARROWHEAD
  U_MODIFIER_LETTER_LOW_RING = 0x02f3, // U+02F3	MODIFIER LETTER LOW RING
  U_MODIFIER_LETTER_MIDDLE_GRAVE_ACCENT = 0x02f4, // U+02F4	MODIFIER LETTER MIDDLE GRAVE ACCENT
  U_MODIFIER_LETTER_MIDDLE_DOUBLE_GRAVE_ACCENT = 0x02f5, // U+02F5	MODIFIER LETTER MIDDLE DOUBLE GRAVE ACCENT
  U_MODIFIER_LETTER_MIDDLE_DOUBLE_ACUTE_ACCENT = 0x02f6, // U+02F6	MODIFIER LETTER MIDDLE DOUBLE ACUTE ACCENT
  U_MODIFIER_LETTER_LOW_TILDE = 0x02f7, // U+02F7	MODIFIER LETTER LOW TILDE
  U_MODIFIER_LETTER_RAISED_COLON = 0x02f8, // U+02F8	MODIFIER LETTER RAISED COLON
  U_MODIFIER_LETTER_BEGIN_HIGH_TONE = 0x02f9, // U+02F9	MODIFIER LETTER BEGIN HIGH TONE
  U_MODIFIER_LETTER_END_HIGH_TONE = 0x02fa, // U+02FA	MODIFIER LETTER END HIGH TONE
  U_MODIFIER_LETTER_BEGIN_LOW_TONE = 0x02fb, // U+02FB	MODIFIER LETTER BEGIN LOW TONE
  U_MODIFIER_LETTER_END_LOW_TONE = 0x02fc, // U+02FC	MODIFIER LETTER END LOW TONE
  U_MODIFIER_LETTER_SHELF = 0x02fd, // U+02FD	MODIFIER LETTER SHELF
  U_MODIFIER_LETTER_OPEN_SHELF = 0x02fe, // U+02FE	MODIFIER LETTER OPEN SHELF
  U_MODIFIER_LETTER_LOW_LEFT_ARROW = 0x02ff, // U+02FF	MODIFIER LETTER LOW LEFT ARROW
  U_GREEK_LOWER_NUMERAL_SIGN = 0x0375, // U+0375	GREEK LOWER NUMERAL SIGN
  U_GREEK_TONOS = 0x0384, // U+0384	GREEK TONOS
  U_GREEK_DIALYTIKA_TONOS = 0x0385, // U+0385	GREEK DIALYTIKA TONOS
  U_GREEK_KORONIS = 0x1fbd, // U+1FBD	GREEK KORONIS
  U_GREEK_PSILI = 0x1fbf, // U+1FBF	GREEK PSILI
  U_GREEK_PERISPOMENI = 0x1fc0, // U+1FC0	GREEK PERISPOMENI
  U_GREEK_DIALYTIKA_AND_PERISPOMENI = 0x1fc1, // U+1FC1	GREEK DIALYTIKA AND PERISPOMENI
  U_GREEK_PSILI_AND_VARIA = 0x1fcd, // U+1FCD	GREEK PSILI AND VARIA
  U_GREEK_PSILI_AND_OXIA = 0x1fce, // U+1FCE	GREEK PSILI AND OXIA
  U_GREEK_PSILI_AND_PERISPOMENI = 0x1fcf, // U+1FCF	GREEK PSILI AND PERISPOMENI
  U_GREEK_DASIA_AND_VARIA = 0x1fdd, // U+1FDD	GREEK DASIA AND VARIA
  U_GREEK_DASIA_AND_OXIA = 0x1fde, // U+1FDE	GREEK DASIA AND OXIA
  U_GREEK_DASIA_AND_PERISPOMENI = 0x1fdf, // U+1FDF	GREEK DASIA AND PERISPOMENI
  U_GREEK_DIALYTIKA_AND_VARIA = 0x1fed, // U+1FED	GREEK DIALYTIKA AND VARIA
  U_GREEK_DIALYTIKA_AND_OXIA = 0x1fee, // U+1FEE	GREEK DIALYTIKA AND OXIA
  U_GREEK_VARIA = 0x1fef, // U+1FEF	GREEK VARIA
  U_GREEK_OXIA = 0x1ffd, // U+1FFD	GREEK OXIA
  U_GREEK_DASIA = 0x1ffe, // U+1FFE	GREEK DASIA

  U_OVERLINE = 0x203e, // Unicode Character 'OVERLINE'

  /**
   * UTF-8 BOM
   * Unicode Character 'ZERO WIDTH NO-BREAK SPACE' (U+FEFF)
   * http://www.fileformat.info/info/unicode/char/feff/index.htm
   */
  UTF8_BOM = 65279,
}
