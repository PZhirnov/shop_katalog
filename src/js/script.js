"use strict";

// Структура goods сделана в Mocky - https://run.mocky.io/v3/afd8d1e8-5507-4c20-a26e-7cc09030f768
const BASE = 'https://run.mocky.io/v3';
const GOODS = '/afd8d1e8-5507-4c20-a26e-7cc09030f768';
const url = `${BASE}${GOODS}`

const app = new Vue({
    el: "#app",

    data: {
        items: [],
        dataState: false,
        errData: false,
        isVisibleCart: true,
        searchLine: '',
        itemsInBasket: [],
    },

    computed: {
        // общая стоимость товаров в каталоге
        totalPriceItems() {
            return this.items.reduce((prev, { price }) => {
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

        // Обработчик клика на кнопке "Искать"
        filterGoods() {
            alert('Добавить поиск');
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
            // добавим количество товаров по каждой позиции
            this.itemsInBasket = [this.copyObj(this.items[0]), this.copyObj(this.items[1])];
        },

        // Расчет стоимости единицы
        totalForItem(item) {
            item.total = item.price * item.count;
            return item.total
        },

    },


    mounted() {
        // Получаем данные по основным товарам в каталоге
        // Сделаем задержку для вывода сообщения
        setTimeout(() => {
            fetch(url).then((response) => {
                if (response.ok) {
                    this.errData = false
                    return response.json()
                } else {
                    this.errData = true
                };
            }).then((data) => {
                this.items = data;
                this.dataState = true;
                // --- добавим тестовые данные для корзины
                this.testBasket();
            });
        }, 2000);
    },

})

