import {LOCAL_ITEM_TABLE, LOCAL_ITEM_TITLE, LOCAL_ITEM_DESCRIPTION} from '@/consts/local.js';
import Dom from "@/consts/dom";
import InvoiceVO from '@/model/vos/InvoiceVO.js';
import InputVO from '@/model/vos/InputVO.js';
import { disableButtonWhenTextInvalid } from '@/utils/domUtils.js';
import { isStringNotNumberAndNotEmpty } from '@/utils/stringUtils.js';
import { localStorageSaveListOfWithKey } from '@/utils/databaseUtils.js';
import { $, wrapDevOnlyConsoleLog } from '@/utils/generalUtils.js';
import InputView from '@/view/InputView.js';
import ServerService from '@/services/ServerService.js';

/*$(Dom.BTN_DELETE_WORK_ITEM_POPUP).addEventListener('click', onBtnDeleteWorkItemPopupClick);
$(Dom.OVERLAY_WORK_ITEM_POPUP).addEventListener('click', onOverlayWorkItemPopupClick);*/
$(Dom.BTN_CLOSE_WORK_ITEM_POPUP).addEventListener('click', onBtnCloseWorkItemPopupClick);
/*$(Dom.INPUT_WORK_ITEM_QTY).addEventListener('keyup', onInputWorkItemQtyKeyup);
$(Dom.INPUT_WORK_ITEM_COST).addEventListener('keyup', onInputWorkItemCostKeyup);
$(Dom.BTN_CREATE_WORK_ITEM).addEventListener('click', onBtnCreateWorkItemKeyup);
$(Dom.INPUT_WORK_ITEM_TITLE).addEventListener('keyup', onInputWorkItemTitleKeyup);
$(Dom.INPUT_WORK_ITEM_DESCRIPTION).addEventListener('keyup', domInputWorkItemDescriptionKeyup);

$(Dom.INPUT_INVOICE_NUMBER).addEventListener('keyup', onInputInvoiceNumberKeyup);
$(Dom.TABLE_WORK_ITEMS).addEventListener('click', onInputDomeItemClicked);*/
$(Dom.BTN_ADD_WORK_ITEM).addEventListener('click', onBtnAddWorkItemClick);
/*$(Dom.INPUT_DISCOUNT_PERCENT).addEventListener('keyup', onInputDiscountPercentKeyup);
$(Dom.INPUT_TAX_PERCENT).addEventListener('keyup', onInputTaxPercentKeyup);
$(Dom.INPUT_IBAN_NUMBER).addEventListener('keyup', onInputIBANNumberKeyup);*/

let tableOfInputs = [];
let selectedInputVO = null;
let selectedInputViewItem = null;

const serverService = new ServerService('http://localhost:3003');

const hasSelectedInput = () => !!selectedInputVO;
const findTodoById = (id) => tableOfInputs.find((vo) => vo.id === id);

wrapDevOnlyConsoleLog();
/*
inputServerService
    .requestInputs()
    .then((inputTable) => {
        console.log('> Initial env:', import.meta.env);
        console.log('> Initial value:', inputTable);

        tableOfInputs = inputTable;
        $(Dom.INPUT_WORK_ITEM_TITLE).value = localStorage.getItem(LOCAL_ITEM_TITLE);
        render_InputTableInContainer(tableOfInputs, $(Dom.TABLE_WORK_ITEMS));
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
function onBtnAddWorkItemClick () {
    $(Dom.POPUP_WORK_ITEM_CONTAINER).hidden = false;
    console.log($(Dom.POPUP_WORK_ITEM_CONTAINER).hidden);
}

function onBtnCloseWorkItemPopupClick () {
    $(Dom.POPUP_WORK_ITEM_CONTAINER).hidden = true;
}

function render_InputTableInContainer(tableOfInputs, container) {
    let output = '';
    let inputVO;
    for (let index in tableOfInputs) {
        inputVO = tableOfInputs[index];
        output += InputView.createSimpleViewFromVO(index, inputVO);
    }
    container.innerHTML = output;
}