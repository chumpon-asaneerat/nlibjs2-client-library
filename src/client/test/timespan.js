console.group('TimeSpan Class')

console.log('TEST ==> TimeSpan class.');

let dt = Date.now();
setTimeout(() => {
    let ts = new TimeSpan(Date.now() - dt);    
    console.log('total days:', ts.totalDays);
    console.log('total hours:', ts.totalHours)
    console.log('total minutes:', ts.totalMinutes)
    console.log('total seconds:', ts.totalSeconds)
    console.log('total milliseconds:', ts.totalMilliseconds)
    console.log('elapse:', ts.toString())

    console.groupEnd()
}, 1512)
