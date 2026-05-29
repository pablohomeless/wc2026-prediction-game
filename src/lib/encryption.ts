import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const KEY_LENGTH = 32;

function getKey(): Buffer {
  const key = process.env.EMAIL_ENCRYPTION_KEY;
  if (!key || key.length < KEY_LENGTH) {
    throw new Error("EMAIL_ENCRYPTION_KEY must be at least 32 characters");
  }
  return Buffer.from(key.substring(0, KEY_LENGTH), "utf8");
}

export function encryptEmail(plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptEmail(ciphertext: string): string {
  const [ivHex, encHex] = ciphertext.split(":");
  if (!ivHex || !encHex) throw new Error("Invalid ciphertext format");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

export function hashEmail(email: string): string {
  return crypto.createHash("sha256").update(email.toLowerCase().trim()).digest("hex");
}

// Generate a random 8-character password
export function generateRandomPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  let password = "";
  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 8; i++) {
    password += chars[bytes[i] % chars.length];
  }
  return password;
}
