export default Vue.component('err-get-data', {
        props: ['err_data'],
        template: `
            <div class="response_error" v-if="err_data">
                <h1>Данные не были получены!</h1>
            </div>
        `,
    });
