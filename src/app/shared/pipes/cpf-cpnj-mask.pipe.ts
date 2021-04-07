import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfCpnjMask'
})
export class CpfCpnjMaskPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    let document = value ? value.replace(/\D/g, '') : '';

    if (document && document.length === 11) {
      return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    } else if (document && document.length === 14) {
      return document.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
        '$1.$2.$3/$4-$5'
      );
    } else if (!document) {
      return '-';
    } else {
      return value;
    }
  }

}
