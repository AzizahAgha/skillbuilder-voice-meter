
export default function transformTeam(team) {
  return ({
    ...team,
    id: team?.teamId || team.id,
    name: team.teamName,
    displayName: team?.displayName || team?.teamDisplayName,
  })
}
