(function() {
    let counter = 0;
    let pageList  = [];
    let delay = false;
    chrome.extension.onMessage.addListener(function msgListener(req, sender, res) {
        if (req.type == 'add time' && !delay) {
            counter += req.num;
            if (pageList.indexOf(req.url) == -1) {
                pageList.push(req.url);
            }
            // 缓冲一下
            delay = true;
            setTimeout(function() {
                delay = false;
            }, 1000);
        } else if (req.type == 'get time') {
            res({
                time: counter,
                url: pageList
            });
        }
    });
})();