/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};
