const DATA_INVOICE_RESOURCE = 'invoice';
const DATA_ITEM_TABLE_RESOURCE = 'items';

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

  get itemsPath() {
    return `${this.url}/${DATA_ITEM_TABLE_RESOURCE}`;
  }

  async saveInvoice(invoiceVO) {
    const path = this.invoicePath;
    return await this.save(invoiceVO, path, 'invoice');
  }

  async requestItems() {
    const path = this.itemsPath
    return await this.request(path, 'tableOfItems');
  }

  async saveItems(itemVO) {
    const path = this.itemsPath
    return await this.save(itemVO, path, 'tableOfItems');
  }

  async updateItems(id) {
    const path = `${this.itemsPath}/${id}`;
    return await this.update(path, 'tableOfItems');
  }

  async deleteItems(id) {
    const path = `${this.itemsPath}/${id}`
    return await this.delete(path, 'tableOfItems');
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