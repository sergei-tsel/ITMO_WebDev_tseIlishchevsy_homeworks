function localStorageListOf(key, defaultValue = []) {
    const value = localStorage.getItem(key);
    console.log('> utils -> database: localStorageListOf: value =', value);
    if (value == null) return defaultValue;

    const parsedValue = JSON.parse(value);
    const isParsedValueArray = Array.isArray(parsedValue);

    return isParsedValueArray ? parsedValue : defaultValue;
}

function localStorageSaveListOfWithKey(key, list) {
    localStorage.setItem(key, JSON.stringify(list));
}

export { localStorageListOf, localStorageSaveListOfWithKey };