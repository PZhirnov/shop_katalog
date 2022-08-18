//ToDo - вам необходимо скопировать данный скрипт в свой проект, и сдавать ДЗ в рамках собственного репозитория


// 1) Какие виды областей видимости вы знаете? Написать ответ ниже
// 1. Глобальная
// 2. Локальная
// 3. Внутри блока
// 4. Catch блока (ошибки)
// 5. Блок eval - создает собственную область видимости 

// 2) Исправьте код так чтобы в консоль выводились числа от 0 до 10
/*Исходный код:
for (var i = 0; i <= 10; i++) {
   setTimeout(() => {
      console.log(i);
   }, 0)
}
*/


for (var i = 0; i <= 10; i++) {
   // Решение: надо убрать стрелочную функцию
   setTimeout(console.log(i), 0);
}
debugger


// // 3) Исправьте код так чтобы в консоль выводилось "John"
/*Исходный код:
var firstName = "Elena"
const obj = {
   firstName: 'John',
   sayFirstName: () => {
      console.log(this.firstName)
   }
}
obj.sayFirstName();
*/

// Решение:
var firstName = "Elena"
const obj = {
   firstName: 'John',
   // Решение: убрать стрелочную функцию
   sayFirstName() {
      console.log(this.firstName)
   }
}
obj.sayFirstName(); // John


// 4) Исправьте код так чтобы в консоль не выводилась ошибка (нельзя исправлять тело функции getArrowFunction)
/*  
Исходный код:
const user = {
   age: 20
}
function getArrowFunction() {
   "use strict"
   return () => {
      console.log(this.age)
   }
}

const arrowFunction = getArrowFunction(user);
arrowFunction();

*/

// Решение:

const user = {
   age: 20
}
function getArrowFunction() {
   "use strict"
   return () => {
      console.log(this.age)
   }
}

const arrowFunction = getArrowFunction.call(user);
arrowFunction();

