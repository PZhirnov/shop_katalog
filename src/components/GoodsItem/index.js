const fp = require('../Additions')
// 1. КАРТОЧКИ ТОВАРОВ В КАТАЛОГЕ (УЧИТЫВАТ ФИЛЬТР)

// Использует вложенный компонент product-card
export const productsList = Vue.component('products-list', {
    props: ['filtered_items', 'data_state', 'items_basket'],
    methods: {
        goodInBasket(item, items_in_basket) {
            let obj = items_in_basket.find((item_bsk) => item_bsk.id == item.id);
            return obj ? false : true;
        },
    },
    template: `
            <div class="goods-list" v-if="data_state">
                <product-card v-for="item in filtered_items" v-bind:item = "item" 
                v-bind:good_in_bsket = "goodInBasket(item, items_basket)" 
                @add_good="$emit('add', item.id)"></product-card>
            </div>
        `,
});


// Оформление карточки товара
export const productCard = Vue.component('product-card', {
    props: ['item', "good_in_bsket"],
    methods: {
        imgUrl(file_name) {
            return fp.fullImgUrl(file_name);
        },

        formatPrice(price) {
            return fp.getFormatPrice(price);
        },
    },
    template: `
            <div class="item">
                <div class="img_block">
                    <img v-bind:src="imgUrl(item.img)" v-bind:alt="item.title">
                </div>
                <span class="category_name">{{ item.category }}</span>
                <a href="#" class="title_for_item" v-bind:id="item.id">{{ item.title }}</a>
                <span class="price_item">{{ formatPrice(item.price) }} {{ item.currency }}</span>
                <button v-if="good_in_bsket" class="btn btn_item" v-bind:id="item.id" v-on:click = "$emit('add_good', item.id)">В корзину</button>
                <button v-else class="btn btn_item in_bsk" v-bind:id="item.id">Уже в корзине</button>
            </div> 
        `,
});
