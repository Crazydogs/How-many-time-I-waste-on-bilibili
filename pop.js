(function() {
    setInterval(function interval(params) {
        chrome.runtime.sendMessage({
            type: 'get time'
        }, function (res) {
            renderPage(res);
        });
    }, 200);

    chrome.runtime.sendMessage({
        type: 'get history'
    }, function (res) {
        renderHistory(res);
    });

    function renderPage(res) {
        renderTime(res.time);
        renderUrlList(res.url);
    }

    function renderTime(time) {
        let elH = document.querySelector('#hours');
        let elM = document.querySelector('#minute');
        let elS = document.querySelector('#second');
        elH.innerHTML = Math.floor(time / 3600);
        time = time % 3600;
        elM.innerHTML = Math.floor(time / 60);
        time = time % 60;
        elS.innerHTML = time;
    }
    function renderUrlList(list) {
        let elF = document.querySelector('#frome');
        elF.style = 'dislay: none';
        elF.innerHTML = '';
        list.map(function(item) {
            let elLi = document.createElement('li');
            elLi.innerText = item;
            elF.appendChild(elLi);
        });
        elF.style = 'dislay: block';
    }
    function renderHistory(list) {
        let elHistory = document.querySelector('#history');
        elHistory.style = 'dislay: none';
        elHistory.innerHTML = list.map(function (item){
            return JSON.stringify(item);
        }).join(',');
        elHistory.style = 'dislay: block';
    }
})();