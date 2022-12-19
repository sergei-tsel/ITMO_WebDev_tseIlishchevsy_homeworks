class InvoiceVO {
    static createFromTitle({ number, subtotal, discountPercent, discountSum, total, iban }) {
        const inputId = Date.now().toString();
        return new InvoiceVO(inputId, { number, subtotal, discountPercent, discountSum, total, iban });
    }

    constructor(id, { number, subtotal, discountPercent, discountSum, total, iban }, date = new Date()) {
        this.id = id;
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