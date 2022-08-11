"use strict";


// Данные по товарам
const goods = [
    {
        id: 1,
        category: 'Видеокарты',
        title: 'MSI AMD Radeon RX 550 AERO ITX OC [RX 550 AERO ITX 4G OC]',
        price: 8500,
        currency: 'руб.',
        img: 'radeonrx550.webp',
    },
    {
        id: 2,
        category: 'Видеокарты',
        title: 'KFA2 GeForce GTX 1050 Ti 1-Click OC [50IQH8DSQ31K]',
        price: 14000,
        currency: 'руб.',
        img: 'KFA2_1050.webp',
    },
    {
        id: 3,
        category: 'Видеокарты',
        title: 'PowerColor AMD Radeon RX 6500 XT ITX [AXRX 6500XT 4GBD6-DH]',
        price: 16000,
        currency: 'руб.',
        img: 'RADEONRX6500XT.webp',
    },
    {
        id: 4,
        category: 'Видеокарты',
        title: 'MSI GeForce GTX 1660 SUPER Gaming [GTX 1660 SUPER GAMING]',
        price: 37800,
        currency: 'руб.',
        img: 'MSI_GeForce1660.webp',
    },
    {
        id: 5,
        category: 'Твердотельные накопители',
        title: '240 ГБ 2.5" SATA накопитель HP S650 [345M8AA#ABB]',
        price: 2799,
        currency: 'руб.',
        img: 'hps650.webp',
    },
    {
        id: 6,
        category: 'Твердотельные накопители',
        title: '500 ГБ 2.5" SATA накопитель Samsung 870 EVO [MZ-77E500B/EU]',
        price: 10000,
        currency: 'руб.',
        img: 'samsung_evo870.webp',
    },
    {
        id: 7,
        category: 'SSD M.2 накопители',
        title: '2000 ГБ SSD M.2 накопитель WD Black SN850 [WDS200T1X0E]',
        price: 40000,
        currency: 'руб.',
        img: 'wd850sn.webp',
    },
    // Тестовые карточки товаров
    {
        id: 8,
        category: 'Тестовая',
        title: 'Позиция без изображения',
        currency: 'руб.',
    },
    {
        id: 9,
        category: 'Тестовая',
        currency: 'руб.',
    },
]

// console.log(JSON.stringify(goods));

// Структура goods сделана в Mocky - https://run.mocky.io/v3/afd8d1e8-5507-4c20-a26e-7cc09030f768
const BASE = 'https://run.mocky.io/v3';
const GOODS = '/afd8d1e8-5507-4c20-a26e-7cc09030f768';

// Функция загружает JSON по url
function service(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    const loadHandler = () => {
        callback(JSON.parse(xhr.response));
    }
    xhr.onload = loadHandler;
    xhr.send();
}

service(`${BASE}${GOODS}`, (data) => {
    console.log(data);
})



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
    }

    fetchGoods(callback) {
        // this.goods = goods;
        service(`${BASE}${GOODS}`, (data) => {
            this.goods = data;
            // после получения данных отрендерим им через переданный render в callback
            callback();
        });

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
        const items = this.goods.map(good => {
            const goodItem = new GoodsItem(good);
            return goodItem.render();
        }).join('')
        document.querySelector('.goods-list').innerHTML = items;
    }
}


// Выводим данные на страницу
const list = new GoodsList();
list.fetchGoods(() => {
    list.render();
});


// Вывод результата решения по второй задаче
// alert(`Общая стоимость всех товаров в каталоге составляет: ${list.calculateСostGoods()}`);
