const fp = require('../Additions')
// 2. КОРЗИНА

export const basket = Vue.component('basket', {
    props: ['items_in_basket', 'close_btn', 'total_in_basket'],
    methods: {
        // updateCount(id, count) {
        //     console.log('Обновлено количество', id, count);
        // },
    },
    template: `
        <div class="wrap">
        
            <div class="basket_block">
                <h2 v-if="!items_in_basket.length">Корзина пуста!</h2>
                <div class="topBtn">
                            <h3>Добавленные товары в корзину:</h3>
                            <button class="btn close" @click="$emit('close_btn')">Х</button>
                </div>
                <items-basket v-for="item in items_in_basket" v-bind:item="item" 
                @update:count="$emit('update:count', {id: item.id, count: item.count})" 
                @delete_item="$emit('delete', item.id)">
                </items-basket>
                <h3>Итоговая стоимость товаров в корзине: {{ total_in_basket }} руб.</h3>
            </div>
        </div>

    `,
});


export const itemsBasket = Vue.component('items-basket', {
    props: ['item'],
    methods: {
        imgUrl(file_name) {
            return fp.fullImgUrl(file_name);
        },

        formatPrice(price) {
            return fp.getFormatPrice(price);
        },

    },
    template: `
        <div class="item_row">
            <div class="td_image">
                <img v-bind:src="imgUrl(item.data.img)" alt="item.title">
            </div>
            <div class="td_description justify">
                <p>{{ item.data.title }}</p>
            </div>
            <div class="td_price justify">
                <p>{{ formatPrice(item.data.price) }} {{ item.data.currency }}</p>
            </div>
            <div class="td_count justify">
                <input type="number" name="" id="" min=0  v-model="item.count" @input="$emit('update:count')" value = "1">
            </div>
            <div class="td_total justify">
                <span>{{ formatPrice(item.total) }} {{ item.data.currency }}</span>
            </div>
            <div class="td_delete justify">
                <button class="btn" @click ="$emit('delete_item')" v-bind:id="item.id">удалить</button>
            </div>
        </div>
    `
});