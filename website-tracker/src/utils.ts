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


export function getDiffFromTimestamp(time1: number, time2: number, scope: 'days' | 'hours' | 'mins') {
  const timeDiff = time1 - time2;

  if (scope === 'days') {
    return timeDiff / (1000 * 3600 * 24);
  } else if (scope === 'hours') {
    return timeDiff / (60 * 60 * 1000);
  } else {
    return timeDiff / (60 * 1000);
  }
}

export function uuidv4() {
  var s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
