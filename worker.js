let running = false;

function stressTest() {
  if (!running) {
    return;
  }
  let i = 0;
  while (i < 1000000) {
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
