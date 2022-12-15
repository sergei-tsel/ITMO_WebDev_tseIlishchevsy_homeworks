function localStorageSaveListOfWithKey(key, list) {
    localStorage.setItem(key, JSON.stringify(list));
}

function localStorageDeleteListOfWithKey(key) {
    localStorage.removeItem(key);
}

export { localStorageSaveListOfWithKey, localStorageDeleteListOfWithKey };