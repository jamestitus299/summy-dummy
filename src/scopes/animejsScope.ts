import * as Animejs from "animejs";

// Create scope with only the actual components using type assertion
const componentNames = Object.keys(Animejs).filter(
  (key) =>
    typeof (Animejs as any)[key] === "function" ||
    typeof (Animejs as any)[key] === "object"
);

// Create scope with type assertion
export const animejsScope = componentNames.reduce((acc, name) => {
  acc[name] = (Animejs as any)[name];
  return acc;
}, {} as Record<string, any>);
