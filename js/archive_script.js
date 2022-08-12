"use strict";



// ----------------------------------------------------------
//   ЭТО АРХИВНЫЙ ВАРИНТ СКРИПТА С КОММЕНТАРИЯМИ И РЕШЕНИЯМИ 
// ----------------------------------------------------------






// Структура goods сделана в Mocky - https://run.mocky.io/v3/afd8d1e8-5507-4c20-a26e-7cc09030f768
const BASE = 'https://run.mocky.io/v3';
const GOODS = '/afd8d1e8-5507-4c20-a26e-7cc09030f768';

// ---- ПЗ с урока. Функция загружает JSON по url c callback функцией
// function service(url, callback) {
//     const xhr = new XMLHttpRequest();
//     xhr.open('GET', url);
//     const loadHandler = () => {
//         callback(JSON.parse(xhr.response));
//     }
//     xhr.onload = loadHandler;
//     xhr.send();
// }

// service(`${BASE}${GOODS}`, (data) => {
//     console.log(data);
// })


// ---- РЕШЕНИЕ ДЗ №1. Переделать service так, чтобы функция использовала промисы

function service(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        const loadHandler = () => {
            console.log(xhr.status);
            // расскомментировать для проверки ассинхронности
            // setTimeout(() => resolve(JSON.parse(xhr.response)), 5000);
            resolve(JSON.parse(xhr.response));
        }
        xhr.onload = loadHandler;
        // добавил обработчик ошибки
        xhr.onerror = function () {
            reject(new Error('Ошибка получения данных! Обновите страницу.'));
        };
        xhr.send();
    })
}


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

    // --- Решение по условию ДЗ №3 - 
    fetchGoods() {
        return new Promise((resolve) => {
            const p = service(`${BASE}${GOODS}`);
            p.then((data) => {
                this.goods = data;
                resolve();
            }, (error) => { alert(error); })
        });
    }

    // --- Решение по условию ДЗ № 1 ------
    // fetchGoods(callback) {
    //     // --- Пример ПЗ с урока. service с callback
    //     // service(`${BASE}${GOODS}`, (data) => {
    //     //     this.goods = data;
    //     //     // после получения данных отрендерим им через переданный render в callback
    //     //     callback();
    //     // });

    //     // --- К решению ДЗ №1 ---- 
    //     let p = service(`${BASE}${GOODS}`)
    //     p.then((data) => {
    //         this.goods = data;
    //         callback();
    //     }, (error) => {
    //         alert(error); // сообщение об ошибке, если нужно
    //     })
    // }



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
const goodsList = new GoodsList();

// --- К решению ДЗ №1
// goodsList.fetchGoods(() => {
//     goodsList.render();
// });


// --- К решению ДЗ №3
goodsList.fetchGoods().then(() => {
    goodsList.render();
})


//console.log('текст для проверки ассинхронности')

// Вывод суммы по всем товарам каталога
// alert(`Общая стоимость всех товаров в каталоге составляет: ${list.calculateСostGoods()}`);
