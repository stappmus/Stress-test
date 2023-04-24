const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const numCoresInput = document.getElementById('numCores');
const workers = [];

const workerScript = `
let running = false;

function stressTest() {
  if (!running) {
    return;
  }
  let i = 0;
  while (i < 10000000000) {
    i++;
  }
  setTimeout(stressTest, 0);
}

self.onmessage = (event) => {
  if (event.data === 'start') {
    running = true;
    stressTest();
  } else if (event.data === 'stop') {
    running = false;
    self.postMessage('stopped');
  }
};
`;

function createWorker() {
  const workerBlob = new Blob([workerScript], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(workerBlob);
  const worker = new Worker(workerUrl);
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
  const numCores = parseInt(numCoresInput.value, 10) || 1;
  for (let i = 0; i < numCores; i++) {
    const worker = createWorker();
    workers.push(worker);
    worker.postMessage('start');
  }
});

stopButton.addEventListener('click', () => {
  workers.forEach((worker) => worker.postMessage('stop'));
});
