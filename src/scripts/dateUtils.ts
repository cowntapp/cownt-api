// Date Utils

export const addMonths = (date: Date, months: number): Date => {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);

  // Adjusting different month lengths (ex. 31 January +1 month = 28 February)
  if (d.getDate() < day) {
    d.setDate(0);
  }
  return d;
};

export const differenceInMonths = (
  laterDate: Date,
  earlierDate: Date
): number => {
  const later = new Date(laterDate);
  const earlier = new Date(earlierDate);

  let month = (later.getFullYear() - earlier.getFullYear()) * 12;
  month += later.getMonth() - earlier.getMonth();

  // Adjust based on day of month
  if (later.getDate() < earlier.getDate()) {
    month -= 1;
  }
  return month;
};
