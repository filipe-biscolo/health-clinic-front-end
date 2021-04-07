import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'personAge'
})
export class PersonAgePipe implements PipeTransform {

  transform(value: Date, ...args: unknown[]): string {
    let birthDate = value;
    let age: number;

    if (birthDate) {
      let timeDiff = Math.abs(Date.now() - new Date(birthDate).getTime());
      age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
      return `${age} ${age> 1 ? 'anos' : 'ano'}`;
    }

    return '-';
  }

}
