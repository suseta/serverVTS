const inputDateTime = '20240216,17:42:36'; // Example input date and time

// Split the input into date and time components
const [datePart, timePart] = inputDateTime.split(',');

// Parse the date and time components
const year = datePart.slice(0, 4);
const month = datePart.slice(4, 6);
const day = datePart.slice(6);
const [hours, minutes, seconds] = timePart.split(':').map(Number);

// Create a Date object in UTC
const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));

// Add UTC +5:30 to convert to IST
utcDate.setHours(utcDate.getHours() + 5);
utcDate.setMinutes(utcDate.getMinutes() + 30);

// Format the IST date and time
const ISTYear = utcDate.getUTCFullYear();
const ISTMonth = ('0' + (utcDate.getUTCMonth() + 1)).slice(-2);
const ISTDay = ('0' + utcDate.getUTCDate()).slice(-2);
const ISTHours = ('0' + utcDate.getUTCHours()).slice(-2);
const ISTMinutes = ('0' + utcDate.getUTCMinutes()).slice(-2);
const ISTSeconds = ('0' + utcDate.getUTCSeconds()).slice(-2);

const ISTDateTime = `${ISTYear}-${ISTMonth}-${ISTDay},${ISTHours}:${ISTMinutes}:${ISTSeconds}`;

console.log('Input DateTime (UTC):', inputDateTime);
console.log('Converted DateTime (IST):', ISTDateTime);
