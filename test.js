const timeComponent = '07:03:36' 
const hours = timeComponent.slice(0, 2);
const minutes = timeComponent.slice(3, 5);
const seconds = timeComponent.slice(6,8);
const dummyDate = new Date();
dummyDate.setHours(hours, minutes, seconds);
const formattedTime = dummyDate.toTimeString().slice(0, 8);
console.log("time",formattedTime)