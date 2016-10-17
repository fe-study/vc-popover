import Vue from 'vue'
import vcPopover from '../src'

new Vue({
	el: '#app',
	data () {
		return {
            bools: {
                'true': true,
                'false': false
            },
            show: true,
            closeable: false 
		}
	},
    methods: {
    },
	components: {
        vcPopover
	}
})
