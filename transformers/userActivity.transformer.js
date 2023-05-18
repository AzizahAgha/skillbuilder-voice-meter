
export default function userActivityTransformer(activities) {
  return activities.map(activity => ({
    ...activity,
    user: {
      id: activity.userId,
      firstName: activity.firstName,
      lastName: activity.lastName,
      picture: activity.userProfileUrl,
      title: activity.title,
      department: activity.department,
    },
    expanded: false,
  }))
}
