(function() {
    setInterval(function() {
        chrome.runtime.sendMessage({
            type: 'add time',
            url: window.location.href
        });
    }, 1000);
})();