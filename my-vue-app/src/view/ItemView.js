class ItemView {
    static INPUT_VIEW_ITEM = 'inputitem';

    static isDomElementMatch(domElement) {
        return domElement.dataset.type === ItemView.INPUT_VIEW_ITEM;
    }


    static createSimpleViewFromVO(vo) {
        return `
            <div id="${vo.title.id}" style="display: grid; grid-template-columns: repeat(4, 1fr); 8 -moz-user-select: none  items-center border-b-1 py-2 hover:bg-gray-100">
                <div style="grid-column-start: 1; col-span-4 self-end pl-2 pr-3">
                    <div style="font: bold">${vo.title.title}</div>
                    <div style="color: gray">${vo.title.description}</div>
                </div>
                <div style="grid-column-start: 5">${vo.title.cost}</div>
                <div style="grid-column-start: 6">${vo.title.qty}</div>
                <div style="col-span-2 text-right pr-2">${vo.title.total}</div>
            </div>
        `;
    }
}

export default ItemView;