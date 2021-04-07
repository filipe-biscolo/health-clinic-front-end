import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneMask'
})
export class PhoneMaskPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    let phone = value ? value.replace(/\D/g, '') : '';

    if (phone && phone.length === 11) {
      return phone.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phone && phone.length === 10) {
      return phone.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (!phone) {
      return '-';
    } else {
      return value;
    }
  }

}
