import { Pipe, PipeTransform } from '@angular/core';
import { Management } from '../../../models/management';
import { User } from '../../../models/user';

@Pipe({
  name: 'isManagement',
})
export class IsManagementPipe implements PipeTransform {

  transform(value: Management[], user: User): boolean {
    if (value === null || user === null) {
      return false;
    }

    const index = value.findIndex(item => item.userId == user.id);
    return index !== -1;
  }
}
