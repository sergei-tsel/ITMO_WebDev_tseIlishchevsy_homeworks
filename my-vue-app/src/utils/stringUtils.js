function isStringNotNumberAndNotEmpty(value) {
    const isValueString = typeof value === "string";
    const isValueNotNumber = typeof isNaN(parseInt(value));

    if (isValueString) {
        if (isValueNotNumber) {
            if (value.length > 0) {
                return true;
            } else return false;
        } else return false;
    } else return false;

    const result = isValueString && isValueNotNumber && value.length > 0;

    console.log('> utils -> string: isStringNotNumberAndNoEmpty => result', {
        result,
        isInputValueString: isValueString,
        isInputValueNotNumber: isValueNotNumber,
    });
    return result;
}

export { isStringNotNumberAndNotEmpty };