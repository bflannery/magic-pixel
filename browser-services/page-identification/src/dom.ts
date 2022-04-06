export const getAncestors = (node: any): Element[] => {
  let cur = node
  const result = []

  while (cur && cur !== document.body) {
    result.push(cur)
    cur = cur.parentNode
  }
  return result
}