import { LOCAL_INVOICE_NUMBER, LOCAL_SUBTOTAL, LOCAL_DISCOUNT_PERCENT, LOCAL_TOTAL, LOCAL_IBAN_NUMBER, LOCAL_ITEMS_TABLE, LOCAL_ITEM_QTY, LOCAL_ITEM_COST, LOCAL_ITEM_TOTAL, LOCAL_ITEM_TITLE, LOCAL_ITEM_DESCRIPTION } from '@/consts/local.js';
import Dom from "@/consts/dom";
import InvoiceVO from '@/model/vos/InvoiceVO.js';
import ItemVO from '@/model/vos/ItemVO.js';
import { disableButtonWhenTextInvalid, activateBtnIfCreateOrAddPossible, itemHaveAllKeys, itemHaveKey } from '@/utils/domUtils.js';
import { isStringNotNumberAndNotEmpty, isNumberWithMaxLength, isOnlyNumbers, isNotLongerThenMaxLength, isOneLine, stylizeIBAN } from '@/utils/stringUtils.js';
import { localStorageListOf, localStorageSaveListOfWithKey, localStorageDeleteListOfWithKey } from '@/utils/databaseUtils.js';
import { delay, wrapDevOnlyConsoleLog, $ } from '@/utils/generalUtils.js';
import ItemView from '@/view/ItemView.js';
import ServerService from '@/services/ServerService.js';

$(Dom.BTN_DELETE_WORK_ITEM_POPUP).addEventListener('click', onBtnDeleteWorkItemPopupClick);
$(Dom.OVERLAY_WORK_ITEM_POPUP).addEventListener('click', onOverlayWorkItemPopupClick);
$(Dom.BTN_CLOSE_WORK_ITEM_POPUP).addEventListener('click', onBtnCloseWorkItemPopupClick);
$(Dom.INPUT_WORK_ITEM_QTY).addEventListener('keyup', onInputWorkItemQtyKeyup);
$(Dom.INPUT_WORK_ITEM_COST).addEventListener('keyup', onInputWorkItemCostKeyup);
$(Dom.BTN_CREATE_WORK_ITEM).addEventListener('click', onBtnCreateWorkItemPopupClick);
$(Dom.INPUT_WORK_ITEM_TITLE).addEventListener('keyup', onInputWorkItemTitleKeyup);
$(Dom.INPUT_WORK_ITEM_DESCRIPTION).addEventListener('keyup', onInputWorkItemDescriptionKeyup);

$(Dom.INPUT_INVOICE_NUMBER).addEventListener('keyup', onInputInvoiceNumberKeyup);
$(Dom.TABLE_WORK_ITEMS).addEventListener('click', onInputDomItemClicked);
$(Dom.BTN_ADD_WORK_ITEM).addEventListener('click', onBtnAddWorkItemClick);
$(Dom.INPUT_DISCOUNT_PERCENT).addEventListener('keyup', onInputDiscountPercentKeyup);
$(Dom.INPUT_IBAN_NUMBER).addEventListener('keyup', onInputIBANNumberKeyup);

let tableOfItems = [];

let selectedItemVO = null;

const serverService = new ServerService('http://localhost:3003');

const findItemById = (id) => tableOfItems.find((vo) => vo.id === id);

wrapDevOnlyConsoleLog();
/*
serverService
    .requestItems()
    .then((itemTable) => {
        console.log('> Initial env:', import.meta.env);
        console.log('> Initial value:', itemTable);

        tableOfItems = itemTable;
        $(Dom.INPUT_WORK_ITEM_TITLE).value = localStorage.getItem(LOCAL_ITEM_TITLE);
        render_ItemTableInContainer(tableOfItems, $(Dom.TABLE_WORK_ITEMS));
    })
    .catch((error) => {
        $(Dom.APP).innerHTML = `
      <div id="errorOnInit">
        <h1>Problem with server</h1>
        <p style="color:red">${error.toString()}</p>
      </div>`;
    })
    .finally(() => ($(Dom.APP).style.visibility = 'visible'));
*/
async function onInputInvoiceNumberKeyup() {
    let inputValue = $(Dom.INPUT_INVOICE_NUMBER).value;
    console.log('> onInputInvoiceNumberKeyup:', inputValue);
    if(resetOrNotReset_InvoiceInput($(Dom.INPUT_INVOICE_NUMBER), LOCAL_INVOICE_NUMBER, isNumberWithMaxLength, 4)) {
        await save_Invoice(LOCAL_INVOICE_NUMBER, inputValue);
    } else alert('Keyup error: is not string, number, empty or longer than max length');
}

async function onBtnAddWorkItemClick() {
    $(Dom.BTN_DELETE_WORK_ITEM_POPUP).disabled = true;
    $(Dom.POPUP_WORK_ITEM_CONTAINER).hidden = false;
}

async function onInputDomItemClicked() {
    $(Dom.TITLE_WORK_ITEM_CONTAINER).value = 'Update';
    $(Dom.BTN_CREATE_WORK_ITEM).value = "Add";
    const domElement = event.target;
    selectedItemVO = findItemById(domElement.id);
    $(Dom.POPUP_WORK_ITEM_CONTAINER).hidden = false;
}

async function onInputDiscountPercentKeyup() {
    const discountPercent = $(Dom.INPUT_DISCOUNT_PERCENT).value;
    console.log('> onInputDiscountPercentKeyup:', discountPercent);
    await calculate_Invoice(discountPercent);
    await save_Invoice(LOCAL_DISCOUNT_PERCENT, discountPercent);
}

async function onInputIBANNumberKeyup() {
    const inputValue = Dom.INPUT_IBAN_NUMBER.value;
    console.log('> onInputIBANNumberKeyup:', inputValue);
    const savedInvoiceNumber = localStorage.getItem(LOCAL_IBAN_NUMBER);
    if (inputValue !== savedInvoiceNumber) {
        if(resetOrNotReset_InvoiceInput($(Dom.INPUT_IBAN_NUMBER), LOCAL_IBAN_NUMBER, isNotLongerThenMaxLength, 30)) {
            const stylizedInputValue = stylizeIBAN(inputValue);
            await save_Invoice(LOCAL_IBAN_NUMBER, stylizedInputValue);
            $(Dom.INPUT_IBAN_NUMBER).value = stylizedInputValue;
            await onInputIBANNumberKeyup();
        }
    }
}

function resetOrNotReset_InvoiceInput(input, key, validateInputMethod, param = null, validateAllInputsMethod = isStringNotNumberAndNotEmpty) {
    const value = input.value;
    if(validateAllInputsMethod(value)) {
        if(validateInputMethod(value, param)) {
            return true;
        }
    }
    input.value = localStorage.getItem(key);
    console.log('> resetOrNotReset_InvoiceInput: reset, savedValue =', input.value);
    return false;
}

async function calculate_Invoice(discount) {
    const subtotal = localStorage.getItem(LOCAL_SUBTOTAL);
    const total = subtotal * (1 - discount / 100);
    console.log('> calculate_Invoice:', subtotal, discount, total);
    localStorage.setItem(LOCAL_TOTAL, `${total}`);
    await save_Invoice();
    $(Dom.RESULTS_SUBTOTAL_CONTAINER).value = subtotal;
    $(Dom.RESULTS_DISCOUNT_CONTAINER).value = discount;
    $(Dom.RESULTS_TOTAL_CONTAINER).value = total;
}

function create_Invoice() {
    const number = localStorage.getItem(LOCAL_INVOICE_NUMBER);
    const subtotal = localStorage.getItem(LOCAL_SUBTOTAL);
    const discount = localStorage.getItem(LOCAL_DISCOUNT_PERCENT);
    const total = localStorage.getItem(LOCAL_TOTAL);
    const iban = localStorage.getItem(LOCAL_IBAN_NUMBER);
    const newInvoiceVO = InvoiceVO.createFromTitle({number, subtotal, discount, total, iban});
    console.log('> create_Invoice -> invoice =', newInvoiceVO);
    return newInvoiceVO;
}

function save_Invoice(key, value) {
    localStorage.setItem(key, value);
    const invoiceVO = create_Invoice();
    serverService
        .saveInvoice(invoiceVO)
        .then((data) => {
            console.log('> save_Invoice: saved =', data);
        })
        .catch(alert);
}

function render_ItemTableInContainer(tableOfItems, container) {
    let output = '';
    let itemVO;
    for (let index in tableOfItems) {
        itemVO = tableOfItems[index];
        output += ItemView.createSimpleViewFromVO(index, ItemVO);
    }
    container.innerHTML = output;
}

function onBtnDeleteWorkItemPopupClick() {
    const itemId = selectedItemVO.id;
    console.log('> onBtnDeleteWorkItemPopupClick -> itemId:', itemId);
    const itemVO = findItemById(itemId);
    const result = confirm('Delete the work item?');
    if(result) {
        serverService
            .deleteItems(itemId)
            .then(async () => {
                tableOfItems.splice(tableOfItems.indexOf(itemVO), 1);
                clear_WorkItem();
                onBtnCloseWorkItemPopupClick();
                render_ItemTableInContainer(tableOfItems, $(Dom.TABLE_WORK_ITEMS));
                await calculate_Invoice();
            })
            .catch(() => {});
    }
}

function onBtnCloseWorkItemPopupClick() {
    if($(Dom.BTN_CREATE_WORK_ITEM).disabled === true) {
        const result = confirm('Close the work item?');
        if(!result) {
            return;
        }
    }
    $(Dom.POPUP_WORK_ITEM_CONTAINER).hidden = true;
}

function onOverlayWorkItemPopupClick() {
    onBtnCloseWorkItemPopupClick();
}

function onInputWorkItemQtyKeyup() {
    const itemQty = $(Dom.INPUT_WORK_ITEM_QTY).value;
    console.log('> onInputWorkItemQtyKeyup: qty =', itemQty);
    disableOrEnable_ItemButton($(Dom.INPUT_WORK_ITEM_QTY), isOnlyNumbers());
    localStorage.setItem(LOCAL_ITEM_QTY, itemQty);
    calculate_Item();
}

function onInputWorkItemCostKeyup() {
    const itemCost = $(Dom.INPUT_WORK_ITEM_COST).value;
    console.log('> onInputWorkItemCostKeyup: cost =', itemCost);
    disableOrEnable_ItemButton($(Dom.INPUT_WORK_ITEM_COST), isOnlyNumbers());
    localStorage.setItem(LOCAL_ITEM_COST, itemCost);
    calculate_Item();
}

function onBtnCreateWorkItemPopupClick() {
    if($(Dom.BTN_CREATE_WORK_ITEM).value === "Add") {
       update_Item();
    }
    if($(Dom.BTN_CREATE_WORK_ITEM).value === "Create") {
        save_Item();
    }
}

function onInputWorkItemTitleKeyup() {
    let inputValue = $(Dom.INPUT_WORK_ITEM_TITLE).value;
    console.log('> onInputWorkItemTitleKeyup:', inputValue);
    disableOrEnable_ItemButton($(Dom.INPUT_WORK_ITEM_TITLE), isOneLine());
    localStorage.setItem(LOCAL_ITEM_TITLE, inputValue);
}

function onInputWorkItemDescriptionKeyup() {
    let inputValue = $(Dom.INPUT_WORK_ITEM_DESCRIPTION).value;
    console.log('> onInputWorkItemDescriptionKeyup:', inputValue);
    disableOrEnable_ItemButton(Dom.INPUT_WORK_ITEM_DESCRIPTION);
    localStorage.setItem(LOCAL_ITEM_DESCRIPTION, inputValue);
}

function calculate_Item() {
    const qty = localStorage.getItem(LOCAL_ITEM_QTY);
    const cost = localStorage.getItem(LOCAL_ITEM_COST);
    const total = qty * cost;
    console.log('> calculate_Item:', qty, cost, total);
    localStorage.setItem(LOCAL_ITEM_TOTAL, `${total}`);
    $(Dom.WORK_ITEM_TOTAL_CONTAINER).value = total;
}

function disableOrEnable_ItemButton(input, validateInputMethod = isNaN(input.value), validateAllInputsMethod = isStringNotNumberAndNotEmpty, button = $(Dom.BTN_CREATE_WORK_ITEM),) {
    console.log('> disableOrEnable_ItemButton -> value =', input.value);
    const textToValidate = input.value;
    disableButtonWhenTextInvalid(button, textToValidate, validateAllInputsMethod);
    if (button.disabled === false) {
        disableButtonWhenTextInvalid(button, textToValidate, validateInputMethod);
        if(button.disabled === false) {
           const qty = $(Dom.INPUT_WORK_ITEM_QTY);
           const cost = $(Dom.INPUT_WORK_ITEM_COST);
           const title = $(Dom.INPUT_WORK_ITEM_TITLE);
           const description = $(Dom.INPUT_WORK_ITEM_DESCRIPTION);
            activateBtnIfCreateOrAddPossible(button, itemHaveAllKeys(qty, cost, title, description), itemHaveKey(qty, cost, title, description));
        }
    }
}

function create_Item() {
    const title = localStorage.getItem(LOCAL_ITEM_TITLE);
    const description = localStorage.getItem(LOCAL_ITEM_DESCRIPTION);
    const qty = localStorage.getItem(LOCAL_ITEM_QTY);
    const cost = localStorage.getItem(LOCAL_ITEM_COST);
    const total = localStorage.getItem(LOCAL_ITEM_TOTAL);
    const newItemVO = ItemVO.createFromTitle({title, description, qty, cost, total});
    console.log('> create_Item -> item =', newItemVO);
    return newItemVO;
}

function update_Item() {
    serverService
        .updateItems(selectedItemVO, selectedItemVO.id)
        .then(async () => {
            clear_WorkItem();
            onBtnCloseWorkItemPopupClick();
            render_ItemTableInContainer(tableOfItems, $(Dom.TABLE_WORK_ITEMS));
            await calculate_Invoice();
        })
        .catch(() => {});
}

function save_Item() {
    const itemVO = create_Item();
    serverService
        .saveItems(itemVO)
        .then(async () => {
            clear_WorkItem();
            onBtnCloseWorkItemPopupClick();
            render_ItemTableInContainer(tableOfItems, $(Dom.TABLE_WORK_ITEMS));
            await calculate_Invoice();
        })
        .catch(() => {});
    localStorageSaveListOfWithKey(LOCAL_ITEMS_TABLE, tableOfItems);
}

function clear_WorkItem() {
    $(Dom.INPUT_WORK_ITEM_QTY).value = '';
    localStorage.removeItem(LOCAL_ITEM_QTY);
    $(Dom.INPUT_WORK_ITEM_COST).value = '';
    localStorage.removeItem(LOCAL_ITEM_COST);
    $(Dom.INPUT_WORK_ITEM_TITLE).value = '';
    localStorage.removeItem(LOCAL_ITEM_TITLE);
    $(Dom.INPUT_WORK_ITEM_DESCRIPTION).value = '';
    localStorage.removeItem(LOCAL_ITEM_DESCRIPTION);
}