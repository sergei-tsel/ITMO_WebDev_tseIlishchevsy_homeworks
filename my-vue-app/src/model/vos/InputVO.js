class InputVO {
    static createFromTitle(title, description, qty, cost, total) {
        const inputId = Date.now().toString();
        return new InputVO(inputId, title, description, qty, cost, total);
        }

    constructor(id, title, description, qty, cost, total, date = new Date()) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.qty = qty;
        this.cost = cost;
        this.total = total;
        this.date = date;
    }
}

export default InputVO;