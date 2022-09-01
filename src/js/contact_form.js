
// Для проверки отправки формы
const testMocky = 'https://run.mocky.io/v3/2b5bb42c-971b-41e7-8546-962274597e78' // 


// Отпавка данных формы после нажатия Submit
formContact.onsubmit = (form) => {
    // Очистка формы будет выполнена в случае успещной отправки данных
    form.preventDefault();
    // Проверим статус валидации
    if (!statusValid.getStatus()) {
        alert('Перед отправкой необходимо ввести данные формы!');
        return
    }
    const formData = new FormData(formContact);
    fetch(testMocky, {
        method: "POST",
        body: formData,
    }).then((response) => {
        console.log(response.status);
        if (!response.ok) {
            alert('Ошибка отправки данных');
            form.preventDefault();
        } else {
            alert('Данные отправлены');
            formContact.reset();
        }
    })
}


// Отслеживаем статус валидации по всем полям
const statusValid = {
    name: false,
    email: false,
    number: false,

    getStatus() {
        return [this.name, this.email, this.number].indexOf(false) == -1;
    }
}

// -- Функции для валидации данных формы ---- 

// Проверка правильности ввода имени пользователя
const validateName = (fieldName, value) => {
    return new Promise((resolve) => {
        let regexpName = new RegExp('[P-Za-za-яА-Я]+');
        let res = regexpName.exec(value, 'g');
        if (res || !value) {
            resolve(res[0] == value);
        } else {
            resolve(false ? !value : true);
        }
    }
    )
}

// Проверка правильности ввода почтового адреса
const validateEmail = (fieldName, value) => {
    return new Promise((resolve) => {
        let regexp = new RegExp(/^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i);
        if (regexp.test(value) || !value) {
            resolve(true);
        } else {
            console.log('ошибка');
            resolve(false);
        }
    }
    )
}

// Проверка правильности ввода номера
const validateNumber = (fieldName, value) => {
    return new Promise((resolve) => {
        const testNumber = value;
        let regexp = new RegExp(/\+7\(\d{3}\)\d{3}-\d{2}\d{2}/gm);
        console.log(`работает ${testNumber}`)
        console.log(testNumber.match(regexp));
        if (testNumber.match(regexp) != null) {
            resolve(true);
        } else {
            resolve(false);
        }
    }
    )
}


// Форматировани и вывод сообщения пользователю в разметку под нужное поле
const setStyle = (prom, event) => {
    prom.then((result) => {
        // Найдем поле для вывода ошибки 
        let nameField = event.target.name;
        let spanErr = document.querySelector(`.err_${nameField}`)
        // Обновим статус валиадции по всем данных 
        statusValid[nameField] = result;
        if (result) {
            event.target.style.border = "1px solid black";
            event.target.style.color = "black";
            spanErr.style.display = "none";
        } else {
            event.target.style.border = "2px solid red";
            event.target.style.color = "red";
            spanErr.style.display = "inline";
        }
        console.log(this.name);
    })
}


// Получаем нужные поля формы и назначаем события - в данном случае взял input
let fieldsInForm = document.querySelectorAll('.field_in_form');
fieldsInForm.forEach((field) => {
    let nameField = field.name;
    field.addEventListener('input', (event) => {
        let prom = null;
        if (nameField == 'name') {
            prom = validateName(nameField, event.target.value);
        } else if (nameField == 'email') {
            prom = validateEmail(nameField, event.target.value);
        } else if (nameField == 'number') {
            prom = validateNumber(nameField, event.target.value);
        }
        if (prom) {
            setStyle(prom, event);
        }
    })
})
