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

    function renderTime(time:number) {
        let elH = document.querySelector('#hours');
        let elM = document.querySelector('#minute');
        let elS = document.querySelector('#second');
        elH.innerHTML = String(Math.floor(time / 3600));
        time = time % 3600;
        elM.innerHTML = String(Math.floor(time / 60));
        time = time % 60;
        elS.innerHTML = String(time);
    }
    function renderUrlList(list: string[]): void {
        let elF = document.getElementById('frome');
        elF.style.display = 'none';
        elF.innerHTML = '';
        list.map(function(item) {
            let elLi = document.createElement('li');
            elLi.innerText = item;
            elF.appendChild(elLi);
        });
        elF.style.display = 'block';
    }
    function renderHistory(list): void {
        let elHistory = document.getElementById('history');
        elHistory.style.display = 'none';
        elHistory.innerHTML = list.map(function (item){
            let date = new Date(item.startTime);
            return {
                date: date.getFullYear() + '/'
                    + (date.getMonth() + 1) + '/'
                    + date.getDate() + ' '
                    + date.getHours() + ':'
                    + date.getMinutes() + ':'
                    + date.getSeconds(),
                time: item.duration
            };
        }).map(function (item){
            return JSON.stringify(item);
        }).join('</br>');
        elHistory.style.display = 'block';
    }
})();