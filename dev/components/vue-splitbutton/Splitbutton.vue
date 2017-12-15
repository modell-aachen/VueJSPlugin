<template>
    <div class="split-wrapper" @mouseleave="mouseLeave" @mouseenter="mouseEnter">
        <span @click.prevent="callAction" class="button primary split">
            <span class="split-title">
                {{title}}
            </span>
            <span class="split-chevron" data-dropdown="drop" @click.stop="toggleSplitOpen">
                <i class="fa fa-chevron-down" v-if="splitOpen"></i>
                <i class="fa fa-chevron-right" v-else></i>
            </span>
        </span><br>
        <div class="animation-clipper ma-button-clear-margin-bottom">
            <transition name="vue-splitbutton-slide">
            <div v-show="splitOpen" class="f-dropdown">
                <ul>
                    <slot>
                        <li>This is a link</li>
                        <li>This is another</li>
                        <li>Yet another</li>
                    </slot>
                </ul>
            </div>
            </transition>
        </div>
    </div>
</template>

<script>
const dropdownGraceTime = 2000;

export default {
  props: ['title'],
  data() {
    return {
      splitOpen: false,
      mouseLeft: false, // stores when the mouse last left the button; false when it didn't
    };
  },
  methods: {
    toggleSplitOpen() {
      this.splitOpen = !this.splitOpen;
    },
    callAction () {
      this.$emit('action');
    },
    mouseEnter() {
      this.mouseLeft = false;
    },
    mouseLeave() {
      this.mouseLeft = new Date();
      setTimeout(
        () => {
          if(!(this.splitOpen && this.mouseLeft)) {
            return;
          }
          let now = new Date();
          if(now - this.mouseLeft >= dropdownGraceTime) {
            this.splitOpen = !this.splitOpen;
          }
        },
        dropdownGraceTime
      );
    },
  }
};
</script>

<style lang="scss">
@import '../../sass/settings.scss';
$shadowWidth: 10px;
$maxWidth: 200px;

#modacWrapper .split-wrapper ul,
.foswikiTopic .split-wrapper ul,
.split-wrapper ul{
    list-style-image: none;
}
.split-wrapper {
    position: relative;
    display: inline-block;

    .animation-clipper {
        overflow: hidden;
        margin-left: -$shadowWidth;
        position: absolute;
        right: -$shadowWidth;
    }
}
.f-dropdown {
    position: relative;
    ul {
        width: $maxWidth;
        text-align: left;
        box-shadow: 1px 1px $shadowWidth 1px rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        background: $white;
        border: #ccc;
        z-index:100;
        height: auto;
        list-style: none;
        padding: 0;
        width: auto;
        margin: 1px $shadowWidth $shadowWidth $shadowWidth;
        max-width: $maxWidth;
        li {
            padding: 10px 14px;
            font-size: 12px;
            font-weight: 600;
            color: #282C2E;
            cursor: pointer;
            &:hover {
                background-color: $light-gray;
            }
        }
    }
}
.split.button{
    position: relative;
    .split-title {
        padding-right: 32px;
    }
    .split-chevron {
        border-left-color: rgba(255,255,255,0.5);
        border-left: solid 1px;
        display: block;
        height: 100%;
        position: absolute;
        width: 2rem;
        right: 0;
        top: 0;
        i {
            position: absolute;
            content: "";
            width: 0;
            height: 0;
            top: 37%;
            left: 27%;
        }
    }
}

.vue-splitbutton-slide-enter-active,
.vue-splitbutton-slide-leave-active {
    transition: all .3s;
}
.vue-splitbutton-slide-enter,
.vue-splitbutton-slide-leave-to {
    transform: translate(0, -100%);
}
</style>

