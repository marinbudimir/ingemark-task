import { createHash } from "crypto";

const IM_SECRET = process.env.IM_SECRET || "unsafe_secret";

export const hashEmail = (email: string): string => {
  const hash = createHash("sha256");
  hash.update(email + IM_SECRET);
  return hash.digest("hex");
};
