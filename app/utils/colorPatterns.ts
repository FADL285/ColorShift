import {
  createRegExp,
  anyOf,
  charIn,
  digit,
  exactly,
  maybe,
  oneOrMore,
  wordBoundary,
  global,
  caseInsensitive
} from 'magic-regexp'

// ============================================
// REUSABLE BUILDING BLOCKS
// ============================================

/**
 * Matches a numeric value: integer or decimal (e.g., "255", "0.5", "100.25")
 * Pattern: [\d.]+
 */
const numericValue = oneOrMore(anyOf(digit, '.'))

/**
 * Matches a numeric value with optional negative sign (for LAB a/b values)
 * Pattern: [\d.-]+
 */
const signedNumericValue = oneOrMore(anyOf(digit, '.', '-'))

/**
 * Matches a numeric value with optional percentage
 * Pattern: [\d.]+%?
 */
const numericWithOptionalPercent = oneOrMore(anyOf(digit, '.')).and(maybe('%'))

/**
 * Matches optional whitespace (space, tab, newline)
 * Pattern: \s*
 */
const optionalWhitespace = maybe(oneOrMore(charIn(' \\t\\n\\r')))

/**
 * Matches required whitespace (at least one space/tab/newline)
 * Pattern: \s+
 */
const requiredWhitespace = oneOrMore(charIn(' \\t\\n\\r'))

/**
 * Matches CSS angle units
 * Pattern: (?:deg|rad|grad|turn)?
 */
const optionalAngleUnit = maybe(anyOf('deg', 'rad', 'grad', 'turn'))

/**
 * Matches comma or space separator (legacy vs modern CSS syntax)
 * Pattern: [,\s]
 */
const separator = charIn(', \\t\\n\\r')

/**
 * Matches alpha separator (comma or slash)
 * Pattern: [,/]
 */
const alphaSeparator = charIn(',/')

/**
 * Matches optional alpha channel with comma or slash
 * Pattern: (?:[,/]\s*[\d.]+%?)?\s*
 */
const optionalAlpha = maybe(alphaSeparator.and(optionalWhitespace).and(numericWithOptionalPercent))

/**
 * Matches optional alpha with slash only (modern syntax)
 * Pattern: (?:\/\s*[\d.]+%?)?
 */
const optionalSlashAlpha = maybe(
  exactly('/').and(optionalWhitespace).and(numericWithOptionalPercent)
)

// ============================================
// HEX PATTERN
// ============================================

/**
 * HEX color pattern
 * Matches: #fff, #ffff, #ffffff, #ffffffff
 * Pattern: #(?:[a-fA-F0-9]{3,4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})\b
 *
 * Note: charIn() doesn't support range syntax like 'a-f', so we enumerate all hex chars
 */
const hexChars = charIn('0123456789abcdefABCDEF')

export const hexPattern = createRegExp(
  exactly('#')
    .and(
      anyOf(
        hexChars.times(8), // #ffffffff (with alpha) - check longest first
        hexChars.times(6), // #ffffff
        hexChars.times(4), // #ffff (with alpha)
        hexChars.times(3) // #fff
      )
    )
    .and(wordBoundary),
  [global]
)

// ============================================
// RGB/RGBA PATTERN
// ============================================

/**
 * RGB/RGBA color pattern
 * Matches: rgb(255, 87, 51), rgba(255, 87, 51, 0.5), rgb(255 87 51 / 0.5)
 * Pattern: rgba?\(\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?\s*(?:[,/]\s*[\d.]+%?)?\s*\)
 */
export const rgbPattern = createRegExp(
  exactly('rgb')
    .and(maybe('a'))
    .and('(')
    .and(optionalWhitespace)
    .and(numericWithOptionalPercent) // R value
    .and(optionalWhitespace)
    .and(separator)
    .and(optionalWhitespace)
    .and(numericWithOptionalPercent) // G value
    .and(optionalWhitespace)
    .and(separator)
    .and(optionalWhitespace)
    .and(numericWithOptionalPercent) // B value
    .and(optionalWhitespace)
    .and(optionalAlpha) // Optional alpha
    .and(optionalWhitespace)
    .and(')'),
  [global, caseInsensitive]
)

// ============================================
// HSL/HSLA PATTERN
// ============================================

/**
 * HSL/HSLA color pattern
 * Matches: hsl(11, 100%, 60%), hsla(11deg, 100%, 60%, 0.5)
 * Pattern: hsla?\(\s*[\d.]+(?:deg|rad|grad|turn)?\s*[,\s]\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?\s*(?:[,/]\s*[\d.]+%?)?\s*\)
 */
export const hslPattern = createRegExp(
  exactly('hsl')
    .and(maybe('a'))
    .and('(')
    .and(optionalWhitespace)
    .and(numericValue) // H value
    .and(optionalAngleUnit) // Optional angle unit
    .and(optionalWhitespace)
    .and(separator)
    .and(optionalWhitespace)
    .and(numericWithOptionalPercent) // S value
    .and(optionalWhitespace)
    .and(separator)
    .and(optionalWhitespace)
    .and(numericWithOptionalPercent) // L value
    .and(optionalWhitespace)
    .and(optionalAlpha) // Optional alpha
    .and(optionalWhitespace)
    .and(')'),
  [global, caseInsensitive]
)

// ============================================
// HWB PATTERN
// ============================================

/**
 * HWB color pattern (space-separated, modern syntax only)
 * Matches: hwb(11 20% 0%), hwb(11deg 20% 0% / 0.5)
 * Pattern: hwb\(\s*[\d.]+(?:deg|rad|grad|turn)?\s+[\d.]+%\s+[\d.]+%\s*(?:\/\s*[\d.]+%?)?\s*\)
 */
export const hwbPattern = createRegExp(
  exactly('hwb')
    .and('(')
    .and(optionalWhitespace)
    .and(numericValue) // H value
    .and(optionalAngleUnit) // Optional angle unit
    .and(requiredWhitespace)
    .and(numericValue)
    .and('%') // W value (percentage required)
    .and(requiredWhitespace)
    .and(numericValue)
    .and('%') // B value (percentage required)
    .and(optionalWhitespace)
    .and(optionalSlashAlpha) // Optional alpha (slash only)
    .and(optionalWhitespace)
    .and(')'),
  [global, caseInsensitive]
)

// ============================================
// LAB PATTERN
// ============================================

/**
 * LAB color pattern
 * Matches: lab(62 58 49), lab(62% -58 49 / 0.5)
 * Pattern: lab\(\s*[\d.]+%?\s+[\d.-]+\s+[\d.-]+\s*(?:\/\s*[\d.]+%?)?\s*\)
 */
export const labPattern = createRegExp(
  exactly('lab')
    .and('(')
    .and(optionalWhitespace)
    .and(numericWithOptionalPercent) // L value
    .and(requiredWhitespace)
    .and(signedNumericValue) // a value (can be negative)
    .and(requiredWhitespace)
    .and(signedNumericValue) // b value (can be negative)
    .and(optionalWhitespace)
    .and(optionalSlashAlpha) // Optional alpha
    .and(optionalWhitespace)
    .and(')'),
  [global, caseInsensitive]
)

// ============================================
// LCH PATTERN
// ============================================

/**
 * LCH color pattern
 * Matches: lch(62 76 40), lch(62% 76 40deg / 0.5)
 * Pattern: lch\(\s*[\d.]+%?\s+[\d.]+\s+[\d.]+(?:deg|rad|grad|turn)?\s*(?:\/\s*[\d.]+%?)?\s*\)
 */
export const lchPattern = createRegExp(
  exactly('lch')
    .and('(')
    .and(optionalWhitespace)
    .and(numericWithOptionalPercent) // L value
    .and(requiredWhitespace)
    .and(numericValue) // C value
    .and(requiredWhitespace)
    .and(numericValue) // H value
    .and(optionalAngleUnit) // Optional angle unit
    .and(optionalWhitespace)
    .and(optionalSlashAlpha) // Optional alpha
    .and(optionalWhitespace)
    .and(')'),
  [global, caseInsensitive]
)

// ============================================
// OKLAB PATTERN
// ============================================

/**
 * OKLAB color pattern
 * Matches: oklab(0.68 0.13 0.11), oklab(68% -0.13 0.11 / 0.5)
 * Pattern: oklab\(\s*[\d.]+%?\s+[\d.-]+\s+[\d.-]+\s*(?:\/\s*[\d.]+%?)?\s*\)
 */
export const oklabPattern = createRegExp(
  exactly('oklab')
    .and('(')
    .and(optionalWhitespace)
    .and(numericWithOptionalPercent) // L value
    .and(requiredWhitespace)
    .and(signedNumericValue) // a value (can be negative)
    .and(requiredWhitespace)
    .and(signedNumericValue) // b value (can be negative)
    .and(optionalWhitespace)
    .and(optionalSlashAlpha) // Optional alpha
    .and(optionalWhitespace)
    .and(')'),
  [global, caseInsensitive]
)

// ============================================
// OKLCH PATTERN
// ============================================

/**
 * OKLCH color pattern
 * Matches: oklch(0.68 0.17 40), oklch(68% 0.17 40deg / 0.5)
 * Pattern: oklch\(\s*[\d.]+%?\s+[\d.]+\s+[\d.]+(?:deg|rad|grad|turn)?\s*(?:\/\s*[\d.]+%?)?\s*\)
 */
export const oklchPattern = createRegExp(
  exactly('oklch')
    .and('(')
    .and(optionalWhitespace)
    .and(numericWithOptionalPercent) // L value
    .and(requiredWhitespace)
    .and(numericValue) // C value
    .and(requiredWhitespace)
    .and(numericValue) // H value
    .and(optionalAngleUnit) // Optional angle unit
    .and(optionalWhitespace)
    .and(optionalSlashAlpha) // Optional alpha
    .and(optionalWhitespace)
    .and(')'),
  [global, caseInsensitive]
)

// ============================================
// EXPORTS
// ============================================

/**
 * Individual patterns for format detection
 */
export const COLOR_REGEX_PATTERNS: Record<string, RegExp> = {
  hex: hexPattern,
  rgb: rgbPattern,
  hsl: hslPattern,
  hwb: hwbPattern,
  lab: labPattern,
  lch: lchPattern,
  oklab: oklabPattern,
  oklch: oklchPattern
}

/**
 * Combined pattern for batch file processing
 * Combines all patterns with OR logic for single-pass matching
 */
export const COMBINED_COLOR_REGEX = createRegExp(
  anyOf(
    // HEX - #fff, #ffff, #ffffff, #ffffffff
    exactly('#')
      .and(anyOf(hexChars.times(8), hexChars.times(6), hexChars.times(4), hexChars.times(3)))
      .and(wordBoundary),

    // RGB/RGBA - rgb(255, 87, 51), rgba(255, 87, 51, 0.5)
    exactly('rgb')
      .and(maybe('a'))
      .and('(')
      .and(optionalWhitespace)
      .and(numericWithOptionalPercent)
      .and(optionalWhitespace)
      .and(separator)
      .and(optionalWhitespace)
      .and(numericWithOptionalPercent)
      .and(optionalWhitespace)
      .and(separator)
      .and(optionalWhitespace)
      .and(numericWithOptionalPercent)
      .and(optionalWhitespace)
      .and(optionalAlpha)
      .and(optionalWhitespace)
      .and(')'),

    // HSL/HSLA - hsl(11, 100%, 60%), hsla(11deg, 100%, 60%, 0.5)
    exactly('hsl')
      .and(maybe('a'))
      .and('(')
      .and(optionalWhitespace)
      .and(numericValue)
      .and(optionalAngleUnit)
      .and(optionalWhitespace)
      .and(separator)
      .and(optionalWhitespace)
      .and(numericWithOptionalPercent)
      .and(optionalWhitespace)
      .and(separator)
      .and(optionalWhitespace)
      .and(numericWithOptionalPercent)
      .and(optionalWhitespace)
      .and(optionalAlpha)
      .and(optionalWhitespace)
      .and(')'),

    // HWB - hwb(11 20% 0%), hwb(11deg 20% 0% / 0.5)
    exactly('hwb')
      .and('(')
      .and(optionalWhitespace)
      .and(numericValue)
      .and(optionalAngleUnit)
      .and(requiredWhitespace)
      .and(numericValue)
      .and('%')
      .and(requiredWhitespace)
      .and(numericValue)
      .and('%')
      .and(optionalWhitespace)
      .and(optionalSlashAlpha)
      .and(optionalWhitespace)
      .and(')'),

    // LAB - lab(62 58 49), lab(62% -58 49 / 0.5)
    exactly('lab')
      .and('(')
      .and(optionalWhitespace)
      .and(numericWithOptionalPercent)
      .and(requiredWhitespace)
      .and(signedNumericValue)
      .and(requiredWhitespace)
      .and(signedNumericValue)
      .and(optionalWhitespace)
      .and(optionalSlashAlpha)
      .and(optionalWhitespace)
      .and(')'),

    // LCH - lch(62 76 40), lch(62% 76 40deg / 0.5)
    exactly('lch')
      .and('(')
      .and(optionalWhitespace)
      .and(numericWithOptionalPercent)
      .and(requiredWhitespace)
      .and(numericValue)
      .and(requiredWhitespace)
      .and(numericValue)
      .and(optionalAngleUnit)
      .and(optionalWhitespace)
      .and(optionalSlashAlpha)
      .and(optionalWhitespace)
      .and(')'),

    // OKLAB - oklab(0.68 0.13 0.11), oklab(68% -0.13 0.11 / 0.5)
    exactly('oklab')
      .and('(')
      .and(optionalWhitespace)
      .and(numericWithOptionalPercent)
      .and(requiredWhitespace)
      .and(signedNumericValue)
      .and(requiredWhitespace)
      .and(signedNumericValue)
      .and(optionalWhitespace)
      .and(optionalSlashAlpha)
      .and(optionalWhitespace)
      .and(')'),

    // OKLCH - oklch(0.68 0.17 40), oklch(68% 0.17 40deg / 0.5)
    exactly('oklch')
      .and('(')
      .and(optionalWhitespace)
      .and(numericWithOptionalPercent)
      .and(requiredWhitespace)
      .and(numericValue)
      .and(requiredWhitespace)
      .and(numericValue)
      .and(optionalAngleUnit)
      .and(optionalWhitespace)
      .and(optionalSlashAlpha)
      .and(optionalWhitespace)
      .and(')')
  ),
  [global, caseInsensitive]
)
