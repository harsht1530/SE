export class DecryptionHelper{
    constructor(secretKey){
        // convert base64 key to array buffer
        this.secretKey = this.base64ToArrayBuffer(secretKey);
    }

    base64ToArrayBuffer(base64){
        // decode base64 string to binary string
        const binaryString = window.atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        // convert binary string to array buffer
        for(let i=0;i<binaryString.length;i++){
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
    arrayBufferToBase64(buffer){
        // bytes -> binary -> base64
        const bytes = new Uint8Array(buffer)
        let binary = '';
        for(let i=0;i<bytes.byteLength;i++){
            binary += String.fromCharCode(bytes[i]);

        }
        return window.btoa(binary);
    }

    bytesToNumber(bytes) {
        let result = 0;
        for (let i = 0; i < bytes.length; i++) {
          result = result * 256 + bytes[i];
        }
        return result;
      }

    async decryptResponse(encryptedData){
        try{
            // decode the base64 string to the array buffer 
            const encryptedBuffer = this.base64ToArrayBuffer(encryptedData)
            const encryptedArray = new Uint8Array(encryptedBuffer);

            const iv = encryptedArray.slice(0,12);
            const ciphertext = encryptedArray.slice(12,-16)
            const authTag = encryptedArray.slice(-16);

            const cryptoKey = await window.crypto.subtle.importKey(
                'raw',
                this.secretKey,
                {name:'AES-GCM'},
                false,
                ['decrypt']

            )

            const decryptedBuffer = await window.crypto.subtle.decrypt(
                {
                    name:'AES-GCM',
                    iv:iv,
                    tagLength:128
                },
                cryptoKey,
                new Uint8Array([...ciphertext,...authTag])
            )

            const decryptedArray = new Uint8Array(decryptedBuffer);

            const timestamp = this.bytesToNumber(decryptedArray.slice(0,8));

            const nonce = decryptedArray.slice(8,16)

            const jsonPayload = new TextDecoder().decode(decryptedArray.slice(16));

            const data = JSON.parse(jsonPayload);

            const currentTime = Date.now();
            const timeDiff = Math.abs(currentTime - timestamp);

            if (timeDiff > 60000) {
                console.warn('Response timestamp is older than 60 seconds');
            }

            return {
                success: true,
                data: data,
                timestamp: timestamp,
                nonce: this.arrayBufferToBase64(nonce.buffer)
              };


        }catch(error){
            console.error('Decryption failed:', error);
            return {
              success: false,
              error: error.message
            }
        }
    }
}