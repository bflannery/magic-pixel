function scriptIsHTML(script: HTMLScriptElement): script is HTMLScriptElement {
  return 'src' in script
}

export function getHostId(script: HTMLScriptElement | null): string | null {
  if (window.MP_HID) {
    return window.MP_HID
  }
  if (!script) {
    console.error('MP: script requires being loaded from magic pixel source')
    return null
  }
  if (!scriptIsHTML(script)) {
    console.error('MP: Invalid element type')
    return null
  }

  const url = new URL(script.src)
  return url.searchParams.get('hid')
}
