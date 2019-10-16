export function square({row, column}: {row: number, column: number}): string {
  return String.fromCharCode(97 + column) + String.fromCharCode(56 - row)
}
