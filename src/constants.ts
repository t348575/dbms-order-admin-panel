export const Constants = {
    server: 'ad'
};
export class Globals {
    static formatDate(date: Date) {
        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        const year = date.getFullYear();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return [year, month, day].join('-');
    }
    static toMysqlFormat(date: Date) {
        return Globals.formatDate(date) + ' ' + date.toTimeString().split(' ')[0];
    }
}
