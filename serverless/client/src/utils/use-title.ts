import { useEffect } from 'react'

export default function useTitle(titleExtension = ''): void {
  const lc = 'LoudCrowd'
  useEffect(() => {
    document.title = titleExtension === '' ? lc : titleExtension + ' - ' + lc
  }, [titleExtension])
}
