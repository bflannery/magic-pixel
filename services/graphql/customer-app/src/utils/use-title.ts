import { useEffect } from 'react'

export default function useTitle(titleExtension = ''): void {
  const mp = 'Magic Pixel'
  useEffect(() => {
    document.title = titleExtension === '' ? mp : titleExtension + ' - ' + mp
  }, [titleExtension])
}
