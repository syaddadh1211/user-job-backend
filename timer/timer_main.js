const { threadId, Worker } = require("worker_threads");
const worker1 = new Worker("./timer/birthday_timer.js");
const worker2 = new Worker("./timer/birthday_timer.js");

// Paralel processing
// interval = everyday = 1000 * 60 * 24,
// but in this scenario i use interval every 3 second for simple debuggging

//first arg for interval timer
worker1.postMessage(3);
worker2.postMessage(3);
