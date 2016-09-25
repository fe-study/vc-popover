<template>
    <div class="vc-popover-component">
        <span v-el:trigger>
            <slot></slot>
        </span>
        <div v-el:popover 
            v-show="show"
            :class="['popover', placement]"
            :transition="effect"
        >
            <div class="arrow"></div>
            <h3 v-if="title" class="popover-title">
                <slot name="title">{{ title }}</slot>
            </h3>
            <slot name="content">
                <div class="popover-content">
                    {{{ content }}}
                </div>
            </slot>
        </div>
    </div>
</template>

<style>
.vc-popover-component {
    display: inline-block;
    position: relative;
}
.scale-transition,
.fade-transition {
    display: block;
}
.scale-enter {
    animation:scale-in 0.15s ease-in;
}
.scale-leave {
    animation:scale-out 0.15s ease-out;
}
@keyframes scale-in {
    0% {
        transform: scale(0);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
@keyframes scale-out {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(0);
        opacity: 0;
    }
}
</style>

<script>
export default {
    name: 'vc-popover',
    props: {
        /* one of click, hover, focus, contextmenu */
        trigger: {
            type: String,
            default: 'click'
        },
        closeable: {
            type: Boolean,
            default: true
        },
        effect: {
            type: String,
            default: 'fade'
        },
        title: {
            type: String
        },
        content: {
            type: String
        },
        header: {
            type: Boolean,
            default: true
        },
        placement: {
            type: String
        }
    },
    data () {
        return {
            position: {
                top: 0,
                left: 0
            },
            show: true
        }
    },
    methods: {
        toggle (e) {
            e.stopPropagation()
            this.show = !this.show
            if (e && this.trigger === 'contextmenu') e.preventDefault()
        },
        hide () {
            this.show = false
        }
    },
    ready () {
        if (this.closeable) {
            document.addEventListener(this.trigger, this.hide, false)
        }
        const popover = this.$els.popover
        if (!popover) {
            console.error('Could not find popover v-el in your component that uses popoverMixin.')
            return
        }
        let trigger = this.$els.trigger.children[0]
        switch (this.placement) {
            case 'top' :
                this.position.left = trigger.offsetLeft - popover.offsetWidth / 2 + trigger.offsetWidth / 2
                this.position.top = trigger.offsetTop - popover.offsetHeight
                break
            case 'left':
                this.position.left = trigger.offsetLeft - popover.offsetWidth
                this.position.top = trigger.offsetTop + trigger.offsetHeight / 2 - popover.offsetHeight / 2
                break
            case 'right':
                this.position.left = trigger.offsetLeft + trigger.offsetWidth
                this.position.top = trigger.offsetTop + trigger.offsetHeight / 2 - popover.offsetHeight / 2
                break
            case 'bottom':
                this.position.left = trigger.offsetLeft - popover.offsetWidth / 2 + trigger.offsetWidth / 2
                this.position.top = trigger.offsetTop + trigger.offsetHeight
                break
            default:
                console.warn('Wrong placement prop')
        }
        popover.style.top = this.position.top + 'px'
        popover.style.left = this.position.left + 'px'
        popover.style.display = 'none'
        this.show = !this.show

        let events = this.trigger === 'contextmenu' ? 'contextmenu'
        : this.trigger === 'hover' ? 'mouseleave mouseenter'
        : this.trigger === 'focus' ? 'blur focus' : 'click'

        if (this.trigger === 'focus' && !~trigger.tabIndex) {
            trigger = trigger.querySelectorAll('a,input,select,textarea,button')
            if (!trigger.length) { trigger = null }
        }
        if (trigger) {
            events.split(/\s+/g).forEach(event => {
                trigger.addEventListener(event, this.toggle, false)
            })
            this._trigger = trigger
            this._triggerEvents = events
        }
    },
    beforeDestroy () {
        this._triggerEvents.split(/\s+/g).forEach(event => {
            this._trigger && this._trigger.removeEventListener(event, this.toggle, false)
        })
        if (this.closeable) {
            document.removeEventListener(this.trigger, this.hide, false)
        }
    }
}
</script>
