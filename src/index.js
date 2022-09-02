"use strict";

import './sass/style.scss';
import Search from './components/Search';
import Buttons from './components/Buttons';
import Advert from './components/Advert';
import Error from './components/Errors';
import { basket, itemsBasket } from './components/Basket';
import Blog from './components/Blog';
import { Menu, Spinner, fullImgUrl, getFormatPrice } from './components/Additions';
import { productsList, productCard } from './components/GoodsItem';
import { urlCatalog, urlBasket, urlDeleteGood, urlAddBasket } from './constants';

function init() {

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

            // Пересчитаем общую стоимость каждого товара в корзине и общий итог по всем
            totalInBasket() {
                this.itemsInBasket.forEach(item => {
                    item.total = item.data.price * item.count;
                });
                return this.itemsInBasket.reduce((prev, item) => {
                    return prev + item.total;
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
                        this.filteredItems = data;
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

            fetchAddInBasket(id_good, count_good, add_count = true) {
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
                const urlDel = `${urlDeleteGood}${id}`;
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

            // Обновление количества товаров в корзине
            updateCountGoodsInBasket({ id, count }) {
                this.fetchAddInBasket(id, count, true);
            },

            // Обработчик клика на кнопке "Искать"
            filterItems() {
                this.filteredItems = this.items.filter(({ title }) => {
                    return title ? title.match(new RegExp(this.searchLine, 'gui')) : false;
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

            // Обработка события добавления товара в корзину из каталога
            addGood(id) {
                const addId = id;
                const objInBasket = this.itemsInBasket.find((item) => item.id == addId);
                let count = 1;
                if (objInBasket) {
                    count = Number(objInBasket.count) + 1;
                }
                this.fetchAddInBasket(id, count, false);
            },

        },

        mounted() {
            // Получаем данные по основным товарам в каталоге
            this.fetchItems();
            this.fetchBasket();
        },

    })
}

window.onload = init

