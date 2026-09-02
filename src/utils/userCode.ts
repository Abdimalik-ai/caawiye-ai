// Unique 6-character user code generator (starts with cw + 4 digits: e.g. cw7492)
export function generateUserCode(): string {
  const existing = localStorage.getItem('caawiye_user_code');
  if (existing && existing.startsWith('cw') && existing.length === 6) {
    return existing;
  }
  const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
  const newCode = `cw${randomDigits}`;
  localStorage.setItem('caawiye_user_code', newCode);
  return newCode;
}

export function getUserCode(): string | null {
  return localStorage.getItem('caawiye_user_code');
}

export function setUserCode(code: string): void {
  localStorage.setItem('caawiye_user_code', code);
}

export function clearUserCode(): void {
  localStorage.removeItem('caawiye_user_code');
}
