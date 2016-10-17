<template>
    <div class="vc-popover-component">
        <div v-el:trigger class="vc-popover-trigger-slot">
            <slot></slot>
        </div>
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
/* 默认只提供vc-scale */
.vc-popover-component {
    display: inline-block;
    position: relative;
}
.vc-popover-trigger-slot {
    display: inline-block;
}
.vc-popover-trigger-slot {
    display: inline-block;
}
.vc-scale-transition,
.vc-fade-transition {
    display: block;
}
.vc-fade-enter {
    animation: fade-in 0.15s ease-in;
}
.vc-fade-leave {
    animation: fade-out 0.15s ease-out;
}
@-webkit-keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
@-webkit-keyframes fade-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.vc-scale-enter {
    animation: scale-in 0.15s ease-in;
}
.vc-scale-leave {
    animation: scale-out 0.15s ease-out;
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
        show: {
            type: Boolean,
            default: false 
        },
        /**
         * 函数式显示，此属性配合show来使用，只响应 `show` prop和控制，不受事件控制
         */
        functionalShow: {
            type: Boolean,
            default: false
        },
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
            default: 'vc-fade'
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
            }
            // show: true
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
    created () {
        // 虽然`show` 是一个prop，由用户完全控制传参，但不管如何，show必须为true来计算初始位置 
        // Popover组件默认先让元素为true来计算位置，然后直接隐藏
        this._initShow = this.show 
        this.show = true 
    },
    ready () {
        if (!this.functionalShow && this.closeable) {
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

        if (!this._initShow) {
            popover.style.display = 'none'
            this.show = !this.show
        }

        this.show = this._initShow

        let events = this.trigger === 'contextmenu' ? 'contextmenu'
        : this.trigger === 'hover' ? 'mouseleave mouseenter'
        : this.trigger === 'focus' ? 'blur focus' : 'click'

        if (this.trigger === 'focus' && !~trigger.tabIndex) {
            trigger = trigger.querySelectorAll('a,input,select,textarea,button')
            if (!trigger.length) { trigger = null }
        }
        if (!this.functionalShow && trigger) {
            events.split(/\s+/g).forEach(event => {
                trigger.addEventListener(event, this.toggle, false)
            })
            this._trigger = trigger
            this._triggerEvents = events
        }
    },
    beforeDestroy () {
        if (!this.functionalShow && this._trigger) {
            this._triggerEvents.split(/\s+/g).forEach(event => {
                this._trigger.removeEventListener(event, this.toggle, false)
            })
        }
        if (!this.functionalShow && this.closeable) {
            document.removeEventListener(this.trigger, this.hide, false)
        }
    }
}
</script>
