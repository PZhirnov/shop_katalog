// 5. Отображение загрузки
export const Spinner =  Vue.component('spinner', {
    template: `
        <div class="spinner_block">
            <div class="spinner">
                <span class="spinner__animation"></span>
                <span class="spinner__info">Загрузка...</span>
            </div>
        </div>
        `,
})

// 6. Меню
export const Menu = Vue.component('links-in-menu', {
    props: ['links_menu', 'cur_page'],
    data() {
        return {
            linksMenu: [
                {
                    href: '#',
                    title: 'Главная'
                },
                {
                    href: 'index.html',
                    title: 'Каталог'
                },
                {
                    href: '#',
                    title: 'Доставка'
                },
                {
                    href: 'contacts.html',
                    title: 'Контакты'
                },
            ],
        }
    },
    
    methods: {
        getCurrentPage() {
           return document.URL.split('/').reverse()[0];
        },
    },

    template: `
        <div>
            <a v-for="link in linksMenu" v-bind:href="link.href" 
                v-bind:class="link.href == getCurrentPage() ? 'current': ''" >{{ link.title }}
            </a>
        </div>
    `
})

