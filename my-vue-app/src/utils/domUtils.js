function activateBtnIfCreateOrAddPossible(button, inputs, defineFunction) {
    if (!defineFunction) throw new Error('Define function must be defined');
   
    if(defineFunction(inputs)) {
        button.disabled = false;
    } else button.disabled = true;
}

function itemHaveAllKeys(inputs) {
    if(isPropertyDefine(inputs.qty.value)) {
        if(isPropertyDefine(inputs.cost.value)) {
            if(isPropertyDefine(inputs.title.value)) {
                if(isPropertyDefine(inputs.description.value)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function itemHaveKey(inputs) {
    if(!isPropertyDefine(inputs.qty.value)) {
        if(!isPropertyDefine(inputs.cost.value)) {
            if(!isPropertyDefine(inputs.title.value)) {
                if(!isPropertyDefine(inputs.description.value)) {
                    return false;
                }
            }
        }
    }
    return true;
}

function isPropertyDefine(property) {
    if (typeof property !== "undefined" ) {
        if (Boolean(property)) {
            return true;
        }
    }
    return false;
}

export { activateBtnIfCreateOrAddPossible, itemHaveAllKeys, itemHaveKey };