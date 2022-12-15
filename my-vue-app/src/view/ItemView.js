class ItemView {
    static INPUT_VIEW_ITEM = 'inputitem';

    static isDomElementMatch(domElement) {
        return domElement.dataset.type === ItemView.INPUT_VIEW_ITEM;
    }


    static createSimpleViewFromVO(vo) {
        return `
            <div class="vo" id="${vo.id}" style="display: grid; 
            grid-template-columns: repeat(8, 1fr); user-select: none; align-items: center; 
            border-bottom-width: 1px; padding-top: 0.5rem; padding-bottom: 0.5rem; 
            :hover { background-color: rgb(243 244 246); }">
                <div style="grid-column-start: 1; grid-column: span 4; align-self: end;
                padding-left: 2px; padding-right: 3px">
                    <div style="font-weight: 700">${vo.title.title}</div>
                    <div style="font-size: 0.75rem; line-height: 1rem; 
                    color: rgb(156 163 175);">${vo.title.description}</div>
                </div>
                <div style="grid-column-start: 5">${vo.title.cost}</div>
                <div style="grid-column-start: 6">${vo.title.qty}</div>
                <div style="grid-column: span 2 / span 2; 
                text-align: right; padding-right: 2px">${vo.title.total}</div>
            </div>
        `;
    }
}

export default ItemView;