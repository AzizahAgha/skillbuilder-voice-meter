
export default function planDetailsTransformer(data) {
  return {
    ...data,
    id: data?.planId,
    name: data?.planName,
    type: data?.planType,
    allocatedSeats: data?.allocatedSeats,
    charges: data?.planCharges,
    renewalDate: data?.renewalDate,
    totalSeats: data?.totalSeats,
  }
}
