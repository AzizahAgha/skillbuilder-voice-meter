
export default function expandableTransformer(items) {
  return items.map(item => ({
    ...item,
    expanded: false,
  }))
}
