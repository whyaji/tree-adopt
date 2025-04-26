import moment from 'moment';

export function dateTimeFormat(
  isoStringDate: string,
  options: {
    format?: string;
    dateFormat?: string;
    timeFormat?: string;
    dateOnly?: boolean;
    timeOnly?: boolean;
  } = {
    format: 'YYYY-MM-DD HH:mm:ss',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
    dateOnly: false,
    timeOnly: false,
  }
) {
  const date = moment(isoStringDate);

  if (!date.isValid()) return '';

  const { format, dateOnly, timeOnly, dateFormat, timeFormat } = options;

  if (dateOnly) return date.format(dateFormat ?? 'YYYY-MM-DD');
  if (timeOnly) return date.format(timeFormat ?? 'HH:mm:ss');

  return date.format(format || 'YYYY-MM-DD HH:mm:ss');
}

export function toIsoDate(date: Date) {
  return moment(date).local().toISOString();
}
