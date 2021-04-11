export class FormUtils {
  static maskPhone(value: string) {
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

  static maskCPFCNPJ(value: string) {
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

  static ageCalc(value: string) {
    let birthDate = value;
    let age: number;

    if (birthDate) {
      let timeDiff = Math.abs(Date.now() - new Date(birthDate).getTime());
      age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
      return `${age}`;
    } else {
      return '-';
    }
  }

  static sexLabel(value: string) {
    switch (value) {
      case 'm':
        return 'Masculino';
      case 'f':
        return 'Feminino';

      default:
        return '-';
    }
  }

  static dateTimeHTML(dateForm?){
    let dateTime = dateForm ? new Date(dateForm) : new Date();
    dateTime.setMinutes(dateTime.getMinutes() - dateTime.getTimezoneOffset());
    return dateTime.toISOString().slice(0,16);
  }

  static exportExcel(name, array) {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(array);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, name);
    });
  }

  static saveAsExcelFile(buffer: any, fileName: string): void {
      import("file-saver").then(FileSaver => {
          let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          let EXCEL_EXTENSION = '.xlsx';
          const data: Blob = new Blob([buffer], {
              type: EXCEL_TYPE
          });
          FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      });
  }
}
