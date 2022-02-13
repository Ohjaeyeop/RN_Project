class DateUtil {
  days = ['일', '월', '화', '수', '목', '금', '토'];

  now() {
    return this.dateToNumber(new Date());
  }

  dateToNumber(d: Date) {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    return year * 10000 + month * 100 + date;
  }

  getYear(d: number) {
    return Math.floor(d / 10000);
  }

  getMonth(d: number) {
    return Math.floor((d % 10000) / 100);
  }

  getDate(d: number) {
    return d % 100;
  }

  yearMonth(d: number) {
    return `${this.getYear(d)}년 ${this.getMonth(d)}월`;
  }

  monthDateDay(d: number) {
    const year = this.getYear(d);
    const month = this.getMonth(d);
    const date = this.getDate(d);
    const day =
      this.days[
        new Date(
          `${year}-${month < 10 ? `0${month}` : month}-${
            date < 10 ? `0${date}` : date
          }`,
        ).getDay()
      ];
    return `${month}.${date}.(${day})`;
  }

  dateFromNow(offset: number) {
    const now = new Date();
    const newDate = new Date(now.setDate(now.getDate() + offset));
    return this.dateToNumber(newDate);
  }

  getLastDate(d: number) {
    return this.dateToNumber(new Date(this.getYear(d), this.getMonth(d), 0));
  }

  getLastDateOfPrevMonth(d: number) {
    const firstDayOfMonth = new Date(this.getYear(d), this.getMonth(d) - 1, 1);
    const lastMonth = new Date(
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 1),
    );
    return this.dateToNumber(lastMonth);
  }

  getLastDateOfNextMonth(d: number) {
    const firstDayOfMonth = new Date(this.getYear(d), this.getMonth(d) + 1, 1);
    const lastMonth = new Date(
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 1),
    );
    return this.dateToNumber(lastMonth);
  }

  getFirstDay(d: number) {
    return new Date(this.getYear(d), this.getMonth(d) - 1, 1).getDay();
  }
}

export default new DateUtil();
