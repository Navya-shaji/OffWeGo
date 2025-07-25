import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IGetAllUser } from "../../../domain/interface/admin/IGetAllUsers";
import { IUpdateUserUseCase } from "../../../domain/interface/admin/IUpdateUserUseCase";

export class AdminUserController{
    constructor(
        private getAllUserUseCase:IGetAllUser,
        private updateUserStatusUseCase:IUpdateUserUseCase
    ){}

    async getAllUsers(req:Request,res:Response):Promise<void>{
        try {
            
        } catch (error) {
            
        }
    }
}