import CryptoJS from 'crypto-js';

export class PasswordEncryptionService {

  constructor(private readonly key: string) {
    this.key = key;
  }

  encrypt(msg: string) {
    const iv = crypto.getRandomValues(new Uint8Array(16));

    const encrypted = CryptoJS.AES.encrypt(msg, this.key, {
      iv,
      mode: CryptoJS.mode.CBC,
    });

    // Store the iv with the other encrypted text
    const storeIv = iv.toString() + '\n';
    return storeIv + encrypted.toString();
  }

  decrypt(cipherText: string) {
    // Get the first line as the IV and the rest as the ciphertext
    const [ivStr, cipher] = cipherText.split('\n');
    const iv = ivStr.split(',');
    const decrypted = CryptoJS.AES.decrypt(cipher, this.key, {
      iv,
      mode: CryptoJS.mode.CBC,
    });

    const base64 = decrypted.toString();

    return atob(base64);
  }
}
