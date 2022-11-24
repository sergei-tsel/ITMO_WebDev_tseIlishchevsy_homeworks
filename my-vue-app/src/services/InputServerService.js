const DATA_INPUT_TABLE_RESOURCE = 'inputs';

function processResponse(response, methodName) {
  console.log(`> ServerService -> ${methodName}: response.data =`, response);
  if (response.ok === false) throw new Error(`ServerService - ${methodName}: error(${response.statusText})`);
  return response.json();
}

class InputServerService {
  constructor(url) {
    console.log('> ServerService -> constructor', url);
    this.url = url;
  }

  get path() {
    return `${this.url}/${DATA_INPUT_TABLE_RESOURCE}`;
  }

  async requestInputs() {
    console.log(`> ServerService -> requestInputs`);
    try {
      const tableOfInput = await fetch(this.path, {
        method: 'GET',
      }).then((response) => processResponse(response, 'requestInputs'));
      console.log(`> ServerService -> requestInputs: tableOfInput =`, tableOfInput);
      return tableOfInput;
    } catch (error) {
      console.log(`> ServerService -> requestInputs: error = ${error}`);
      throw error;
    }
  }

  async saveInput(inputVO) {
    console.log(`> ServerService -> saveInput: inputVO`, inputVO);
    return fetch(this.path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputVO),
    })
        .then((response) => processResponse(response, 'saveInput'))
        .catch((error) => {
          console.log(`> ServerService -> saveInput: error = ${error}`);
          throw error;
        });
  }

    async deleteInput(id) {
        return fetch(`${this.path}/${id}`, { method: 'DELETE' })
            .then((response) => processResponse(response, 'deleteInput'))
            .catch((error) => {
                console.log('> ServerService -> deleteInput: error = ${error}');
                throw error;
            });
    }
}

export default InputServerService;