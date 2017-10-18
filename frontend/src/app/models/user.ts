import { Role } from './role';

export class User {
  id: number;
  name: string;
  phone: string;
  birthday: Date;
  avatar: string;
  email: string;
  password: string;
  role: Role;
  confirmedBy: User;
  createdDate: Date;
  updatedDate: Date;

  constructor(obj: User) {
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.phone = obj.phone;
      this.birthday = obj.birthday;
      this.avatar = obj.avatar;
      this.email = obj.email;
      this.password = obj.password;
      this.role = obj.role;
      this.confirmedBy = obj.confirmedBy;
      this.createdDate = obj.createdDate;
      this.updatedDate = obj.updatedDate;
    }
  }
}
