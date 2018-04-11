<template>
  <div>
    <div class="vue-splitbutton">
      <vue-button
        :title="mainButtonTitle"
        class="main-button"
        type="primary"
        @click.native="onMainButtonClick"/>
      <a
        ref="dropdownButton"
        class="dropdown-button primary button"
        @click="toggleDropdown">
        {{ dropdownButtonTitle }}
        <i
          :class="splitButtonIconClass"
          class="dropdown-icon far"
          aria-hidden="true"/>
      </a>
    </div>
    <div
      v-click-outside="onClickOutside"
      v-show="isDropdownOpen"
      ref="dropdownContent"
      :style="dropdownPosition"
      class="vue-splitbutton-dropdown">
      <ul
        class="dropdown-content-list"
        @click="isDropdownOpen=false">
        <slot name="dropdown-content"/>
      </ul>
    </div>
  </div>
</template>

<script>
const DROPDWON_OFFSET = 4;
export default {
  props: {
    'mainButtonTitle': {
      type: String,
      required: true
    },
    'onMainButtonClick': {
      type: Function,
      default: () => {}
    },
    'dropdownButtonTitle': {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isDropdownOpen: false,
      dropdownPosition: {
        top: "0px",
        left: "0px"
      }
    };
  },
  computed: {
    splitButtonIconClass() {
      return {
        "fa-angle-down": !this.isDropdownOpen,
        "fa-angle-up": this.isDropdownOpen
      };
    }
  },
  methods: {
    toggleDropdown(ev) {
      this.isDropdownOpen = !this.isDropdownOpen;
      ev.isDropdownToggle = true;
      Vue.nextTick(() => {
        this.recalculateDropdownPosition();
      });
    },
    recalculateDropdownPosition(){
      const dropdownButtonElement = this.$refs.dropdownButton;
      const dropdownContentElement = this.$refs.dropdownContent;

      const buttonTop = dropdownButtonElement.offsetTop;
      const buttonLeft = dropdownButtonElement.offsetLeft;
      const buttonHeight = dropdownButtonElement.offsetHeight;
      const buttonWidth = dropdownButtonElement.offsetWidth;
      const contentWidth = dropdownContentElement.offsetWidth;

      const dropdownTop = `${buttonTop + buttonHeight + DROPDWON_OFFSET}px`;
      const dropdownLeft = `${buttonLeft + buttonWidth - contentWidth}px`;

      this.dropdownPosition = {
        top: dropdownTop,
        left: dropdownLeft
      };
    },
    onClickOutside(ev) {
      if(ev.isDropdownToggle){
        return;
      }
      if(this.isDropdownOpen){
        this.isDropdownOpen = false;
      }
    }
  }
};
</script>
