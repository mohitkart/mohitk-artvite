const d = new Date();
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const date = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
const time = d.toLocaleTimeString();

const DateTime = {
  date,
  time
};

export default DateTime;
