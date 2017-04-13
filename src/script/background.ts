import {TimeHistory} from "./history";

(function() {
    /** 一天的毫秒数 */
    const timePerDay = 86400000;
    /** 多个时段的历史记录，封装了 localStorage */
    const history =  new TimeHistory();

    /** 当天访问页面列表 */
    let pageList:string[]  = [];
    /** 当天累计已稳定时间 */
    let totalTime: number = 0;

    interface PageConnection {
        /** 页面开始时间 */
        startTime: number,
        /** 页面地址 */
        url: string,
        /** 页面标题 */
        title: string
    }
    /** 页面连接列表 */
    let connectionList: {[portname: string]: PageConnection} = {};

    /** 开始计时时间 */
    let startTime: number = 0;


    // 处理页面链接
    chrome.runtime.onConnect.addListener((externalPort) => {
        // 记录页面连接
        connectionList[String(externalPort.sender.tab.id)]  = {
            startTime: Number(externalPort.name),
            url: externalPort.sender.tab.url,
            title: externalPort.sender.tab.title
        };
        // 保存访问记录
        if (pageList.indexOf(externalPort.sender.tab.url) == -1) {
            pageList.push(externalPort.sender.tab.url);
        }
        // 设定本段计时开始时间
        if (!startTime) {
            startTime = Number(externalPort.name);
        }

        // 断开连接
        externalPort.onDisconnect.addListener((port) => {
            delete connectionList[port.sender.tab.id];
            if (!Object.keys(connectionList).length) {
                // 没有活动的连接了
                totalTime += new Date().getTime() - startTime;
                startTime = 0;
            }
        });
    });

    /** 上次检查的时间 */
    let lastCheckTime = new Date().getTime();
    // 时间跨界检查
    setInterval(() => {
        let now = new Date().getTime();
        if (
            Math.floor(lastCheckTime / timePerDay) !=
            Math.floor(now / timePerDay)
        ) {
            totalTime = startTime ? totalTime + now - startTime : totalTime;
            startTime = startTime ? now : 0;
            pageList = [];
            history.addItem({
                startTime: lastCheckTime - lastCheckTime % timePerDay,
                endTime: now,
                duration: totalTime
            });
            totalTime = 0;
        }
        lastCheckTime = now;
    }, 10000);

    // 页面输出
    chrome.runtime.onMessage.addListener(function msgListener(req, sender, res) {
        if (req.type == 'get time') {
            let exTime = startTime ? new Date().getTime() - startTime : 0;
            // 输出当天累计时间
            res({
                // 累积时间加当前还活跃的连接时间
                time: (totalTime + exTime) / 1000,
                url: pageList,
            });
        } else if (req.type == 'get history') {
            // 输出历史数据
            res(history.getList());
        }
    });
})();
