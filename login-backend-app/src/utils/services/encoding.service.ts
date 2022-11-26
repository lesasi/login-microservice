import { Injectable } from "@nestjs/common";

@Injectable()
export class EncodingService {
  constructor() {}

    // In future, use JWT or any other verifying library
    async encodeId(_id: string) {
    const token = `${_id}:${Date.now()}`;
    return token;
  }

  async decodeId(hash: string) {
    const _id = hash.split(':')[0];
    return _id;
  }
  
  // Comparison of passwords - in future, use Hashes
  async comparePassword(password: string, userPassword: string) {
    return password === userPassword;
  }

  // In the future, use JWT, or some other encoding/decoding
  async encodeObject(obj: Object) {
    const encodedObject = JSON.stringify(obj);
    return encodedObject;
  }

  async decodeToObject(state: string) {
    const decodedObject = JSON.parse(state);
    return decodedObject;
  }
}