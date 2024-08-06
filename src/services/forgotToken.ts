import { randomBytes } from "crypto";

const forgotToken: Record<
  string,
  | {
      token: string;
      expired: number;
    }
  | undefined
> = {};

export function clearToken(email: string) {
  forgotToken[email] = undefined;
}

export function createToken(email: string) {
  const token = randomBytes(64).toString("hex");
  forgotToken[email] = {
    expired: Date.now() + 60 * 60 * 1000,
    token,
  };
  return token;
}

export function validateToken({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const item = forgotToken[email];
  if (!item) return false;
  if (item.token != token) return false;
  if (Date.now() > item.expired) return false;
  return true;
}
