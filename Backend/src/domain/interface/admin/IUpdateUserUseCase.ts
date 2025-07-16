
export interface IUpdateUserUseCase {
  execute(userId: string, status: "active" | "block"): Promise<void>;
}
