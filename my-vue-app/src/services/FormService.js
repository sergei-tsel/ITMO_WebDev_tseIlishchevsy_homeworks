class FormService {
    constructor(inputs, containers) {
        console.log('> FormService -> constructor', inputs, containers);
        this.inputs = inputs;
        this.containers = containers;
    }

    get invoiceDiscountSum() {
        return this.invoiceSubtotal * (1 - this.inputs.discount.value / 100);
    }

    get invoiceTotal() {
        return this.invoiceSubtotal * (this.inputs.discount.value / 100);
    }

    get itemTotal() {  
        return this.inputs.qty.value * this.inputs.cost.value;
    }

    setInvoiceSubtotal(tableOfItems) {
        const items = tableOfItems;
        const itemsTotals = items.map(item => item.total);
        this.invoiceSubtotal = itemsTotals.reduce((sum, current) => sum + current, 0);
    }


    setInvoiceContainers(tableOfItems) {
        this.setInvoiceSubtotal(tableOfItems);
        this.containers.subtotal.innerText = this.invoiceSubtotal;
        this.containers.discount.innerText = this.invoiceDiscountSum;
        this.containers.total.innerText = this.invoiceTotal;
        console.log(`> FormService -> setInvoiceContainers: ${this.containers.subtotal.innerText}, ${this.containers.discount.innerText}, ${this.containers.total.innerText}`);
    }

    setItemContainer() {
        this.containers.total.innerText = this.itemTotal;
        console.log('> FormService -> setItemContainer:', this.containers.total.innerText);
    }

    getInvoiceList() {
        let inputsValues = { number: this.inputs.number.value, discount: this.inputs.discount.value, iban: this.inputs.iban.value };
        let containersTexts = { subtotal: this.containers.subtotal.innerText, discount: this.containers.discount.innerText, total: this.containers.discount.innerText };
        const list = { inputsValues, containersTexts};
        console.log("> FormService -> getInvoiceList:", list);
        return list;
    }

    getItemList() {
        let inputsValues = { qty: this.inputs.qty.value, cost: this.inputs.cost.value, title: this.inputs.title.value, description: this.inputs.description.value } ;
        let containersTexts = { total: this.containers.total.innerText };
        const list = { inputsValues, containersTexts};
        console.log("> FormService -> getItemList:", list);
        return list;
    }

    clearItemForm() {
        this.inputs.qty.value = '';
        this.inputs.cost.value = '';
        this.inputs.title.value = '';
        this.inputs.description.value = '';
        this.containers.total.innerText = '';
    }
}

export default FormService;