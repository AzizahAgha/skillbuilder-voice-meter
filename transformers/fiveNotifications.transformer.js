
export default function fiveNotificationsTransformer(res) {
  return ({
    unreadCount: res.unReadCount,
    data: res.data.map(notif => ({
      ...notif,
      date : notif.createdAt,
      text: notif.message,
      image: notif.notifImageUrl,
    }))
  })
}
