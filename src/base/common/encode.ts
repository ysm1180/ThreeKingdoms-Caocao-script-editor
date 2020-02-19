export function encodeToBase64(data: Buffer): string {
  if (data && data.length > 0) {
    const base64 = data.toString('base64');

    return base64;
  }

  return '';
}

export function decodeFromBase64(base64: string): Uint8Array {
  let str = window.atob(base64);
  let len = str.length;
  let bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}
