// TODO: при разделении не получается пробросить события в основное приложение !!!

// ------ Компоненты
// 1. КАРТОЧКИ ТОВАРОВ В КАТАЛОГЕ (УЧИТЫВАТ ФИЛЬТР)

// Использует вложенный компонент product-card
export const ItemsGoods = Vue.component('products-list', {
    props: ['filtered_items', 'data_state'], 
    
    template: `
        <div class="goods-list" v-if="data_state">
                <product-card v-for="item in filtered_items" v-bind:item = "item"></product-card>
        </div>
    `,
});

// Оформление карточки товара
export const CardGood = Vue.component('product-card', {
    props: ['item'],
    methods: {
        imgUrl(file_name) {
            return file_name ? `img/${file_name}` : `img/default.jpg`;
        }, 

        formatPrice(price) {
            return new Intl.NumberFormat("ru-RU", {
                minimumFractionDigits: 0
            }).format(price);
        },

        addToBasket(event) {
            // Если в корзине был ранее добавлен данные товар, то увеличиваем счетчик на +1
            const addId = event.target.id;
            const objInBasket = app.itemsInBasket.find((item) => item.id == addId);
            let count = 1;
            if (objInBasket) {
                count = Number(objInBasket.count) + 1;
            }
            app.fetchAddInBasket(event.target.id, count, false);
            console.log(event.target.id);
        },

        searchInBasket(itemCat) {
            let obj = app.itemsInBasket.find((item) => itemCat.id == item.id);
            return obj ? false: true;
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
            <button v-if="searchInBasket(item)" class="btn btn_item" v-bind:id="item.id" @click="addToBasket">В корзину</button>
            <button v-else class="btn btn_item in_bsk" v-bind:id="item.id">Уже в корзине</button>
        </div> 
    `,
});