import { Pipe, PipeTransform } from '@angular/core';

const intervals = {
  year: 31536000,
  month: 2592000,
  week: 604800,
  day: 86400,
  hour: 3600,
  min: 60,
  sec: 1,
} as const;

@Pipe({
  name: 'dateAgo',
  standalone: true,
})
export class DateAgoPipe implements PipeTransform {
  /**
   *
   * @param value - format DD.MM.YYYY
   * @returns
   */
  transform(value: string): string {
    const newFormat = value.split('.').reverse().join('-');
    const seconds = Math.floor((+new Date() - +new Date(newFormat)) / 1000);

    if (seconds < 29) {
      // less than 30 seconds ago will show as 'Just now'
      return 'Just now';
    }

    let counter = 0;
    for (const i in intervals) {
      // cast index to correct type
      const castedIndex = i as keyof typeof intervals;
      // get value to divide
      const intervalValue = intervals[castedIndex] as number;
      counter = Math.floor(seconds / intervalValue);
      if (counter > 0)
        if (counter === 1) {
          return counter + ' ' + i + ' ago'; // singular (1 day ago)
        } else {
          return counter + ' ' + i + 's ago'; // plural (2 days ago)
        }
    }

    return value;
  }
}
