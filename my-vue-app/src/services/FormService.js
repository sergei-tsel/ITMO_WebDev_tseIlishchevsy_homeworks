class FormService {
    constructor(inputs, containers) {
        console.log('> FormService -> constructor', inputs, containers);
        this.inputs = inputs;
        this.containers = containers;
    }

    get invoiceDiscountSum() {
        return this.invoiceSubtotal * (this.inputs.discount.value / 100);
    }

    get invoiceTotal() {
        return this.invoiceSubtotal * (1 - this.inputs.discount.value / 100);
    }

    get itemTotal() {  
        return this.inputs.qty.value * this.inputs.cost.value;
    }

    setInvoiceSubtotal(tableOfItems) {
        let result = 0;
        for (let item of tableOfItems) {
            let total = item['title']['total'];
            total = Number(total);
            result = result + total;
        }
        this.invoiceSubtotal = result;
        console.log(`> FormService -> setInvoiceSubtotal:`, result);
    }

    setInvoiceContainers() {
        console.log(`> FormService -> setInvoiceContainers: ${this.invoiceSubtotal}, ${this.invoiceDiscountSum}, ${this.invoiceTotal}`);
        this.containers.subtotal.innerText = this.invoiceSubtotal;
        this.containers.discount.innerText = this.invoiceDiscountSum;
        this.containers.total.innerText = this.invoiceTotal;
    }

    setItemContainer() {
        this.containers.total.innerText = this.itemTotal;
        console.log('> FormService -> setItemContainer:', this.containers.total.innerText);
    }

    setItem(item) {
        this.inputs.qty.value = item.title.qty;
        this.inputs.cost.value = item.title.cost;
        this.inputs.title.value = item.title.title;
        this.inputs.description.value = item.title.description;
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

    getItem(item) {
       item.title.qty = this.inputs.qty.value;
       item.title.cost = this.inputs.cost.value;
       item.title.total = this.containers.total.innerText;
       item.title.title = this.inputs.title.value;
       item.title.description = this.inputs.description.value;
       return item;
    }
    clearItemForm() {
        this.inputs.qty.value = '';
        this.inputs.cost.value = '';
        this.inputs.title.value = '';
        this.inputs.description.value = '';
    }
}

export default FormService;