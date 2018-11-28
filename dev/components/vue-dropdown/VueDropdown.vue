<template>
    <div
        v-click-outside.capture="onClickOutside"
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
            recentlyShown: true,
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
            this.recentlyShown = true;
            Vue.nextTick(() => {
                this.recentlyShown = false;
            });
            this.recalculatePosition();
            this.$emit("show");
        },
        hide() {
            this.isVisible = false;
            this.$emit("hide");
        },
        recalculatePosition() {
            const targetElement = this.element;
            const dropdownElement = this.$el;

            const targetRect = targetElement.getBoundingClientRect();

            const targetTop = targetRect.top + document.body.scrollTop;
            const targetLeft = targetRect.left + document.body.scrollLeft;
            const targetHeight = targetElement.offsetHeight;
            const targetWidth = targetElement.offsetWidth;
            const dropdownWidth = dropdownElement.offsetWidth;

            const dropdownTop = `${targetTop + targetHeight + DROPDOWN_OFFSET}px`;
            const dropdownLeft = `${targetLeft + targetWidth - dropdownWidth}px`;

            this.style = {
                top: dropdownTop,
                left: dropdownLeft
            };
        },
        onClickOutside() {
            if(this.recentlyShown){
                return;
            }

            if(this.isVisible){
                this.hide();
            }
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
}
</style>
