import * as FaIcons from "react-icons/fa"

// Filter only actual components (functions or objects)
const faComponentNames = Object.keys(FaIcons).filter(
  (key) =>
    typeof (FaIcons as any)[key] === "function" ||
    typeof (FaIcons as any)[key] === "object"
)

// Create the scope
export const reactIconsFaScope = faComponentNames.reduce((acc, name) => {
  acc[name] = (FaIcons as any)[name]
  return acc
}, {} as Record<string, any>)
