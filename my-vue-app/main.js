
const domPopupWorkItemContainer = document.getElementById('popupWorkItemContainer');
const domOverlayWorkItemPopup = document.getElementById('overlayWorkItemPopup');
const domPopupWorkItemContainerForm = document.getElementById('popupWorkItemContainerForm');
const domBtnDeleteWorkItemPopup = document.getElementById('btnDeleteWorkItemPopup');
const domBtnCloseWorkItemPopup = document.getElementById('btnCloseWorkItemPopup');
const domTitleWorkItemContainer = document.getElementById('titleWorkItemContainer');
const domInputWorkItemQty = document.getElementById('inputWorkItemQty');
const domInputWorkItemCost = document.getElementById('inputWorkItemCost');
const domWorkItemTotalContainer = document.getElementById('workItemTotalContainer');
const domBtnCreateWorkItem = document.getElementById('btnCreateWorkItem');
const domInputWorkItemTitle = document.getElementById('inputWorkItemTitle');
const domInputWorkItemDescription = document.getElementById('inputWorkItemDescription');

const domInputInvoiceNumber = document.getElementById('inputInvoiceNumber');
const domTableWorkItems = document.getElementById('domTableWorkItems');
const domBtnAddWorkItem = document.getElementById('btnAddWorkItem');
const domResultsSubtotalContainer = document.getElementById('resultsSubtotalContainer');
const domInputDiscountPercent = document.getElementById('inputDiscountPercent');
const domResultsDiscountContainer = document.getElementById('resultsDiscountContainer');
const domInputTaxPercent = document.getElementById('inputTaxPercent');
const domResultsTaxesContainer = document.getElementById('resultsTaxesContainer');
const domResultsTotalContainer = document.getElementById('resultsTotalContainer');
const domInputIBANNumber = document.getElementById('inputIBANNumber');

domBtnDeleteWorkItemPopup.addEventListener('click', onBtnDeleteWorkItemPopupClick);
domBtnCloseWorkItemPopup.addEventListener('click', onBtnCloseWorkItemPopupClick);
domInputWorkItemQty.addEventListener('keyup', onInputinputWorkItemQtyKeyup);
domInputWorkItemCost.addEventListener('keyup', onInputWorkItemCostKeyup);
domBtnCreateWorkItem.addEventListener('click', onBtnCreateWorkItemKeyup);
domInputWorkItemTitle.addEventListener('keyup', onInputWorkItemTitleKeyup);
domInputWorkItemDescription.addEventListener('keyup', domInputWorkItemDescriptionKeyup);

domInputInvoiceNumber.addEventListener('keyup', onInputInvoiceNumberKeyup);
domBtnAddWorkItem.addEventListener('click', onBtnAddWorkItemClick);
domInputDiscountPercent.addEventListener('keyup', onInputDiscountPercentKeyup);
domInputTaxPercent.addEventListener('keyup', onInputTaxPercentKeyup);
domInputIBANNumber.addEventListener('keyup', onInputIBANNumberKeyup);