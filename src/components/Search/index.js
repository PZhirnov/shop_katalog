// 3. Динамический поиск товаров в каталоге через компонент
export default Vue.component('dynamic-search', {
    props: ['search_value'],
    template:`
        <input v-bind:value="search_value" @input="$emit('update:search_value', $event.target.value)"></input>
    `
})