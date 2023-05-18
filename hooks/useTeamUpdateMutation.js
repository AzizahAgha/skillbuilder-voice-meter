import teamService from "@services/team.service";
import { useMutation } from "react-query";
import { useTeam } from "@contexts/TeamContext";

export default function useTeamUpdateMutation(image) {
  const { team, setTeam } = useTeam();

  return useMutation(({ id, data }) => teamService.update(id, data), {
    onMutate: (req) => {
      const { teamName } = req.data.teamDetails;
      setTeam((_team) => ({
        ..._team,
        displayName: teamName,
        logoUrl: image || team?.logoUrl,
      }));
    },
  });
}
