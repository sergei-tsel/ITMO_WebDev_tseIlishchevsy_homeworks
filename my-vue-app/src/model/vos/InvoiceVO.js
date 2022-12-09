class InvoiceVO {
    static createFromTitle({ number, subtotal, discountPercent, discountSum, total, iban }) {
        return new InvoiceVO({ number, subtotal, discountPercent, discountSum, total, iban });
    }

    constructor({ number, subtotal, discountPercent, discountSum, total, iban }, date = new Date()) {
        this.number = number;
        this.subtotal = subtotal;
        this.discountPercent = discountPercent;
        this.discountSum = discountSum;
        this.total = total;
        this.iban = iban;
        this.date = date;
    }
}

export default InvoiceVO;