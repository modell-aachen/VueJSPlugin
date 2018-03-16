<template>
  <div
    class="split-wrapper"
    @mouseleave="mouseLeave"
    @mouseenter="mouseEnter">
    <span
      @click.prevent="callAction"
      class="splitleft button primary">
      <span>
        {{ titleLeft }}
      </span>
    </span>
    <span
      @click.stop="toggleSplitOpen"
      class="splitright button primary">
      <span
        class="split-chevron"
        data-dropdown="drop"
        @click.stop="toggleSplitOpen">
        <span>
          {{ title }}
          <i class="fa fa-chevron-down"/>
        </span>
      </span>
    </span><br>
    <div class="animation-clipper ma-button-clear-margin-bottom">
      <transition name="vue-splitbutton-slide">
        <div
          v-show="splitOpen"
          class="f-dropdown">
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
  props: ['title','titleLeft'],
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
$maxWidth: auto;

#modacWrapper .split-wrapper ul,
.foswikiTopic .split-wrapper ul,
.split-wrapper ul{
    list-style-image: none;
}
.split-wrapper {
    position: relative;
    display: inline-block;
    font-size: 0px;

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
        background: $ma-white;
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

.splitleft.button, .splitright.button {
    position: relative;
    padding: 7px 10px;
    height: 31px;
    vertical-align: unset;
}

.splitleft.button {
    border-radius: 4px 0px 0px 4px;
}

.splitright.button {
    margin-left: 1px;
    border-radius: 0px 4px 4px 0px;
    .split-chevron {
        i {
            content: "";
            padding-left: 5px;
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

