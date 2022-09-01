// 4. Кнопки
// Кнопка использует класс btn по умолчанию. В add_class добавляюжтся дополнительные классы.
export default Vue.component('btn-component', {
    props: ['add_class', ],
    template: `
        <button v-bind:class="'btn ' + add_class" @click="$emit('click_handler')">
            <slot></slot>
        </button>
    `
})