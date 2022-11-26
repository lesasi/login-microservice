import { Injectable } from "@nestjs/common";

@Injectable()
export class EncodingService {
  constructor() {}

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