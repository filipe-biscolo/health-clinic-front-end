import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'schedulingStatus'
})
export class SchedulingStatusPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    switch (value) {
      case 'SCHEDULED':
        return 'Agendado';
      case 'CONFIRMED':
        return 'Confirmado';
      case 'CANCELED':
        return 'Cancelado';
      case 'FINISHED':
        return 'Finalizado';

      default:
        return '-';
    }
  }

}
