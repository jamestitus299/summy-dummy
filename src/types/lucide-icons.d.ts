/**
 * lucide-react ships no declarations for its individual icon files, only for
 * the barrel entry. The lazy scope imports them one at a time (see
 * src/scopes/generated/lucideIconMap.ts), so without this every one of the
 * ~1650 dynamic imports raises TS7016.
 */
declare module 'lucide-react/dist/esm/icons/*' {
  import type { LucideIcon } from 'lucide-react'

  const icon: LucideIcon
  export default icon
}
