import { Document, Connection, createConnection, Model } from "mongoose";
import { IUser } from "../interfaces/user";
import { userSchema } from '../schemas/userSchm';
import { MongoConnection } from '../dbconnection/mongodb';

export interface IUserModel extends IUser, Document {
  //custom methods for your model would be defined here
}

export class User {
  public id: string;
  public email: string;
  public firstName: string;
  public lastName: string;

  constructor(obj?: any) {
    if (obj) {
      if (obj.id) { this.id = obj.id }
      if (obj.email) { this.id = obj.email }
      if (obj.firstName) { this.id = obj.firstName }
      if (obj.lastName) { this.id = obj.lastName }
    }
  }

}

export class UserController {
  public userModel: Model<IUserModel>;
  constructor() {
    this.userModel =new MongoConnection('User',userSchema).model;
  }

  get users() {
    return this.userModel.find()
  }
  getUser(id: string) {
    return this.userModel.findOne({ _id: id });
  }
  getUserByFirstName(value: string) {
    return this.userModel.findOne({ firstName: value })
  }
}