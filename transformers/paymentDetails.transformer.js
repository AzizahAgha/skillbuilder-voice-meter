export default function paymentDetailsTransformer(data) {
  return {
    email: data?.billingEmail || "",
    card: data?.card || null,
  };
}
