export interface TokenRepository {
  sign(payload: string | object | Buffer, expiresIn: string | number): string;
  verify(token: string): string | object;
}
