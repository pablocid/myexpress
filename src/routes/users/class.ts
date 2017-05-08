export class User {
  public id: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public password:string;

  constructor(obj?: any) {
    if (obj) {
      if (obj.id) { this.id = obj.id }
      if (obj.email) { this.id = obj.email }
      if (obj.firstName) { this.id = obj.firstName }
      if (obj.lastName) { this.id = obj.lastName }
    }
  }

}