// Segue a mesma convenção usada nos formulários de expediente: 1 = segunda, ..., 7 = domingo.
export function getWeekdayFromDateString(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  const jsWeekday = new Date(year, month - 1, day).getDay();
  return jsWeekday === 0 ? 7 : jsWeekday;
}
