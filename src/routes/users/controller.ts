import { Model } from "mongoose";
import { IUser, IUserModel } from "./interface";
import { MongoConnection } from '../../dataconnection/mongodb';
import { UserSchema } from './schema';

export class UserController {
  public userModel: Model<IUserModel>;
  constructor() {
    this.userModel =new MongoConnection('User',UserSchema).model;
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