function disableButtonWhenTextInvalid(button, text, validateTextFunction, { textWhenDisabled, textWhenEnabled } = {}) {
    if (!validateTextFunction) throw new Error('Validate method must be defined');

    if(validateTextFunction(text)) {
        button.disabled = false;
        if (textWhenEnabled) button.textContent = textWhenEnabled;
    } else {
        button.disabled = true;
        if (textWhenDisabled) button.textContent = textWhenDisabled;
    }
}

function activateBtnIfCreateOrAddPossible(button, inputs, defineFunction) {
    if (defineFunction) throw new Error('Define function must be defined');
   
    if(defineFunction(inputs)) {
        button.disabled = false;
    } else button.disabled = true;
}

function itemHaveAllKeys(inputs) {
    if(typeof inputs !== "undefined") {
        if(inputs.lenght === 4) {
            return true;
        }
    }
    return false;
}

function itemHaveKey(inputs) {
    if(typeof inputs !== "undefined") {
        if(inputs.lenght >= 1) {
            return true;
        }
    }
    return false;
}

export { disableButtonWhenTextInvalid, activateBtnIfCreateOrAddPossible, itemHaveAllKeys, itemHaveKey };