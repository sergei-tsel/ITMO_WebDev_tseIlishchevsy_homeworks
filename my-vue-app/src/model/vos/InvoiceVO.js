class InvoiceVO {
    static createFromTitle({ number, subtotal, discount, taxes, total, iban }) {
        return new InvoiceVO({ number, subtotal, discount, taxes, total, iban });
    }

    constructor({ number, subtotal, discount, taxes, total, iban }, date = new Date()) {
        this.number = number;
        this.subtotal = subtotal;
        this.discount = discount;
        this.taxes = taxes;
        this.total = total;
        this.iban = iban;
        this.date = date;
    }
}

export default InvoiceVO;