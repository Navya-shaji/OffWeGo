export interface IReadNotificationusecase {
  execute(id: string): Promise<boolean>;
}
