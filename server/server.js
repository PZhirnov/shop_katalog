import { writeFile, readFile } from 'fs/promises'
import express from 'express';
import cors from 'cors';
import { fstat } from 'fs';

const GOODS_PATH = './static/goods.json';
const BASKET_PATH = './static/basket-goods.json';

const app = express();
app.use(express.static('static'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Get data from files
const getDataFromFile = (file_path) => {
    return new Promise((resolve) =>
        readFile(file_path, 'utf-8').then(
            data => resolve(
                    data ? JSON.parse(data): []
                )
            )
        )
    }


// Get goods from catalog
app.get('/catalog', (req, res) => {
    getDataFromFile(GOODS_PATH).then((data) => {
        console.log(data);
        res.send(data)
    });
});

// Get goods in basket
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
                console.log(objBsk);
                })
            res.send(basketData);
        })
})
          
           
// Add good in basket
app.post('/basket/add', (req, res) => {
    const idGood = req.body.id;
    const countGood = req.body.count;
    console.log(idGood, countGood);
    if (idGood != null & countGood != null) {
        getDataFromFile(BASKET_PATH).then(data => {
            let obj = data.find(item => item.id == idGood);
            if (obj) {
                obj.count = countGood;
            } else {
                const addObj = {id: idGood, count: countGood}
                data.push(addObj);
            }
            // save file basket
            writeFile(BASKET_PATH, JSON.stringify(data), { encoding: "utf8", flag: "w" }).then(() => res.sendStatus(200))
        })    
    } else {
        console.log('ошибка в запросе');
    }
});

app.delete('/basket/delete/:id', (req, res) => {
    const id = Number(req.params.id);
    console.log(id, 'test')
    if (id) {
        getDataFromFile(BASKET_PATH).then(data => {
                let newData = data.filter(item => item.id != id); 
                if (data.length != newData.length) {
                    writeFile(BASKET_PATH, JSON.stringify(newData), { encoding: "utf8", flag: "w" }).then(
                        () => res.sendStatus(204));
                } else {
                    res.sendStatus(500);
                }   
            })
    } else {
        res.sendStatus(500);
    }
})
