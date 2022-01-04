import {toObject} from "./utils";

export const getAncestors = (node: any) => {
  let cur = node
  const result = []

  while (cur && cur !== document.body) {
    result.push(cur)
    cur = cur.parentNode
  }

  return result
}



interface datasetInterface {
  [key: string]: {
    name: string,
    value: string | number
  }
}

export const getDataset = (node: any) => {
  if (node.dataset && typeof node.dataset !== 'undefined' && Object.keys(node).length > 0) {
    return toObject(node.dataset)
  } else if (node.attributes) {
    const dataset: datasetInterface = {}

    const attrs = node.attributes

    for (let i = 0; i < attrs.length; i++) {

      const attrItem = attrs.item(i)
      const name = attrItem.name
      const value = attrItem.value

      dataset[`data-${name}`] = {
        name: name,
        value: value
      }
    }
    return dataset
  } else return {}
}

export const genCssSelector = (node: any): string => {
  let sel = ''

  while (node !== document.body) {
    let id = node.id
    let classes = typeof node.className === 'string' ?
      node.className.trim().split(/\s+/).join(".") : ''
    const tagName = node.nodeName.toLowerCase()

    if (id && id !== "") id = '#' + id
    if (classes !== "") classes = '.' + classes

    const prefix = tagName + id + classes

    const parent = node.parentNode

    let nthchild = 1

    for (let i = 0; i < parent.childNodes.length; i++) {
      if (parent.childNodes[i] === node) break
      else {
        const childTagName = parent.childNodes[i].tagName
        if (childTagName !== undefined) {
          nthchild = nthchild + 1
        }
      }
    }

    if (sel !== '') sel = '>' + sel

    sel = prefix + ':nth-child(' + nthchild + ')' + sel

    node = parent
  }
  return sel
}

export const getNodeDescriptor = (node: any) => {
  console.log({ nodeDescriptorNode: node })
  return {
    id:         node.id,
    selector:   genCssSelector(node),
    title:      node.title === '' ? undefined : node.title,
    data:       getDataset(node)
  }
}
