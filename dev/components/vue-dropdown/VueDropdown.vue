<template>
    <div
        v-visible="isVisible"
        :style="style"
        class="dropdown">
        <ul class="dropdown-content-list">
            <slot />
        </ul>
    </div>
</template>

<script>
const DROPDOWN_OFFSET = 4;
export default {
    props: {
        element: {
            type: HTMLLIElement,
            default: null,
        },
    },
    data() {
        return {
            isVisible: false,
            style: {},
        };
    },
    methods: {
        toggle() {
            if(this.isVisible){
                this.hide();
            } else {
                this.show();
            }
        },
        show() {
            this.isVisible = true;
            this.recalculatePosition();
        },
        hide() {
            this.isVisible = false;
        },
        onClickOutside() {
            this.hide();
        },
        recalculatePosition() {
            const dropdownButtonElement = this.element;
            const dropdownContentElement = this.$el;

            const buttonTop = dropdownButtonElement.offsetTop;
            const buttonLeft = dropdownButtonElement.offsetLeft;
            const buttonHeight = dropdownButtonElement.offsetHeight;
            const buttonWidth = dropdownButtonElement.offsetWidth;
            const contentWidth = dropdownContentElement.offsetWidth;

            const dropdownTop = `${buttonTop + buttonHeight + DROPDOWN_OFFSET}px`;
            const dropdownLeft = `${buttonLeft + buttonWidth - contentWidth}px`;

            this.style = {
                top: dropdownTop,
                left: dropdownLeft
            };
        }
    },
};
</script>

<style lang="scss" scoped>
@import "../../sass/settings";
@import "../../sass/qwiki/mixins";

.dropdown {
    position: fixed;
    background: white;
    border: 1px solid #E2E2E2;
    border-radius: 6px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
    z-index: 1;
    .dropdown-content-list {
    list-style: none;
    list-style-image: none !important;
    margin: 0;
    padding: 0;
}

li {
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    &:hover {
    background-color: lightgrey;
    }
    a {
    margin: 8px 16px;
    display: inline-block;
    &:hover {
        @include disable-anchor-hover();
    }
    }
}
}
</style>
