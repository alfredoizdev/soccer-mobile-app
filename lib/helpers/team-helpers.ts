/**
 * Converts a team name to a 3-letter abbreviation
 */
export function getTeamAbbreviation(teamName: string): string {
  if (!teamName) return ''

  // Remove common suffixes and get first word
  const cleanName = teamName
    .replace(/\s+(FC|CF|CLUB|FOOTBALL|SOCCER)$/i, '')
    .trim()
    .toUpperCase()

  const firstWord = cleanName.split(' ')[0] || cleanName

  // Return first 3 letters
  return firstWord.substring(0, 3)
}
