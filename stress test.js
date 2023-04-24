const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const numThreads = navigator.hardwareConcurrency || 4;
const workers = [];

function createWorker() {
  const worker = new Worker('worker.js');
  worker.onmessage = (event) => {
    if (event.data === 'stopped') {
      const index = workers.indexOf(worker);
      if (index > -1) {
        workers.splice(index, 1);
      }
      if (workers.length === 0) {
        startButton.disabled = false;
        stopButton.disabled = true;
      }
    }
  };
  return worker;
}

startButton.addEventListener('click', () => {
  startButton.disabled = true;
  stopButton.disabled = false;
  for (let i = 0; i < numThreads; i++) {
    const worker = createWorker();
    workers.push(worker);
    worker.postMessage('start');
  }
});

stopButton.addEventListener('click', () => {
  stopButton.disabled = true;
  workers.forEach((worker) => worker.postMessage('stop'));
});
