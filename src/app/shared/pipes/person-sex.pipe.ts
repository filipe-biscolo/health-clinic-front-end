import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'personSex'
})
export class PersonSexPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    switch (value) {
      case 'M':
        return 'Masculino';
      case 'F':
        return 'Feminino';

      default:
        return '-';
    }
  }

}
