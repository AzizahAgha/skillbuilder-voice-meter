import { useQuery } from "react-query";
import notificationService from "@services/notification.service";
import { useTeam } from "@contexts/TeamContext";
import Bus from "@utils/Bus";
import { useAuthUser } from "@contexts/AuthContext";

export const getNotificationUpdates = () => {
	const { team } = useTeam();
	const { auth } = useAuthUser();
	const teamId = team?.id;
	return useQuery(
		["notificationUpdates", { teamId }],
		() => notificationService.getNotificationUpdates(teamId),
		{
			enabled: !!auth?.token,
			refetchInterval: 60000
		},
		{
            onSuccess: async (res) => {
                //console.log(res)
            },
			onError:(error) => {
				Bus.emit("error", { operation: "open",error:error.response});
			}
        }
	);
};

