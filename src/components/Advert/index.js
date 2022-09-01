// 6. Блок с рекламой
export default Vue.component('advertisement', {
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

