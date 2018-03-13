<template>
    <div>
        <h3>List HEADER</h3>
        <vddl-list class="panel__body--list" :list="list" :horizontal="false">
            <slot v-for="(item, index) in list" :item="item" :index="index" :wrapper="list">
                <vddl-draggable class="panel__body--item"
                  :draggable="item"
                  :index="index"
                  :item="item"
                  :wrapper="list"
                  effect-allowed="move">
                    <vue-dad-item :item="item"></vue-dad-item>
                  </vddl-draggable>
            </slot>
            <vddl-placeholder class="red">Custom placeholder</vddl-placeholder>
            <vue-button title="Add" @click.native="add"></vue-button>
        </vddl-list>
    </div>
</template>

<script>
export default {
  props: {
    'label':{
      type: String,
      default: undefined
    }
  },
  data: function() {
    return {
      "list": [
        {
          "id": 1,
          "label": "Item A1"
        },
        {
          "id": 2,
          "label": "Item A2"
        }
      ]
    };
  },
  methods: {
    add: function() {
      this.list.push({
        "id": 5,
        "label": "New Item A1"
      });
    }
  },
  computed: {
    data: {
      get: function() {
        return this.value;
      },
      set: function(newValue) {
        this.$emit('typed', {value: newValue});
      }
    },
    hasError: function(){
      return this.validationErrors.has(this.name);
    },
    definedErrorMessage: function() {
      return this.errorMessage || this.validationErrors.first(this.name);
    }
  }
};
</script>
<style lang="scss">
.vddl-list {
    min-height: 44px;
}
.vddl-list, .vddl-draggable {
    position: relative;
}
.vddl-dragging{
    opacity: 0.7;
}

.vddl-dragging-source {
    display: none;
}
</style>
