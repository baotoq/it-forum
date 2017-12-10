import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isExist',
})
export class IsExistPipe implements PipeTransform {

  transform(value: any, args: any): boolean {
    if (value === null || args === null) {
      return false;
    }

    const index = value.indexOf(args);
    return index !== -1;
  }
}
