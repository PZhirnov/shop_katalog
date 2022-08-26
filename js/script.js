"use strict";

// Структура goods сделана в Mocky - https://run.mocky.io/v3/afd8d1e8-5507-4c20-a26e-7cc09030f768
const BASE = 'https://run.mocky.io/v3';
const GOODS = '/afd8d1e8-5507-4c20-a26e-7cc09030f768';
const url = `${BASE}${GOODS}`

// ------ Компоненты

// 1. КАРТОЧКИ ТОВАРОВ В КАТАЛОГЕ (УЧИТЫВАТ ФИЛЬТР)

// Использует вложенный компонент product-card
Vue.component('products-list', {
    props: ['filtered_items', 'data_state'], 
    
    template: `
        <div class="goods-list" v-if="data_state">
                <product-card v-for="item in filtered_items" v-bind:item = "item"></product-card>
        </div>
    `,
});

Vue.component('product-card', {
    props: ['item'],
    methods: {
        imgUrl(file_name) {
            return app.imgUrl(file_name);
        }, 

        formatPrice(price) {
            return app.formatPrice(price);
        },

        addToBasket(event) {
            // Добавляем выбранный товар в корзину
            console.log(event.target.id);
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
            <button class="btn btn_item" v-bind:id="item.id" @click="addToBasket">В корзину</button>
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
            item.total = item.price * item.count;
            return item.total
        },
        
        // TODO: добавить логику удаления товара
        deleteItem(event) {
            console.log(`Будет удален товар с id ${event.target.id}`);
        },
    },
    template: `
        <div class="item_row">
            <div class="td_image">
                <img v-bind:src="imgUrl(item.img)" alt="item.title">
            </div>
            <div class="td_description justify">
                <p>{{ item.title }}</p>
            </div>
            <div class="td_price justify">
                <p>{{ formatPrice(item.price) }} {{ item.currency }}</p>
            </div>
            <div class="td_count justify">
                <input type="number" name="" id="" min=0  v-model="item.count" value = "1">
            </div>
            <div class="td_total justify">
                <span>{{ formatPrice(totalForItem(item)) }} {{ item.currency }}</span>
            </div>
            <div class="td_delete justify">
                <button class="btn" @click="deleteItem" v-bind:id="item.id">удалить</button>
            </div>
        </div>
    `
});

// 3. Динамический поиск товаров в каталоге через компонент
Vue.component('dynamic-search', {
    props: ['search_value'],
    template:`
        <input v-bind:value="search_value" @input="$emit('update:search_value', $event.target.value)"></input>
    `
})


// 3. Сообщения об ошибках
Vue.component('err-get-data', {
    props: ['err_data'],
    template: `
        <div class="response_error" v-if="err_data">
            <h1>Данные не были получены!</h1>
        </div>
    `,
});


// 4. Кнопки
// Кнопка использует класс btn по умолчанию. В add_class добавляюжтся дополнительные классы.
Vue.component('btn-component', {
    props: ['add_class', ],
    template: `
        <button v-bind:class="'btn ' + add_class" @click="$emit('click_handler')">
            <slot></slot>
        </button>
    `
})

// 5. Отображение загрузки
Vue.component('spinner', {
    template: `
        <div class="spinner_block">
            <div class="spinner">
                <span class="spinner__animation"></span>
                <span class="spinner__info">Загрузка...</span>
            </div>
        </div>
        `,
})


// 6. Блок с рекламой
Vue.component('advertisement', {
    template: `
        <div class="side">
            <h2>Действующие акции:</h2>
            <h4>Купи 3 товара и получи подарок!</h4>
            <div class="action">
                <img src="img/akczii-i-podarki.jpg" alt="">
            </div>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur ratione quidem officiis,
                placeat
                ipsam quia.</p>
            <h3>Lorem, ipsum.</h3>
            <p>Lorem ipsum dolor sit ame.</p>
            <!-- Тут временный привер вывода блоков с рекламой на сайт -->
            <div class="fakeimg" v-for="adv in ['Хорошая новость', 'Выгодный комплект']">{{ adv }}</div><br>
        </div>
    `
})

// 7. Блог магазина
Vue.component('our-blog', {
    data () {
        return {
            articles: ['Статья 1', 'Статья 2'], 
        }
    },

    template: `
        <div class="blog">
            <h2>Блог магазина:</h2>
            <h3 v-for='item in articles'>{{ item }}</h3>
            <a href="#" class="">Читать далее</a>
        </div>
    `
})

// 8. Основные пункты меню
Vue.component('links-in-menu', {
    props: ['links_menu', 'cur_page'],
    data() {
        return {
            linksMenu: [
                {
                    href: '#',
                    title: 'Главная'
                },
                {
                    href: 'index.html',
                    title: 'Каталог'
                },
                {
                    href: '#',
                    title: 'Доставка'
                },
                {
                    href: 'contacts.html',
                    title: 'Контакты'
                },
            ],
        }
    },
    
    methods: {
        getCurrentPage() {
           return document.URL.split('/').reverse()[0];
        },
    },

    template: `
        <div>
            <a v-for="link in linksMenu" v-bind:href="link.href" 
                v-bind:class="link.href == getCurrentPage() ? 'current': ''" >{{ link.title }}
            </a>
        </div>
    `
})


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
        // общая стоимость товаров в каталоге
        totalPriceItems() {
            return this.filteredItems.reduce((prev, { price }) => {
                let price_valid = price ? parseFloat(price) : 0;
                return prev + price_valid;
            }, 0)
        },

        // Стоимость товара в корзине с учетом количества
        totalInBasket() {
            return this.itemsInBasket.reduce((prev, item) => {
                return prev + item.price * item.count;
            }, 0)
        },
    },

    methods: {

        // Загрузка данных с сервера
        fetchItems() {
            setTimeout(() => {
                fetch(url).then((response) => {
                    if (response.ok) {
                        this.errData = false;
                        return response.json();
                    } else {
                        this.errData = true;
                    };
                }).then((data) => {
                    this.items = data;
                    this.filteredItems= data;
                    // --- добавим тестовые данные для корзины
                    this.testBasket(); // TODO: удалить потом 
                    this.dataState = true;
                    
                });
            }, 1000);
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
    },

})
