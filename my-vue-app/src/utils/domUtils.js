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

function activateBtnIfCreateOrAddPossible(button, keys, key) {
    if (!keys && !key) throw new Error('Keys must be defined');
    if(button.value === "Create") {
        if(keys) {
           button.disabled = false;
        } else button.disabled = true;
    }
    if(button.value === "Add") {
        if(key) {
            button.disabled = false;
        } else button.disabled = true;
    }
}

function itemHaveAllKeys(qty, cost, title, description) {
    if(qty.value !== '') {
        if(cost.value !== '') {
            if(title.value !== '') {
                if(description.value !== '') {
                    return true;
                }
            }
        }
    }
    return false;
}

function itemHaveKey(qty, cost, title, description) {
    if(qty.value === '') {
        if(cost.value === '') {
            if(title.value === '') {
                if(description.value === '') {
                    return false;
                }
            }
        }
    }
    return true;
}

export { disableButtonWhenTextInvalid, activateBtnIfCreateOrAddPossible, itemHaveAllKeys, itemHaveKey };