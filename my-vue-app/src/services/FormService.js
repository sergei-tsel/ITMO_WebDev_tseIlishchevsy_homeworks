class FormService {
    constructor(inputs, containers) {
        console.log('> FormService -> constructor', inputs);
        this.inputs = inputs;
        this.containers = containers;
    }

    get itemTotal() {
        return this.inputs.qty * this.inputs.cost;
    }

    get invoiceDiscountSum() {
        return this.invoiceSubtotal * (1 - this.inputs.discount.value / 100);
    }

    get invoiceTotal() {
        return this.invoiceSubtotal * (this.inputs.discount.value / 100);
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
}

export default FormService;