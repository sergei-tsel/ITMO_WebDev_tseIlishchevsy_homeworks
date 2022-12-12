class FormService {
    constructor(inputs, containers) {
        console.log('> FormService -> constructor', inputs, containers);
        this.inputs = Array.from(inputs);
        this.containers = Array.from(containers);
    }

    get itemTotal() {
        const itemTotal = this.inputs.qty * this.inputs.cost;
        return itemTotal ?? 0;
    }

    get invoiceDiscountSum() {
        const discountSum =  this.invoiceSubtotal * (1 - this.inputs.discount.value / 100);
        return discountSum ?? 0;
    }

    get invoiceTotal() {
        const invoiceTotal = this.invoiceSubtotal * (this.inputs.discount.value / 100);
        return invoiceTotal ?? 0;
    }

    setItemContainer() {
        this.containers.total.value = this.itemTotal;
        console.log(`> FormService -> setItemContainer: ${this.containers.total.value}`);
    }

    setInvoiceContainers() {
        this.containers.subtotal.value = this.invoiceSubtotal;
        this.containers.discount.value = this.invoiceDiscountSum;
        this.containers.total.value = this.invoiceTotal;
        console.log(`> FormService -> setInvoiceContainers: ${this.containers.subtotal.value}, ${this.containers.discount.value}, ${this.containers.total.value}`);
    }

    getList() {
        let inputsValues = this.inputs.map(item => item.value);
        let containersValues = this.containers.map(item => item.value);
        const list = { inputsValues, containersValues};
        console.log("> FormService -> getList:", list);
        return list;
    }

    clearValues() {
        for (const input of this.inputs) {
            input.value = '';
        }
        for (const container of this.containers) {
            container.value = '';
        }
    }
}

export default FormService;