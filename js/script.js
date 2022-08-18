"use strict";

// Структура goods сделана в Mocky - https://run.mocky.io/v3/afd8d1e8-5507-4c20-a26e-7cc09030f768
const BASE = 'https://run.mocky.io/v3';
const GOODS = '/afd8d1e8-5507-4c20-a26e-7cc09030f768';


// ---- Service переделан на fetch

// Пример короткой записи
// const service = (url) => fetch(url).then((response) => response.json());


const service = (url) => fetch(url).then((response) => {
    // Добавил проверку на успешность запроса (с cors не работает)
    if (!response.ok) {
        throw new Error('Ошибка получения данных');
    }
    debugger
    return response.json();
}).catch((err) => {
    console.log(err);
});


// Класс, реализующий ренедринг товара карточки товара
class GoodsItem {
    constructor({ id, category = 'не определена', title = 'не добавлен', price = 0, currency, img = 'default.jpg' }) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.price = price;
        this.currency = currency;
        this.img = img;
    }

    render() {
        return `
        <div class="item">
            <div class="img_block">
                <img src="img/${this.img}" alt="${this.title}">   
            </div>
            <span class="category_name">${this.category}</span>
            <a href="#" class="title_for_item" id=${this.id}>${this.title}</a>
            <span class="price_item">${new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 0 }).format(this.price)} ${this.currency}</span>
            <button class="btn btn_item" id=${this.id}>В корзину</button>
        </div>`;
    }
}


// Класс, реализующий вывод списка товаров
class GoodsList {
    constructor() {
        this.goods = [];
        this.filteredGoods = [];

    }

    // --- Решение по условию ДЗ №3 - 
    fetchGoods() {
        return new Promise((resolve) => {
            service(`${BASE}${GOODS}`).then((data) => {
                this.goods = data;
                this.filteredGoods = data;
                resolve();
            }, (error) => {
                alert(error);
            })
        });
    }


    filterGoods(value) {
        // Фильтруем список товаров по данным из поля
        const regexp = new RegExp(value, 'i');
        this.filteredGoods = this.goods.filter(good => regexp.test(good.title));
        this.render();
    }


    // метод определяет общую стоимость товаров в каталоге
    calculateСostGoods() {
        let res_calculate = 0
        // Вариант решения с деструктуризацией
        return this.goods.reduce((prev, { price }) => {
            let price_valid = price ? parseFloat(price) : 0;
            return prev + price_valid;
        }, 0)
    }

    render() {
        const items = this.filteredGoods.map(good => {
            const goodItem = new GoodsItem(good);
            return goodItem.render();
        }).join('')
        document.querySelector('.goods-list').innerHTML = items;
    }
}


// Выводим данные на страницу
const goodsList = new GoodsList();

goodsList.fetchGoods().then(() => {
    goodsList.render();
})


// Вывод суммы по всем товарам каталога
// alert(`Общая стоимость всех товаров в каталоге составляет: ${list.calculateСostGoods()}`);

// --- ДЗ №4
const searchButton = document.querySelector('.search-button');
const searchField = document.querySelector('.goods-search');
searchButton.addEventListener('click', () => {
    if (searchField.value != null) {
        goodsList.filterGoods(searchField.value);
    }
});
