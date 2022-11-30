class ItemView {
    static INPUT_VIEW_ITEM = 'inputitem';

    static isDomElementMatch(domElement) {
        return domElement.dataset.type === ItemView.INPUT_VIEW_ITEM;
    }


    static createSimpleViewFromVO(index, vo) {
        return `
           <div class="pointer-events-none grid grid-cols-8 select-none items-center border-b-1  py-2 hover:bg-gray-100">
              <div class="col-span-4 self-end pl-2 pr-3">
                 <div class="font-bold">vo.title</div>
                 <div class="text-xs text-gray-400">vo.description</div>
              </div>
              <div>vo.qty</div>
              <div>vo.cost</div>
              <div class="col-span-2 text-right pr-2">vo.total</div>
           </div>
        `;
    }
}

export default ItemView;