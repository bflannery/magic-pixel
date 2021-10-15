function scriptIsHTML(script: HTMLOrSVGScriptElement): script is HTMLScriptElement {
  return 'src' in script
}

export function getHostId(script: HTMLOrSVGScriptElement | null): string | null {
  if (window.MP_HID) {
    return window.MP_HID
  }
  if (!script) {
    console.error('MP: script requires being loaded from mp source')
    return null
  }
  if (!scriptIsHTML(script)) {
    console.error('MP: mp does not support SVG scripts.')
    return null
  }

  const url = new URL(script.src)
  return url.searchParams.get('hid')
}


export function getDiffDaysFromTimestamp(time1: number, time2: number) {
  const timeDiff = time1 - time2;
  return timeDiff / (1000 * 3600 * 24);
}
