import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return timingSafeEqual(Buffer.from(hash), Buffer.from(key));
}
