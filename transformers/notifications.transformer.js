export default function notificationsTransformer(data) {
  // const keys = Object.keys(data).reverse();

  return data.map((notif) => ({
    ...notif,
    month: notif.month.trim(),
    date: notif.createdAt,
    text: notif.message,
    image: notif.notifImageUrl,
  }));
}
