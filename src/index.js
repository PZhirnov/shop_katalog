"use strict";

import './sass/style.scss';
import Search from './components/Search';
import Buttons from './components/Buttons';
import Advert from './components/Advert';
import Error from './components/Errors';
// import Additions from './components/Additions';
import { Menu, Spinner } from './components/Additions';
import Blog from './components/Blog';
import { urlCatalog, urlBasket, urlDeleteGood, urlAddBasket } from './constants';

// TODO: Оставил компонент каталога и козины пока тут, т.к. появляется ошибка при разделении. 
// ------ Компоненты ---- 
// 1. КАРТОЧКИ ТОВАРОВ В КАТАЛОГЕ (УЧИТЫВАТ ФИЛЬТР)

// Использует вложенный компонент product-card
export default Vue.component('products-list', {
    props: ['filtered_items', 'data_state'], 
    template: `
        <div class="goods-list" v-if="data_state">
                <product-card v-for="item in filtered_items" v-bind:item = "item"></product-card>
        </div>
    `,
});

// Оформление карточки товара
Vue.component('product-card', {
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


// 2. КОРЗИНА
Vue.component('basket', {
    props: ['items_in_basket', 'close_btn', 'total_in_basket'],
    template: `
        <div class="wrap">
        
            <div class="basket_block">
                <h2 v-if="!items_in_basket.length">Корзина пуста!</h2>
                <div class="topBtn">
                            <h3>Добавленные товары в корзину:</h3>
                            <button class="btn close" @click="$emit('close_btn')">Х</button>
                </div>
                <items-basket v-for="item in items_in_basket" v-bind:item="item"></items-basket>
                <h3>Итоговая стоимость товаров в корзине: {{ total_in_basket }} руб.</h3>
            </div>
        </div>

    `,
});


Vue.component('items-basket', {
    props: ['item'],
    methods: {
        imgUrl(file_name) {
            return app.imgUrl(file_name);
        }, 

        formatPrice(price) {
            return app.formatPrice(price);
        },
        
        totalForItem(item) {
                item.total = item.data.price * item.count;
                app.fetchAddInBasket(item.id, item.count, true);
                return item.total; 
            },
            
        // TODO: добавить логику удаления товара
        deleteItem(event) {
            console.log(`Будет удален товар с id ${event.target.id}`);
            app.fetchDeleteFromBasket(event.target.id);
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
                <input type="number" name="" id="" min=0  v-model="item.count" value = "1">
            </div>
            <div class="td_total justify">
                <span>{{ formatPrice(totalForItem(item)) }} {{ item.data.currency }}</span>
            </div>
            <div class="td_delete justify">
                <button class="btn" @click="deleteItem" v-bind:id="item.id">удалить</button>
            </div>
        </div>
    `
});


// ------- ПРИЛОЖЕНИЕ -------
const app = new Vue({
    el: "#app",

    data: {
        items: [],
        filteredItems: [],
        dataState: false,
        errData: false,
        isVisibleCart: true,
        searchLine: '',
        itemsInBasket: [],
    },

    computed: {
        // Общая стоимость товаров в каталоге
        totalPriceItems() {
            return this.filteredItems.reduce((prev, { price }) => {
                let price_valid = price ? parseFloat(price) : 0;
                return prev + price_valid;
            }, 0)
        },

        // Стоимость товара в корзине с учетом количества
        totalInBasket() {
            return this.itemsInBasket.reduce((prev, item) => {
                return prev + item.data.price * item.count;
            }, 0)
        },
    },

    methods: {
        // Загрузка данных с API
        fetchItems() {
            setTimeout(() => {
                fetch(urlCatalog).then((response) => {
                    if (response.ok) {
                        this.errData = false;
                        return response.json();
                    } else {
                        this.errData = true;
                    };
                }).then((data) => {
                    this.items = data;
                    this.filteredItems= data;
                    this.dataState = true;  
                    });
            }, 0);
        },

        fetchBasket() {
            fetch(urlBasket).then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return {};
                };
            }).then((data) => {
                this.itemsInBasket = data;  
            })
        },

        fetchAddInBasket(id_good, count_good, add_count=true) {
            fetch(urlAddBasket, { 
                method: "post", 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                    id: id_good,
                    count: count_good,
                    }
                ),
            }).then((response) => {
                if (response.ok) {
                    if (!add_count) {
                        let objInBasket = this.itemsInBasket.find((item) => item.id == id_good);
                        if (objInBasket) {
                            objInBasket.count += 1;
                        } else {
                            let objInCatalog = this.items.find((item) => item.id == id_good)
                            this.itemsInBasket.push(
                                {
                                    id: id_good, 
                                    count: count_good, 
                                    data: objInCatalog, 
                                    total: count_good * objInCatalog.price 
                                }
                            )
                        }
                    }
                    return true;
                } else {
                    return false;
                };
            })
        },

        fetchDeleteFromBasket(id) {
            const urlDel =`${urlDeleteGood}${id}`;
            fetch(urlDel, { 
                method: "delete", 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    if (response.ok) {
                        this.fetchBasket();
                    } else {
                        alert('Товар не был удален');
                    }
            })
        },

        // Обработчик клика на кнопке "Искать"
        filterItems() {
            this.filteredItems = this.items.filter(({ title })=>{
                return title ? title.match(new RegExp(this.searchLine, 'gui')): false;
            });
        },

        // Обработчик input для динаминческого посиа
        filterItemsDyn(value) {
            this.searchLine = value;
            this.filterItems();
        },

        // Полный url для изображения
        imgUrl(file_name) {
            return file_name ? `img/${file_name}` : `img/default.jpg`;
        },

        // Форматирование стоимости товара при выводе
        formatPrice(price) {
            return new Intl.NumberFormat("ru-RU", {
                minimumFractionDigits: 0
            }).format(price);
        },

        // Тестовое добавление данных в корзину
        copyObj(obj) {
            // глубокая копия объекта сделана
            return JSON.parse(JSON.stringify(obj));
        },

        testBasket() {
            // Добавим количество товаров по каждой позиции
            // TODO: удалить после добавления части с добавлением товаров в корзину
            let test_1 = this.copyObj(this.items[0]);
            test_1.count = 1;
            let test_2 = this.copyObj(this.items[1]);
            test_2.count = 1;
            console.log(test_1);
            this.itemsInBasket = [test_1, test_2];
        },

    },

    mounted() {
        // Получаем данные по основным товарам в каталоге
        this.fetchItems();
        this.fetchBasket();
    },

})
