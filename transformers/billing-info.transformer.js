import planDetailsTransformer from "./planDetails.transformer";
import billingContactDetailsTransformer from './billingContactDetails.transformer';
import paymentDetailsTransformer from "./paymentDetails.transformer";

export default function billingInfoTransformer(data) {
  return ({
    planDetails: planDetailsTransformer(data?.planDetails),
    paymentDetails: paymentDetailsTransformer(data?.paymentDetails),
    billingContactDetails: billingContactDetailsTransformer(data?.billingContactDetails)
  })
}
