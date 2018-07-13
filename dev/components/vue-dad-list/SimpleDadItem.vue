<template>
    <div class="ma-block">
        <div class="ma-simple-item">
            <div
                :class="{'ma-simple-item--removeable': itemRemoveable}"
                class="cell grid-x align-justify grid-padding-x ma-draggable" >
                <div
                    :class="{'auto': itemRemoveable, 'ma-simple-item-title--small': isSmallItem}"
                    class="cell ma-simple-item-title">
                    <div class="grid-x ma-collapsible-item-title-left grid-padding-x">
                        <div class="cell shrink align-self-middle handle-container">
                            <span class="fal fa-bars"/>
                        </div>
                        <div class="cell shrink align-self-middle">
                            <vue-header3
                                :sublabel="item.subLabel"
                                :status="item.status">{{ item.label || item.description }}</vue-header3>
                        </div>
                    </div>
                </div>
                <div
                    v-if="itemRemoveable"
                    class="cell shrink align-self-middle ma-simple-item-button">
                    <vue-button
                        type="icon"
                        icon="far fa-times"
                        @click.native.prevent="$emit('remove-item', item)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SimpleItem',
    props: {
        item: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        isSmallItem: {
            type: Boolean,
            default: false
        },
        isDraggable: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        itemRemoveable: function() {
            return this.$listeners && this.$listeners['remove-item'];
        }
    }
};
</script>


<style lang="scss">
@import '../../sass/settings.scss';
.handle {
  cursor: move;
}

.ma-simple-item h3 {
  margin-bottom: 0;
}

.ma-simple-item--removeable .cell.ma-simple-item-button {
    padding-left: 0;
    padding-right: 0;
    text-align: right;

    a.button {
      margin-left: map-get($spacings, small);
      color: $ma-failure;
      &:hover {
        color: $ma-failure-hover;
      }
    }
}
</style>
