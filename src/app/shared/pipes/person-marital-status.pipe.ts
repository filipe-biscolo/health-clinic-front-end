import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'personMaritalStatus'
})
export class PersonMaritalStatusPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    switch (value) {
      case 'SO':
        return 'Solteiro';
      case 'CA':
        return 'Casado';
      case 'DI':
        return 'Divorciado';
      case 'VI':
        return 'Viúvo';
      case 'SE':
        return 'Separado';

      default:
        return '-';
    }
  }

}
