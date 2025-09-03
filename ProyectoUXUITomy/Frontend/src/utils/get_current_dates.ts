export function getCurrentWeekRange() : Date[]
{
  const today = new Date();
  const day = today.getDay();

  const diffToMonday = (day === 0 ? -7: 1) - day;

  const monday = new Date();
  monday.setDate(today.getDate() + diffToMonday);

  const week: Date[] = [];

  let d = new Date(monday);

  for(let i = 0; i < 7; i++)
  {
    week.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }

  return week;
}

export function getCurrentMonthRange() : Date[]
{
  const today = new Date();
  
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const days: Date[] = [];

  let current = new Date(firstDay);
  while(current.getMonth() === month)
  {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

export function getCurrentYearRange() : Date[]
{
  const today = new Date();
  
  const year = today.getFullYear();

  const firstDay = new Date(year, 0, 1);
  const days: Date[] = [];

  let current = new Date(firstDay);
  while(current.getFullYear() === year)
  {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}