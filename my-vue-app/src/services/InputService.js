class InputService {
    constructor(checkMethod) {
        console.log('> InputService -> constructor', checkMethod);
        this.checkMethod = checkMethod;
    }

    setInput(input) {
        this.input = input;
    }

    validateInput(validateMethod = null, validateProperty = null) {
        if(this.check()) {
            if(typeof validateMethod === "function") {
                if(this.validate(validateMethod, validateProperty)) {
                    return  true;
                }
                return false;
            }
            return true;
        }
        return false;
    }

    check() {
        if(this.checkMethod(this.input.value)) {
            return true;
        }
        return false;
    }

    validate(validateMethod, validateProperty) {
        if(validateMethod(this.input.value, validateProperty)) {
            return true;
        }
        return false;
    }

    reset() {
        this.input.value = '';
    }
}

export default InputService;