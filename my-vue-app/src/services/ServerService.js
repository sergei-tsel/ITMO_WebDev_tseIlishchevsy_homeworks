const DATA_INVOICE_RESOURCE = 'invoice';
const DATA_INPUT_TABLE_RESOURCE = 'inputs';

function processResponse(response, methodName) {
  console.log(`> ServerService -> ${methodName}: response.data =`, response);
  if (response.ok === false) throw new Error(`ServerService - ${methodName}: error(${response.statusText})`);
  return response.json();
}

class ServerService {
  constructor(url) {
    console.log('> ServerService -> constructor', url);
    this.url = url;
  }

  get invoicePath() {
    return `${this.url}/${DATA_INVOICE_RESOURCE}`;
  }

  get inputsPath() {
    return `${this.url}/${DATA_INPUT_TABLE_RESOURCE}`;
  }

  async requestInvoice() {
    const path = this.invoicePath;
    await this.request(path, 'invoice');
  }

  async saveInvoice(invoiceVO) {
    const path = this.invoicePath;
    await this.save(invoiceVO, path, 'invoice');
  }

  async updateInvoice(number) {
    const path = `${this.invoicePath}/${number}`;
    await this.update(path, 'invoice');
  }

  async deleteInvoice(number) {
    const path = `${this.invoicePath}/${number}`;
    await this.delete(path, 'invoice');
  }

  async requestInputs() {
    const path = this.inputsPath
    await this.request(path, 'tableOfInput');
  }

  async saveInputs(inputVO) {
    const path = this.inputsPath
    await this.save(inputVO, path, 'tableOfInput');
  }

  async updateInputs(id) {
    const path = `${this.invoicePath}/${id}`;
    await this.update(path, 'tableOfInput');
  }

  async deleteInputs(id) {
    const path = `${this.inputsPath}/${id}`
    await this.delete(path, 'tableOfInput');
  }

  async request(path, dataName) {
    console.log(`> ServerService -> request: ${dataName}`);
    try {
      const data = await fetch(path, {
        method: 'GET',
      }).then((response) => processResponse(response, 'request'));
      console.log(`> ServerService -> request: ${dataName} =`, data);
      return data;
    } catch (error) {
      console.log(`> ServerService -> request: error = ${error}`);
      throw error;
    }
  }

  async save(vo, path, dataName) {
    console.log(`> ServerService -> save: ${dataName}`, vo);
    return fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vo),
    })
      .then((response) => processResponse(response, 'save'))
      .catch((error) => {
        console.log(`> ServerService -> save: error = ${error}`);
        throw error;
      });
  }

  async update(vo, path, dataName) {
    console.log(`> ServerService -> update: ${dataName}`, vo);
    return fetch(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vo),
    })
        .then((response) => processResponse(response, 'update'))
        .catch((error) => {
          console.log(`> ServerService -> update: error = ${error}`);
          throw error;
        });
  }

  async delete(path, dataName) {
    console.log(`> ServerService -> delete: ${dataName}`);
    return fetch(path, { method: 'DELETE' })
      .then((response) => processResponse(response, 'delete'))
      .catch((error) => {
        console.log('> ServerService -> delete: error = ${error}');
        throw error;
      });
  }
}

export default ServerService;