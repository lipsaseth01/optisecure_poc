const crypto = require('crypto');

class KyberMock {
  constructor() {
    this.keyPair = this.generateKeyPair();
  }

  generateKeyPair() {
    const privateKey = crypto.randomBytes(32).toString('hex');
    const publicKey = crypto.createHash('sha256').update(privateKey).digest('hex');
    return { privateKey, publicKey };
  }

  encrypt(data, publicKey) {
    const buffer = Buffer.from(data);
    const key = Buffer.from(publicKey, 'hex').slice(0, buffer.length);
    const encrypted = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      encrypted[i] = buffer[i] ^ key[i]; // XOR-based mock
    }
    return encrypted.toString('base64');
  }

  decrypt(encryptedData, privateKey) {
    const buffer = Buffer.from(encryptedData, 'base64');
    const key = Buffer.from(
      crypto.createHash('sha256').update(privateKey).digest('hex'),
      'hex'
    ).slice(0, buffer.length);
    const decrypted = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      decrypted[i] = buffer[i] ^ key[i]; // XOR-based mock
    }
    return decrypted.toString();
  }
}

module.exports = {
  encryptData: (data, publicKey) => {
    const kyber = new KyberMock();
    const start = performance.now();
    const encrypted = kyber.encrypt(data, publicKey);
    const time = performance.now() - start;
    return { encrypted, time };
  },
  decryptData: (encryptedData, privateKey) => {
    const kyber = new KyberMock();
    const start = performance.now();
    const decrypted = kyber.decrypt(encryptedData, privateKey);
    const time = performance.now() - start;
    return { decrypted, time };
  },
  generateKeyPair: () => {
    const kyber = new KyberMock();
    return kyber.keyPair;
  }
};