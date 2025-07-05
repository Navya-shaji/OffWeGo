export interface ITokenService {
  generateToken(payload: object): string;
}