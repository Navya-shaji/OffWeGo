export interface IdeleteActivity{
    execute(id:string):Promise<{success:boolean;message:string}>
}