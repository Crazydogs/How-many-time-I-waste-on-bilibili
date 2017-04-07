(function() {
    setInterval(function interval(params) {
        chrome.runtime.sendMessage({
            type: 'get time'
        }, function (res) {
            let time = res.time;
            let elH = document.querySelector('#hours');
            let elM = document.querySelector('#minute');
            let elS = document.querySelector('#second');
            elH.innerHTML = Math.floor(time / 3600);
            time = time % 3600;
            elM.innerHTML = Math.floor(time / 60);
            time = time % 60;
            elS.innerHTML = time;

            let elF = document.querySelector('#frome');
            elF.style = 'dislay: none';
            elF.innerHTML = '';
            console.log(res.url);
            res.url.map(function(item) {
                let elLi = document.createElement('li');
                elLi.innerText = item;
                elF.appendChild(elLi);
            });
            elF.style = 'dislay: block';
        });
    }, 100);
})();