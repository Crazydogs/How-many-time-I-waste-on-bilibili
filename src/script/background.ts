import {TimeHistory} from "./history";

(function() {
    /** 一天的毫秒数 */
    const timePerDay = 86400000;
    /** 记录页面列表 */
    let pageList:string[]  = [];
    /** 多个时段的历史记录，封装了 localStorage */
    let history =  new TimeHistory();

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
    /** 最后记入的时间 */
    let lastCountTime: number = 0;
    /** 总计时间 */
    let totalTime: number = 0;

    chrome.runtime.onMessage.addListener(function msgListener(req, sender, res) {
        if (req.type == 'get time') {
            res({
                time: totalTime / 1000,
                url: pageList
            });
        } else if (req.type == 'get history') {
            res(history.getList());
        }
    });

    // 处理页面链接
    chrome.runtime.onConnect.addListener((externalPort) => {
        // 记录页面连接
        connectionList[String(externalPort.sender.tab.id)]  = {
            startTime: Number(externalPort.name),
            url: externalPort.sender.tab.url,
            title: externalPort.sender.tab.title
        };
        savePage(externalPort.sender.tab.url);
        externalPort.onMessage.addListener((msg: any, port) => {
            let startTime = msg.startTime > lastCountTime ? msg.startTime : lastCountTime;
            if (!needClear(msg.time)) {
                // 通常情况
                totalTime += msg.time - startTime;
                lastCountTime = msg.time;
            } else {
                // 跨界
                let times = splitTime(startTime, msg.time);
            }
        });
        // 断开连接
        externalPort.onDisconnect.addListener((port) => {
            delete connectionList[port.sender.tab.id];
        });
    });
    /** 保存访问页面 */
    function savePage(url: string): void {
        if (pageList.indexOf(url) == -1) {
            pageList.push(url);
        }
    }
    /** 将一个时间段根据粒度切分成多段 */
    function splitTime(startTime: number, endTime: number): number[] {
        let duration = endTime - startTime;
        let dayStart = Math.floor(startTime / timePerDay);
        let dayEnd = Math.floor(endTime / timePerDay);
        if (dayStart === dayEnd) {
            return [duration];
        }
        let firstDayTime = timePerDay - (startTime % timePerDay);
        let lastDayTime = endTime % timePerDay;
        return [firstDayTime].concat(
            Array(dayEnd - dayStart - 1).map(() => {
                return timePerDay;
            }),
            [lastDayTime]);
    }
    /** 是否须要重新开始计数 */
    function needClear(endTime: number): boolean {
        return Math.floor(endTime / timePerDay) != Math.floor(lastCountTime / timePerDay);
    }
})();
