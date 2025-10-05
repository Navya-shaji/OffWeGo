export interface Flight{
    id?:string;
    date:Date;
    fromLocation:string;
    toLocation:string;
    airLine:string;
    price:number;
    createdAt?:Date;
    updatedAt?:Date;
}