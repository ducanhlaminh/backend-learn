const NodeRSA = require("node-rsa");

// generate keys
const key = new NodeRSA().generateKeyPair();
const publicKey = key.exportKey("pkcs8-public-pem");
const privateKey = key.exportKey("pkcs1-pem");

console.log("Private Key:");
console.log(privateKey);
console.log("-----------------------------------------------------");
console.log("Public Key:");
console.log(publicKey);
