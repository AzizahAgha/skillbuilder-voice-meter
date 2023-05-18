
export default function invoiceTransformer(invoices) {
  return invoices.map(invoice => ({
    ...invoice,
    expanded: false,
    id: Math.floor(100000 + Math.random() * 900000)
  }))
}
