export interface INotification {
  sendNotification(
    title: string,
    body: string,
    tokens: string[]
  ): Promise<void>;
}
