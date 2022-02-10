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
}

export default new DateUtil();
