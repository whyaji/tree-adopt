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
    format: 'D MMMM YYYY HH:mm:ss',
    dateFormat: 'D MMMM YYYY',
    timeFormat: 'HH:mm:ss',
    dateOnly: false,
    timeOnly: false,
  }
) {
  const date = moment(isoStringDate);

  if (!date.isValid()) return '';

  const { format, dateOnly, timeOnly, dateFormat, timeFormat } = options;

  if (dateOnly) return date.format(dateFormat ?? 'D MMMM YYYY');
  if (timeOnly) return date.format(timeFormat ?? 'HH:mm:ss');

  return date.format(format || 'D MMMM YYYY HH:mm:ss');
}

export function toIsoDate(date: Date) {
  return moment(date).local().toISOString();
}

export function toDbDate(
  date: string,
  options: {
    fromFormat?: string;
    toFormat?: string;
  } = {
    fromFormat: undefined,
    toFormat: 'YYYY-MM-DD',
  }
) {
  return moment(date, options.fromFormat).format(options.toFormat);
}
