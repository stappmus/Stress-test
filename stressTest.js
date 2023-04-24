const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const numCoresInput = document.getElementById('numCores');
const workers = [];

async function fetchWorkerScript() {
  const response = await fetch('https://stappmus.github.io/Stress-test/worker.js');
  const script = await response.text();
  return script;
}

async function createWorker() {
  const workerScript = await fetchWorkerScript();
  const blob = new Blob([workerScript], { type: 'text/javascript' });
  const workerUrl = URL.createObjectURL(blob);
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

startButton.addEventListener('click', async () => {
  startButton.disabled = true;
  stopButton.disabled = false;
  const numCores = parseInt(numCoresInput.value, 10) || 1;
  for (let i = 0; i < numCores; i++) {
    const worker = await createWorker();
    workers.push(worker);
    worker.postMessage('start');
  }
});

stopButton.addEventListener('click', () => {
  workers.forEach((worker) => worker.postMessage('stop'));
});
