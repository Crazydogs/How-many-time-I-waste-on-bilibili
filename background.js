(function() {
    let counter = 0;
    let pageList  = [];
    let lastMsgTime = null;
    let delay = false;
    let history = {
        _list: [],
        get list() {
            if (window.localStorage) {
                let list = window.localStorage.getItem('history');
                list = list ? JSON.parse(list) : [];
                return list.slice(-7);
            } else {
                return this._list.slice(-7);
            }
        },
        set list(time) {
            let current = new Date();
            let lastData = new Date(current.getTime() - (1000 * 3600 * 24)).getTime();
            if (this._list.length >= 30) {
                this._list.shift();
            }
            this._list.push({
                date: lastData,
                time: time
            });
            if (window.localStorage) {
                window.localStorage.setItem('history', JSON.stringify(this._list));
            }
        }
    }

    chrome.extension.onMessage.addListener(function msgListener(req, sender, res) {
        if (req.type == 'add time') {
            countTime();
            savePage(req.url);
        } else if (req.type == 'get time') {
            res({
                time: counter,
                url: pageList
            });
        } else if (req.type == 'get history') {
            res(history.list);
        }
    });

    // 计数
    function countTime() {
        if (delay) return;
        counter += 1;
        let current = new Date();
        if (lastMsgTime && 
            Math.floor(lastMsgTime.getTime() / 3600000 / 24)
            != Math.floor(current.getTime() / 3600000 / 24)) {
            history.list = counter;
            counter = 0;
            pageList = [];
        }
        // 缓冲一下
        delay = true;
        setTimeout(function() {
            delay = false;
        }, 1000);
    }
    // 保存访问页面
    function savePage(url) {
        if (pageList.indexOf(url) == -1) {
            pageList.push(url);
        }
    }
})();
