// anime-test.js
import * as Animejs from "animejs";

// Filter only the actual functions/objects
const componentNames = Object.keys(Animejs).filter(
  (key) =>
    typeof Animejs[key] === "function" ||
    typeof Animejs[key] === "object"
);

console.log("Anime.js components:", componentNames);

// Create scope
const animejsScope = componentNames.reduce((acc, name) => {
  acc[name] = Animejs[name];
  return acc;
}, {});

console.log("animejsScope keys:", Object.keys(animejsScope));
