import * as LucideIcons from "lucide-react"

// Create scope with only the actual components using type assertion
const componentNames = Object.keys(LucideIcons).filter(
  (key) =>
    typeof (LucideIcons as any)[key] === "function" ||
    typeof (LucideIcons as any)[key] === "object"
)

// Create scope with type assertion
export const lucideScope = componentNames.reduce((acc, name) => {
  acc[name] = (LucideIcons as any)[name]
  return acc
}, {} as Record<string, any>)
