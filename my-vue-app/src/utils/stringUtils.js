function isStringNotNumberAndNotEmpty(value) {
    const isValueString = typeof value === "string";
    const isValueNotNumber = typeof isNaN(parseInt(value));

    const result = isValueString && isValueNotNumber && value.length > 0;

    console.log('> utils -> string: isStringNotNumberAndNoEmpty => result', {
        result,
        isInputValueString: isValueString,
        isInputValueNotNumber: isValueNotNumber,
    });
    return result;
}

function isNumberWithMaxLength(value, maxLength) {
    const isValueNumber = isOnlyNumbers(value);
    const isValueWithMaxLength = isNotLongerThenMaxLength(value, maxLength);

    const result = isValueNumber && isValueWithMaxLength;

    console.log('> utils -> string: isNumberWithMaxLength => result', {
        result,
        isInputValueNumber: isValueNumber,
        isInputValueWithMaxLength: isValueWithMaxLength,
    });
    return result;
}

function isOnlyNumbers(value) {
    const isValueNotOnlyNumbers = value.search("/\D/");
    return !isValueNotOnlyNumbers;
}

function isNotLongerThenMaxLength(value, maxLength) {
    return value.length <= maxLength;
}

function isOneLine(value) {
    const isNotNewLine = value.search("/\\n/");
    console.log('> utils -> string: isOneLine:', !isNotNewLine);
    return !isNotNewLine;
}

function stylizeIBAN(value) {
    let array = [];
    for(let i = 0; i < 30; i + 4) {
        let subValue = value.substr(i, 4);
        array.push(subValue);
    }
    const stylizedValue = array.join(' ');
    console.log('> utils -> string: stylizedIBAN => stylizedValue:', stylizedValue);
    return stylizedValue;
}

export { isStringNotNumberAndNotEmpty, isNumberWithMaxLength, isOnlyNumbers, isNotLongerThenMaxLength, isOneLine, stylizeIBAN };