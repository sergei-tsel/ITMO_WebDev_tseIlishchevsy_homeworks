class InvoiceVO {
    static createFromTitle({ number, subtotal, discount, total, iban }) {
        return new InvoiceVO({ number, subtotal, discount, total, iban });
    }

    constructor({ number, subtotal, discount, total, iban }, date = new Date()) {
        this.number = number;
        this.subtotal = subtotal;
        this.discount = discount;
        this.total = total;
        this.iban = iban;
        this.date = date;
    }
}

export default InvoiceVO;