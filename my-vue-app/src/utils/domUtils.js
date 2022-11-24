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

export { disableButtonWhenTextInvalid };