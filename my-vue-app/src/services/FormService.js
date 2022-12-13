class FormService {
    constructor(inputs, containers) {
        console.log('> FormService -> constructor', inputs, containers);
        this.inputs = Array.from(inputs);
        this.containers = Array.from(containers);
    }

    get itemTotal() {  
        const qty = this.inputs.qty ?? 0;
        const cost = this.inputs.cost ?? 0;
        return qty * cost;
    }

    get invoiceDiscountSum() {
        const subtotal = this.invoiceSubtotal ?? 0;
        const discountPercent = this.inputs.discount.value ?? 0;
        return subtotal * (1 - discountPercent / 100);
    }

    get invoiceTotal() {
        const subtotal = this.invoiceSubtotal ?? 0;
        const discountPercent = this.inputs.discount.value ?? 0;
        return subtotal * (discountPercent / 100);
    }

    setItemContainer() {
        console.log(this.containers);
        if(typeof this.containers.total !== "undefined") {
            this.containers.total.value = this.itemTotal;
        } else this.containers = { total: { value: [ this.itemTotal ] } };
        console.log(`> FormService -> setItemContainer: ${this.containers.total.value}`);
    }

    setInvoiceContainers(tableOfItems) {
        this.containers.subtotal.value = this.getInvoiceSubtotal(tableOfItems);
        this.containers.discount.value = this.invoiceDiscountSum;
        this.containers.total.value = this.invoiceTotal;
        console.log(`> FormService -> setInvoiceContainers: ${this.containers.subtotal.value}, ${this.containers.discount.value}, ${this.containers.total.value}`);
    }

    getInvoiceSubtotal(tableOfItems) {
        items = Array.from(tableOfItems);
        itemsTotals = items.map(item => item.total);
        return itemsTotals.reduce((sum, current) => sum + current, 0);
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