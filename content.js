(function() {
    setInterval(function() {
        chrome.runtime.sendMessage({
            type: 'add time',
            num: 1,
            url: window.location.href
        });
    }, 1000);
})();