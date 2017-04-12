(function() {
    let startTime: number = new Date().getTime();
    let connectPort = chrome.runtime.connect({
        'name': String(startTime)
    });
    setInterval(() => {
        connectPort.postMessage({
            type: 'add time',
            time: new Date().getTime(),
            startTime: startTime
        });
    }, 1000);
})();