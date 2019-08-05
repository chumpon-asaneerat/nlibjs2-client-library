console.group('DateTime Class')

console.log('TEST ==> DateTime class.');

let dt = DateTime.now;
console.log('Now:', dt.toString());
dt = dt.addHours(1).addMinutes(30);
console.log('Add 1 hour, 30 minutes:', dt.toString());
console.log('year:', dt.year);
console.log('month:', dt.month);
console.log('day:', dt.day);
console.log('day of week:', dt.dayOfWeek);
console.log('hour:', dt.hour);
console.log('minute:', dt.minute);
console.log('second:', dt.second);
console.log('millisecond:', dt.millisecond);

console.groupEnd()
