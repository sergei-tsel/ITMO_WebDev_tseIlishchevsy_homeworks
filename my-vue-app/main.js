import {LOCAL_INVOICE_NUMBER, LOCAL_SUBTOTAL, LOCAL_DISCOUNT_PERCENT, LOCAL_TOTAL, LOCAL_IBAN_NUMBER, LOCAL_ITEM_TABLE, LOCAL_ITEM_QTY, LOCAL_ITEM_COST, LOCAL_ITEM_TOTAL, LOCAL_ITEM_TITLE, LOCAL_ITEM_DESCRIPTION} from '@/consts/local.js';
import Dom from "@/consts/dom";
import InvoiceVO from '@/model/vos/InvoiceVO.js';
import ItemVO from '@/model/vos/ItemVO.js';
import { disableButtonWhenTextInvalid } from '@/utils/domUtils.js';
import { isStringNotNumberAndNotEmpty, isNumberWithMaxLength, isOnlyNumbers, isNotLongerThenMaxLength, isOneLine, stylizeIBAN } from '@/utils/stringUtils.js';
import { localStorageSaveListOfWithKey } from '@/utils/databaseUtils.js';
import { $, wrapDevOnlyConsoleLog } from '@/utils/generalUtils.js';
import ItemView from '@/view/ItemView.js';
import ServerService from '@/services/ServerService.js';

/*$(Dom.BTN_DELETE_WORK_ITEM_POPUP).addEventListener('click', onBtnDeleteWorkItemPopupClick);
$(Dom.OVERLAY_WORK_ITEM_POPUP).addEventListener('click', onOverlayWorkItemPopupClick);*/
$(Dom.BTN_CLOSE_WORK_ITEM_POPUP).addEventListener('click', onBtnCloseWorkItemPopupClick);
$(Dom.INPUT_WORK_ITEM_QTY).addEventListener('keyup', onInputWorkItemQtyKeyup);
$(Dom.INPUT_WORK_ITEM_COST).addEventListener('keyup', onInputWorkItemCostKeyup);
/*$(Dom.BTN_CREATE_WORK_ITEM).addEventListener('click', onBtnCreateWorkItemKeyup);
$(Dom.INPUT_WORK_ITEM_TITLE).addEventListener('keyup', onInputWorkItemTitleKeyup);
$(Dom.INPUT_WORK_ITEM_DESCRIPTION).addEventListener('keyup', domInputWorkItemDescriptionKeyup);
*/
$(Dom.INPUT_INVOICE_NUMBER).addEventListener('keyup', onInputInvoiceNumberKeyup);
//$(Dom.TABLE_WORK_ITEMS).addEventListener('click', onInputDomeItemClicked);
$(Dom.BTN_ADD_WORK_ITEM).addEventListener('click', onBtnAddWorkItemClick);
$(Dom.INPUT_DISCOUNT_PERCENT).addEventListener('keyup', onInputDiscountPercentKeyup);
$(Dom.INPUT_IBAN_NUMBER).addEventListener('keyup', onInputIBANNumberKeyup);

let tableOfItems = [];

let selectedItemVO = null;
let selectedItemViewItem = null;

const serverService = new ServerService('http://localhost:3003');

const hasSelectedItem = () => !!selectedItemVO;
const findItemById = (id) => tableOfItems.find((vo) => vo.id === id);

wrapDevOnlyConsoleLog();

/*
ServerService
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
    let inputValue = Dom.INPUT_INVOICE_NUMBER.value;
    console.log('> onInputInvoiceNumberKeyup:', inputValue);
    if (isStringNotNumberAndNotEmpty(inputValue)) {
        if (isNumberWithMaxLength(inputValue, 4)) {
            await saveInvoice();
            localStorage.setItem(LOCAL_INVOICE_NUMBER, inputValue);
        } else alert('Keyup error: is number longer than max length');
    } else alert('Keyup error: is not string, number or empty');
}

function onBtnAddWorkItemClick () {
    $(Dom.POPUP_WORK_ITEM_CONTAINER).hidden = false;
}

function onBtnCloseWorkItemPopupClick () {
    $(Dom.POPUP_WORK_ITEM_CONTAINER).hidden = true;
}

async function onInputDiscountPercentKeyup() {
    const discountPercent = $(Dom.INPUT_DISCOUNT_PERCENT).value;
    await saveInvoice();
    localStorage.setItem(LOCAL_DISCOUNT_PERCENT, discountPercent);
    await calculateInvoice();
}

async function calculateInvoice() {
    const subtotal = localStorage.getItem(LOCAL_SUBTOTAL);
    const discount = localStorage.getItem(LOCAL_DISCOUNT_PERCENT);
    const total = subtotal * (1 - discount / 100);
    localStorage.setItem(LOCAL_TOTAL, `${total}`);
    await saveInvoice();
    $(Dom.RESULTS_SUBTOTAL_CONTAINER).value = subtotal;
    $(Dom.RESULTS_DISCOUNT_CONTAINER).value = discount;
    $(Dom.RESULTS_TOTAL_CONTAINER).value = total;
}

async function onInputIBANNumberKeyup() {
    const inputValue = Dom.INPUT_IBAN_NUMBER.value;
    console.log('> onInputIBANNumberKeyup:', inputValue);
    const savedInvoiceNumber = localStorage.getItem(LOCAL_IBAN_NUMBER);
    if (inputValue !== savedInvoiceNumber) {
        if (isStringNotNumberAndNotEmpty(inputValue)) {
            if (isNotLongerThenMaxLength(inputValue, 30)) {
                const stylizedInputValue = stylizeIBAN(inputValue);
                await saveInvoice();
                localStorage.setItem(LOCAL_IBAN_NUMBER, stylizedInputValue);
                $(Dom.INPUT_IBAN_NUMBER).value = stylizedInputValue;
                await onInputIBANNumberKeyup();
            }
        }
    }
}

async function saveInvoice() {
    const invoiceVO = create_Invoice();
    await ServerService
        .saveInvoice(invoiceVO)
        .then((data) => {
            console.log('> saveInvoice: saved =', data);
        })
        .catch(alert);
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

function render_ItemTableInContainer(tableOfItems, container) {
    let output = '';
    let itemVO;
    for (let index in tableOfItems) {
        inputVO = tableOfItems[index];
        output += ItemView.createSimpleViewFromVO(index, ItemVO);
    }
    container.innerHTML = output;
}

async function onInputWorkItemQtyKeyup() {
    const itemQty = $(Dom.INPUT_WORK_ITEM_QTY).value;
    await updateItem();
    localStorage.setItem(LOCAL_ITEM_QTY, itemQty);
    await calculateItem();
}

async function onInputWorkItemCostKeyup() {
    const itemCost = $(Dom.INPUT_WORK_ITEM_COST).value;
    await updateItem();
    localStorage.setItem(LOCAL_ITEM_COST, itemCost);
    await calculateItem();
}

async function calculateItem () {
    const qty = localStorage.getItem(LOCAL_ITEM_COST);
    const cost = localStorage.getItem(LOCAL_ITEM_COST);
    const total = qty * cost;
    localStorage.setItem(LOCAL_ITEM_TOTAL, `${total}`);
    await updateItem();
    $(Dom.WORK_ITEM_TOTAL_CONTAINER).value = total;
}