// Блог магазина
export default Vue.component('our-blog', {
    data () {
        return {
            articles: ['Статья 1', 'Статья 2'], 
        }
    },

    template: `
        <div class="blog">
            <h2>Блог магазина:</h2>
            <h3 v-for='item in articles'>{{ item }}</h3>
            <a href="#" class="">Читать далее</a>
        </div>
    `
})