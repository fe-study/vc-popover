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
		}
	},
    methods: {
        handleClick (...args) {
            alert('click ' + args[0])
            console.log(args)
        },
    },
	components: {
        vcPopover
	}
})
