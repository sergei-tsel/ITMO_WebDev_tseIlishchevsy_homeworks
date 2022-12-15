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
    return !isNaN(value);
}

function isNotLongerThenMaxLength(value, maxLength) {
    return value.length <= maxLength;
}

function isOneLine(value) {
    const str = String(value);
    const isNotNewLine = str.match("/\\n/");
    const result = (isNotNewLine === null);
    console.log('> utils -> string: isOneLine:', result);
    return result;
}

function stylizeIBAN(value) {
    value = String(value);
    value = value.replace(/\s/g,'');
    const stylizedValue = getSubstr(value);
    console.log('> utils -> string: stylizedIBAN => stylizedValue:', stylizedValue);
    return stylizedValue;
}

function getSubstr(value) {
    const str = String(value);
    if(str.length < 5) {
        return str;
    }
    let subStr = str.slice(0, 4);
    subStr =  subStr + ' ';
    let strEnd = str.slice(4);
    strEnd = getSubstr(strEnd);
    return subStr + strEnd;
}

export { isStringNotNumberAndNotEmpty, isNumberWithMaxLength, isOnlyNumbers, isNotLongerThenMaxLength, isOneLine, stylizeIBAN };