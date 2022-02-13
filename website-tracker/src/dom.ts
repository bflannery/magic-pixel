import {createDOMMap, toObject, toObjectInterface} from './utils'
import EventHandler from './handler'
import {
  DomAttributeType,
  DomElementType,
  DomLinkType,
  DomMapType,
  MPEventForm,
  MPGenericEvent,
  MPKeyboardEvent
} from './types'

export const getAncestors = (node: any): Element[] => {
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
    name: string
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
        value: value,
      }
    }
    return dataset
  } else return {}
}

export const genCssSelector = (node: any): string => {
  let sel = ''

  while (node !== document.body) {
    let id = node.id
    let classes = typeof node.className === 'string' ? node.className.trim().split(/\s+/).join('.') : ''
    const tagName = node.nodeName.toLowerCase()

    if (id && id !== '') id = '#' + id
    if (classes !== '') classes = '.' + classes

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
  return {
    id: node.id,
    selector: genCssSelector(node),
    title: node.title === '' ? null : node.title,
    data: getDataset(node),
  }
}

export const simulateMouseEvent = (
  element: Element | EventTarget,
  eventName: string,
  options: toObjectInterface = {},
) => {
  const eventMatchers: { [key: string]: RegExp } = {
    HTMLEvents: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    MouseEvents: /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/,
  }

  const mergedOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true,
    ...options,
  }

  let oEvent: Event | null = null
  let eventType = null

  for (let name in eventMatchers) {
    if (eventMatchers[name].test(eventName)) {
      eventType = name
      break
    }
  }

  if (!eventType) {
    throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported')
  }

  const evt = eventType === 'HTMLEvents' ? new Event('HTMLEvent') : new MouseEvent('MouseEvent')

  oEvent = {
    ...evt,
    ...mergedOptions,
  }

  try {
    element.dispatchEvent(oEvent)
  } catch (e) {
    // IE nonsense:
    console.error(e)
  }

  return element
}

export const getFormData = (eventForm: MPEventForm) => {
  let acc: toObjectInterface = {}

  const setField = (name: string, value: string) => {
    if (name === '') name = 'anonymous'

    const oldValue = acc[name]

    if (oldValue != null) {
      if (oldValue instanceof Array) {
        acc[name].push(value)
      } else {
        acc[name] = [oldValue, value]
      }
    } else {
      acc[name] = value
    }
  }

  for (let i = 0; i < eventForm.elements.length; i++) {
    const child = eventForm.elements[i]
    const nodeType = child.tagName.toLowerCase()

    if (nodeType == 'input' || nodeType == 'textfield') {
      // INPUT or TEXTFIELD element.
      // Make sure auto-complete is not turned off for the field:
      if ((child.getAttribute('autocomplete') || '').toLowerCase() !== 'off') {
        // Make sure it's not a password:
        if (child.type !== 'password') {
          // Make sure it's not a radio or it's a checked radio:
          if (child.type !== 'radio' || child.checked) {
            let childKey = ''
            if (child.name) {
              childKey = child.name
            } else if (child.labels && child.labels.length > 0) {
              childKey = child.labels.join('')
            } else if (child.id) {
              childKey = child.id
            }
            setField(childKey, child.value)
          }
        }
      }
    } else if (nodeType == 'select') {
      // SELECT element:
      const option = child.options[child.selectedIndex]

      setField(child.name, option.value)
    }
  }
  return { formFields: acc }
}

export const monitorElements = (tagName: string, onNew: Function, refresh?: number): void => {
  refresh = refresh || 50

  const checker = () => {
    const curElements = document.getElementsByTagName(tagName)

    for (let i = 0; i < curElements.length; i++) {
      const el = curElements[i]

      const scanned = el.getAttribute('mp_scanned')

      if (!scanned) {
        el.setAttribute('mp_scanned', 'true')
        try {
          onNew(el)
        } catch (e) {
          console.error(e)
        }
      }
    }
    setTimeout(checker, refresh)
  }
  setTimeout(checker, 0)
}

export const onReady = (f: Function): Function | void => {
  if (document.body != null) {
    return f()
  } else {
    setTimeout(() => {
      onReady(f)
    }, 10)
  }
}

export const onEvent = (el: Element | Window, type: string, capture: boolean | undefined, f_: Function): void => {
  const fixUp = (f: Function) => (e: Event) => {
    let retVal

    if (!e.preventDefault) {
      e.preventDefault = function () {
        retVal = false
      }
    }
    return f(e) || retVal
  }

  const f = fixUp(f_)

  if (el.addEventListener) {
    el.addEventListener(type, f, capture)
  } else {
    console.log('No Event listener')
    // @ts-ignore
    if (el.attachEvent) {
      // @ts-ignore
      el.attachEvent('on' + type, f)
    }
  }
}

export const onSubmit = (f_: Function): void => {
  const handler = new EventHandler()
  onReady(() => {
    console.log('On Submit Ready')
    onEvent(document.body, 'submit', true, (e: MPGenericEvent) => {
      console.log('On Submit Type')
      handler.dispatch(e)
    })

    // Intercept enter keypresses which will submit the form in most browsers.
    onEvent(document.body, 'keypress', false, (e: MPKeyboardEvent) => {
      console.log('On Keypress Type')
      if (e.keyCode == 13) {
        const target = e.target
        const form: MPEventForm | null = (target && target.form) || null

        if (form) {
          e.form = form
          handler.dispatch(e)
        }
      }
    })

    // Intercept clicks on any buttons:
    onEvent(document.body, 'click', false, (e: MPGenericEvent) => {
      console.log('On Click Type')
      const target = e.target
      const targetType = ((target && target.type) || '').toLowerCase()

      if (target && target.form && (targetType === 'submit' || targetType === 'button')) {
        e.form = target.form
        if (e.form?.id) {
          e.form.formId = e.form.id
        } else if (e.form.name) {
          e.form.formId = e.form.name
        }
        handler.dispatch(e)
      }
    })
  })
  handler.push(f_)
}
