
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

domInputInvoiceNumber.addEventListener('keyup', onInputInvoiceNumberKeyup);
domBtnAddWorkItem.addEventListener('click', onBtnAddWorkItemClick);
domInputDiscountPercent.addEventListener('keyup', onInputDiscountPercentKeyup);
domInputTaxPercent.addEventListener('keyup', onInputTaxPercentKeyup);
domInputIBANNumber.addEventListener('keyup', onInputIBANNumberKeyup);