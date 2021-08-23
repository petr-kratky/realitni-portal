export function capitalize(string: string): string {
    const capitalLetter = string[0].toUpperCase()
    return capitalLetter + string.substr(1)
  }
  