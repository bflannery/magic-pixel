export default class Events {
  constructor() {}

  onReady(f: Function): Function | void {
    if (document.body != null) {
      return f()
    } else {
      setTimeout(() => {
        this.onReady(f)
      }, 10)
    }
  }

  onEvent(el: Element | Window, type: string, capture: boolean | undefined, f_: Function) {

    const fixUp = (f: Function) => (e: Event) => {
      let retVal

      if (!e.preventDefault) {
        e.preventDefault = function() {
          retVal = false
        }
      }
      return f(e) || retVal
    }

    const f = fixUp(f_)

    if (el.addEventListener) {
      el.addEventListener(type, f, capture)
    } else { // @ts-ignore
      if (el.attachEvent)  {
        // @ts-ignore
        el.attachEvent('on' + type, f)
      }
    }
  }
}
