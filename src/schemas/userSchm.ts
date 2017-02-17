import { Schema } from "mongoose";

export var userSchema: Schema = new Schema({
  createdAt: Schema.Types.Date,
  email: Schema.Types.String,
  firstName: Schema.Types.String,
  lastName: Schema.Types.String
});
userSchema.pre("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});