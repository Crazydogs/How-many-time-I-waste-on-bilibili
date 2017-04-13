(function() {
    let startTime: number = new Date().getTime();
    let connectPort = chrome.runtime.connect({
        'name': String(startTime)
    });
})();