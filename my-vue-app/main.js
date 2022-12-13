import { LOCAL_INVOICE_LIST, LOCAL_ITEM_LIST, LOCAL_ITEMS_TABLE } from '@/consts/local.js';
import Dom from "@/consts/dom";
import InvoiceVO from '@/model/vos/InvoiceVO.js';
import ItemVO from '@/model/vos/ItemVO.js';
import { disableButtonWhenTextInvalid, activateBtnIfCreateOrAddPossible, itemHaveAllKeys, itemHaveKey } from '@/utils/domUtils.js';
import { isStringNotNumberAndNotEmpty, isNumberWithMaxLength, isOnlyNumbers, isNotLongerThenMaxLength, isOneLine, stylizeIBAN } from '@/utils/stringUtils.js';
import { localStorageListOf, localStorageSaveListOfWithKey, localStorageDeleteListOfWithKey } from '@/utils/databaseUtils.js';
import { delay, wrapDevOnlyConsoleLog, $ } from '@/utils/generalUtils.js';
import ItemView from '@/view/ItemView.js';
import ServerService from '@/services/ServerService.js';
import FormService from '@/services/FormService.js';
import InputService from '@/services/InputService.js';

$(Dom.BTN_DELETE_WORK_ITEM_POPUP).addEventListener('click', clickDeleteBtn);
$(Dom.OVERLAY_WORK_ITEM_POPUP).addEventListener('click', clickOverlayWorkItem);
$(Dom.BTN_CLOSE_WORK_ITEM_POPUP).addEventListener('click', clickCloseBtn);
$(Dom.INPUT_WORK_ITEM_QTY).addEventListener('keyup', keyupQty);
$(Dom.INPUT_WORK_ITEM_COST).addEventListener('keyup', keyupCost);
$(Dom.BTN_CREATE_WORK_ITEM).addEventListener('click', clickCreateBtn);
$(Dom.INPUT_WORK_ITEM_TITLE).addEventListener('keyup', keyupTitle);
$(Dom.INPUT_WORK_ITEM_DESCRIPTION).addEventListener('keyup', keyupDescription);

$(Dom.INPUT_INVOICE_NUMBER).addEventListener('keyup', keyupInvoiceNumber);
$(Dom.TABLE_WORK_ITEMS).addEventListener('click', clickItem);
$(Dom.BTN_ADD_WORK_ITEM).addEventListener('click', clickAddBtn);
$(Dom.INPUT_DISCOUNT_PERCENT).addEventListener('keyup', keyupDiscountPercent);
$(Dom.INPUT_IBAN_NUMBER).addEventListener('keyup', keyupIBANNumber);

let tableOfItems = [];

let selectedItemVO = null;

let workItemMode = null;

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
const invoiceInputs = { number: $(Dom.INPUT_INVOICE_NUMBER), discount: $(Dom.INPUT_DISCOUNT_PERCENT), iban: $(Dom.INPUT_IBAN_NUMBER) };
const invoiceContainers = { subtotal: $(Dom.RESULTS_SUBTOTAL_CONTAINER), discount: $(Dom.RESULTS_DISCOUNT_CONTAINER), total: $(Dom.RESULTS_TOTAL_CONTAINER) };
const invoiceFormService = new FormService(invoiceInputs, invoiceContainers);
const invoiceList = invoiceFormService.getList();

const itemInputs = { qtu: $(Dom.INPUT_WORK_ITEM_QTY), cost: $(Dom.INPUT_WORK_ITEM_COST), title: $(Dom.INPUT_WORK_ITEM_TITLE), description: $(Dom.INPUT_WORK_ITEM_DESCRIPTION) };
const itemContainers = { total: $(Dom.WORK_ITEM_TOTAL_CONTAINER) };
const itemFormService = new FormService(itemInputs, itemContainers);
const itemList = itemFormService.getList();

const inputService = new InputService(isStringNotNumberAndNotEmpty);

async function keyupInvoiceNumber() {
    inputService.setInput($(Dom.INPUT_INVOICE_NUMBER));
    console.log('> keyupInvoiceNumber:', inputService.input.value);
    if (inputService.validateInput(isNumberWithMaxLength, 4)) {
        await save_Invoice();
    } else {
        inputService.reset();
        alert('Keyup error: is not string, number, empty or longer than max length');
    }
}

async function clickAddBtn() {
    $(Dom.BTN_DELETE_WORK_ITEM_POPUP).disabled = true;
    $(Dom.BTN_CREATE_WORK_ITEM).disabled = true;
    workItemMode = "Create";
    $(Dom.POPUP_WORK_ITEM_CONTAINER).hidden = false;
}

async function clickItem() {
    $(Dom.TITLE_WORK_ITEM_CONTAINER).value = 'Update';
    workItemMode = "Add";
    $(Dom.BTN_CREATE_WORK_ITEM).value = "Add";
    $(Dom.BTN_CREATE_WORK_ITEM).disabled = true;
    const domElement = event.target;
    selectedItemVO = findItemById(domElement.id);
    $(Dom.POPUP_WORK_ITEM_CONTAINER).hidden = false;
}

async function keyupDiscountPercent() {
    inputService.setInput($(Dom.INPUT_DISCOUNT_PERCENT));
    console.log('> keyupDiscountPercent:', inputService.input.value);
    if(inputService.validateInput(isNumberWithMaxLength, 2)) {
        await calculate_Invoice();
        await save_Invoice();
    } else inputService.reset();
}

async function keyupIBANNumber() {
    inputService.setInput($(Dom.INPUT_IBAN_NUMBER));
    console.log('> keyupIBANNumber:', inputService.input.value);
    if(inputService.validateInput(isNotLongerThenMaxLength, 30)) {
        inputService.input.value = stylizeIBAN(inputService.input.value);
        save_Invoice();
        await keyupIBANNumber();
    } else inputService.reset();
}

async function calculate_Invoice() {
    invoiceFormService.setInvoiceContainers(tableOfItems)
    await save_Invoice();
}

function create_Invoice() {
    const number = invoiceList.inputsValues.number;
    const subtotal = invoiceList.containersValues.subtotal;
    const discountPercent = invoiceList.inputsValues.discount;
    const discountSum = invoiceList.containersValues.discount;
    const total = invoiceList.containersValues.total;
    const iban = invoiceList.inputsValues.iban;
    const newInvoiceVO = InvoiceVO.createFromTitle({number, subtotal, discountPercent, discountSum, total, iban});
    console.log('> create_Invoice -> invoice =', newInvoiceVO);
    return newInvoiceVO;
}

async function save_Invoice() {
    const invoiceVO = create_Invoice();
    serverService
        .saveInvoice(invoiceVO)
        .then((data) => {
            console.log('> save_Invoice: saved =', data);
        })
        .catch(alert);
    localStorageSaveListOfWithKey(LOCAL_INVOICE_LIST, invoiceList);    
}

function render_ItemTableInContainer(tableOfItems, container) {
    let output = '';
    let itemVO;
    let itemTotals = {};
    for (let index in tableOfItems) {
        itemVO = tableOfItems[index];
        output += ItemView.createSimpleViewFromVO(index, ItemVO);
        itemTotals.push(itemVO.total);
    }
    container.innerHTML = output;
    invoiceFormService.subtotal = itemTotals.reduce((sum, current) => sum + current);
}

function clickDeleteBtn() {
    const itemId = selectedItemVO.id;
    console.log('> onBtnDeleteWorkItemPopupClick -> itemId:', itemId);
    const itemVO = findItemById(itemId);
    const result = confirm('Delete the work item?');
    if(result) {
        serverService
            .deleteItems(itemId)
            .then(async () => {
                tableOfItems.splice(tableOfItems.indexOf(itemVO), 1);
                clear_Item();
                clickCloseBtn();
                render_ItemTableInContainer(tableOfItems, $(Dom.TABLE_WORK_ITEMS));
                await calculate_Invoice();
            })
            .catch(() => {});
    }
}

function clickCloseBtn() {
    if($(Dom.BTN_CREATE_WORK_ITEM).disabled === true) {
        const result = confirm('Close the work item?');
        if(!result) {
            return;
        }
    }
    $(Dom.POPUP_WORK_ITEM_CONTAINER).hidden = true;
}

function clickOverlayWorkItem() {
    clickCloseBtn();
}

async function keyupQty() {
    inputService.setInput($(Dom.INPUT_WORK_ITEM_QTY));
    console.log('> keyupQty:', inputService.input.value);
    validate_Item(isOnlyNumbers);
    calculate_Item();
}

function keyupCost() {
    inputService.setInput($(Dom.INPUT_WORK_ITEM_COST)); 
    console.log('> keyupCost:', inputService.input.value);
    validate_Item(isOnlyNumbers);
    calculate_Item();
}

function clickCreateBtn() {
    if(workItemMode === "Create") {
        save_Item();
    } else if(workItemMode === "Add") {
       update_Item();
    }
}

function keyupTitle() {
    inputService.setInput($(Dom.INPUT_WORK_ITEM_TITLE)); 
    console.log('> keyupTitle:', inputService.input.value);
    validate_Item(isOneLine);
}

function keyupDescription() {
    inputService.setInput($(Dom.INPUT_WORK_ITEM_DESCRIPTION)); 
    console.log('> keyupDescription:', inputService.input.value);
    validate_Item();
}

function validate_Item(validateMethod = inputService.checkMethod, button = $(Dom.BTN_CREATE_WORK_ITEM)) {
    if (inputService.validateInput(validateMethod)) {
        if (button.disabled === false) {
            if (workItemMode === "Create") {
                const defineFunction = itemHaveAllKeys;
            } else if (workItemMode === "Add") {
                const defineFunction = itemHaveKey;
            }
            activateBtnIfCreateOrAddPossible(button, itemFormService.inputs, defineFunction);
        }
        return;
    }
    inputService.reset();
}

function calculate_Item() {
    itemFormService.setItemContainer();
    save_Item();
}

function create_Item() {
    const title = itemList.inputsValues.title;
    const description = itemList.inputsValues.description;
    const qty = itemList.inputsValues.title;
    const cost = itemList.inputsValues.cost;
    const total = itemList.containersValues.total;
    const newItemVO = ItemVO.createFromTitle({title, description, qty, cost, total});
    console.log('> create_Item -> item =', newItemVO);
    return newItemVO;
}

function save_Item() {
    const itemVO = create_Item();
    serverService
        .saveItems(itemVO)
        .then(async () => {
            clear_Item();
            clickCloseBtn();
            render_ItemTableInContainer(tableOfItems, $(Dom.TABLE_WORK_ITEMS));
            await calculate_Invoice();
        })
        .catch(() => {});
    localStorageSaveListOfWithKey(LOCAL_ITEM_LIST, itemList);     
    localStorageSaveListOfWithKey(LOCAL_ITEMS_TABLE, tableOfItems);
}

function update_Item() {
    serverService
        .updateItems(selectedItemVO, selectedItemVO.id)
        .then(async () => {
            clear_Item();
            clickCloseBtn();
            render_ItemTableInContainer(tableOfItems, $(Dom.TABLE_WORK_ITEMS));
            await calculate_Invoice();
        })
        .catch(() => {});
    localStorageSaveListOfWithKey(LOCAL_ITEM_LIST, itemList);
    localStorageSaveListOfWithKey(LOCAL_ITEMS_TABLE, tableOfItems);    
}

function clear_Item() {
    itemFormService.clearValues();
    localStorageDeleteListOfWithKey(LOCAL_ITEM_LIST, itemList);
}