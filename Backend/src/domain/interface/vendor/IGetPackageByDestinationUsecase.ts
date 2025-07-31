export interface IGetPackageUsecase {
  execute(destination?: string): Promise<any>;
}
