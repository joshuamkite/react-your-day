import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // The app fetches from external APIs (Wikimedia, Open-Meteo) using a
      // plain useEffect + loading-flag pattern. Properly satisfying this
      // rule everywhere would mean adopting a data-fetching library
      // (SWR/React Query); until then, keep it visible as a warning rather
      // than silence it outright.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
