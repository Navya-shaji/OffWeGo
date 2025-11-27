export interface ICacheService {
  setValue(key: string, value: string): Promise<void>;
  setWithExpiry(key: string, value: string, time: number): Promise<void>;
  getValue(key: string): Promise<string | null>;
  deleteValue(key: string): Promise<void>;
}
