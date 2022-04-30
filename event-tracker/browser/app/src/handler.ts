import { MPGenericEvent } from './types'

export default class EventHandler {
  handler: Function[]

  constructor() {
    this.handler = []
  }

  push(f: Function) {
    this.handler.push(f)
  }

  dispatch(e: MPGenericEvent) {
    const args = Array.prototype.slice.call(arguments, 0)
    for (let i = 0; i < this.handler.length; i++) {
      try {
        this.handler[i].apply(null, args)
      } catch (e) {
        console.error(e)
      }
    }
  }
}
