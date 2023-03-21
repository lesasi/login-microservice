import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class EncodingService {
  constructor(
    protected readonly configService: ConfigService,
  ) {}

  // In future, use JWT or any other verifying library
  async encodeId(_id: string) {
    const jwtSecret = this.configService.get('jwtSecret');
    const token = `${_id}:${Date.now()}`;
    return token;
  }

  async decodeId(hash: string) {
    const jwtSecret = this.configService.get('jwtSecret');
    const _id = hash.split(':')[0];
    return _id;
  }

  async createHashFromString(s: string) {
    const hash = await bcrypt.hash(s, 10);
    return hash;
  }
  
  // Comparison of passwords - in future, use Hashes
  async compareStringWithHash(s: string, hash: string) {
    const result = await bcrypt.compare(s, hash);
    return result;
  }

  // In the future, use JWT, or some other encoding/decoding
  async encodeObjectToString(obj: Object) {
    const jwtSecret: string = this.configService.get('jwtSecret');
    const encodedObject = jwt.sign(obj, jwtSecret);
    return encodedObject;
  }

  async decodeStringToObject<T>(s: string) {
    const jwtSecret = this.configService.get('jwtSecret');
    try {
      const verified = jwt.verify(s, jwtSecret);
      console.log('decoded object ', verified)
      return {
        success: verified as T,
      };
    } catch (error) {
      return {
        error: 'INVALID_JWT_SIGNATURE'
      };
    }
  }
}