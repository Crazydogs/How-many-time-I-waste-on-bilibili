interface historyItem {
    /** 本记录的起始时间 */
    startTime: number,
    /** 本记录的结束时间 */
    endTime: number,
    /** 在起始时间与开始时间之间的数据 */
    duration: number
}
/** 历史记录 */
class TimeHistory {
    private _list: historyItem[];
    /** 最大记录数 */
    private maxSize = 30;
    constructor() {
        this._list = [];
    }
    /**
     * addItem 添加记录
     * @param 记录数据
     */
    public addItem(item: historyItem): void {
        if (this._list.length >= this.maxSize) {
            this._list.shift();
        }
        this._list.push(item);
        if (window.localStorage) {
            localStorage.setItem('history', JSON.stringify(this._list));
        }
    }
    /**
     * getList 获取历史记录
     * @param 获取条目数量
     */
    public getList(size = 7) {
        if (window.localStorage) {
            let list = window.localStorage.getItem('history');
            list = list ? JSON.parse(list) : [];
            return list.slice(-size);
        } else {
            return this._list.slice(-size);
        }
    }
}

export {TimeHistory}