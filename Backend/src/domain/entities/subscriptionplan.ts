import { ObjectId } from "mongoose";

export interface ISubscriptionPlan {
  _id: ObjectId;
  name: string;          
  price: number;        
  maxPackages: number;   
  duration: number;      
  features: string[];    
}
