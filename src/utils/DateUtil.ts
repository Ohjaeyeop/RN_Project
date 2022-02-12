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

  yearMonth(d: number) {
    const year = Math.floor(d / 10000);
    const month = Math.floor((d % 10000) / 100);
    return `${year}년 ${month}월`;
  }

  monthDateDay(d: number) {
    const year = Math.floor(d / 10000);
    const month = Math.floor((d % 10000) / 100);
    const date = d % 100;
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

  getLastDate(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }
}

export default new DateUtil();
