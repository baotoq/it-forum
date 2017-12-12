import { Role } from './role';
import { Timestamp } from './timestamp';
import { ApprovalStatus } from './approval-status';

export class User extends Timestamp {
  id: number;
  name: string;
  phone: string;
  birthday: Date;
  avatar: string;
  email: string;
  password: string;
  role: Role;
  confirmedBy: User;
  approvalStatus: ApprovalStatus;

  constructor(obj?) {
    super(obj);
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
    }
  }
}
