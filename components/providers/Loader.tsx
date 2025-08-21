// app/providers.tsx
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

export function ProgressBarProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    nProgress.start()
    nProgress.done()
  }, [pathname]) // runs on route changes & first load

  return <>{children}</>
}
