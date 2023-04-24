const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const numCoresInput = document.getElementById('numCores');
const workers = [];

const workerScriptBase64 = bGV0IHJ1bm5pbmcgPSBmYWxzZTsKCmZ1bmN0aW9uIHN0cmVzc1Rlc3QoKSB7CiAgaWYgKCFydW5uaW5nKSB7CiAgICByZXR1cm47CiAgfQogIGxldCBpID0gMDsKICB3aGlsZSAoaSA8IDEwMDAwMDAwMDApIHsKICAgIGkrKzsKICB9CiAgc2V0VGltZW91dChzdHJlc3NUZXN0LCAwKTsKfQoKc2VsZi5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHsKICBpZiAoZXZlbnQuZGF0YSA9PT0gJ3N0YXJ0JykgewogICAgcnVubmluZyA9IHRydWU7CiAgICBzdHJlc3NUZXN0KCk7CiAgfSBlbHNlIGlmIChldmVudC5kYXRhID09PSAnc3RvcCcpIHsKICAgIHJ1bm5pbmcgPSBmYWxzZTsKICAgIHNlbGYucG9zdE1lc3NhZ2UoJ3N0b3BwZWQnKTsKICB9Cn07;

function createWorker() {
  const workerUrl = `data:text/javascript;base64,${workerScriptBase64}`;
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
