
export default function billingContactDetailsTransformer(data) {
  return {
    id: data?.id || '',
    teamId: data?.teamId || '',
    email: data?.blEmail || '',
    firstName: data?.blFirstName || '',
    lastName: data?.blLastName || '',
    companyName: data?.blCompanyName || '',
    phone: data?.blPhone || '',
    address: data?.blAddress || '',
    unit: data?.blUnit || '',
    city: data?.blCity || '',
    state: data?.blState || '',
    country: data?.blCountry || '',
    zipcode: data?.blZipCode || '',
    taxId: data?.blTaxId || '',
    isCompanyAddress: data?.isCompanyAddress || false
  }
}
