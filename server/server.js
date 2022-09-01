import { writeFile, readFile, appendFile } from 'fs/promises'
import express from 'express';
import cors from 'cors';
import { fstat } from 'fs';
import { Agent } from 'http';

const GOODS_PATH = './static/goods.json';
const BASKET_PATH = './static/basket-goods.json';

const STATS = './static/stats.csv'

const app = express();
app.use(express.static('static'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


// Логгер действий - дозаписывает в файл информацию о действии
const myLogger = (req, res, descr, user_id=777) => {
    const log = new Promise(() => {
        const { method, url } = req;
        const { statusCode } = res;
        const addRow = [user_id, url, statusCode, method, descr, new Date()].join(';');
        console.log(addRow);
        appendFile(STATS, addRow + '\n', {encoding: 'utf-8', flag: 'a'}).catch(
            (err) => {
                console.log(err);
            }
        );    
    })
}


// Get data from files
const getDataFromFile = (file_path) => {
    return new Promise((resolve) => {
        readFile(file_path, 'utf-8').then( data => {
            return data ? JSON.parse(data.replace('}]{', '},{').replace(']}]', ']')): []
        }).then((data) => resolve(data));
    })}


// Получение товаров из каталога
app.get('/catalog', (req, res) => {
    getDataFromFile(GOODS_PATH).then((data) => {
        res.send(data);
        myLogger(req, res, `get catalog data`, 'user'); 
    });
});


// Получение товаров из корзины
app.get('/basket', (req, res) => {
    // Ждем завершения получения данных из таблиц и объединяем в одном объекте
    let catalogPromise = getDataFromFile(GOODS_PATH).then(data => data);
    let basketPromise = getDataFromFile(BASKET_PATH).then(data => data);
    Promise.all([catalogPromise, basketPromise]).then(
        (values) => {
            const catalogData = values[0];
            const basketData = values[1];
            // Объединяем данные
            basketData.map((objBsk) => {
                let objCat = catalogData.find(
                    (obj) => obj.id == objBsk.id
                    )
                if (objCat) {
                    objBsk.data = objCat;
                    objBsk.total = objCat.price * objBsk.count;
                }
                //console.log(objBsk);
                })
            res.send(basketData);
            myLogger(req, res, `get basket`, 'user');  
        })
})
                 
// Добавление товара в корзину
app.post('/basket/add', (req, res) => {
    const idGood = req.body.id;
    const countGood = req.body.count;
    console.log(idGood, countGood);
    if (idGood != null & countGood != null) {
        getDataFromFile(BASKET_PATH).then(data => {
            let obj = data.length ? data.find(item => item.id == idGood): null; 
            if (obj) {
                let count_old = obj.count;
                obj.count = countGood;
                myLogger(req, res, `correct count for id${obj.id} (${count_old} -> ${obj.count}) in basket`, 'user');
                
            } else {
                const addObj = {id: idGood, count: countGood}
                console.log(data);
                data.push(addObj);
                myLogger(req, res, `add good id${addObj.id} in basket`, 'user');  
            }
            // save file basket
            writeFile(BASKET_PATH, JSON.stringify(data), 
            { encoding: "utf8", flag: "w" }).then(() => res.sendStatus(200)); 
           
        })    
    } else {
        console.log('ошибка в запросе');
        myLogger(req, res, `err for add in basket`, 'user');  
    }
});

app.delete('/basket/delete/:id', (req, res) => {
    const id = Number(req.params.id);
    console.log(id, 'test')
    if (id) {
        getDataFromFile(BASKET_PATH).then(data => {
                let newData = data.filter(item => item.id != id); 
                if (data.length != newData.length) {
                    writeFile(BASKET_PATH, JSON.stringify(newData), 
                    { encoding: "utf8", flag: "w" }).then(
                        () => {
                            res.sendStatus(204);
                            myLogger(req, res, `delete good id${id} from basket`, 'user');   
                        });
                } else {
                    res.sendStatus(500);
                }   
            })
    } else {
        res.sendStatus(500);
    }
})
