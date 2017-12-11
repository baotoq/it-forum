import { Pipe, PipeTransform } from '@angular/core';
import { Management } from '../../../models/management';
import { User } from '../../../models/user';

@Pipe({
  name: 'isManagement',
})
export class IsManagementPipe implements PipeTransform {

  transform(value: User, management: Management[]): boolean {
    if (value === null || management === null) {
      return false;
    }

    const index = management.findIndex(item => item.userId == value.id);
    return index !== -1;
  }
}
