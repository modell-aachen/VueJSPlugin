<template>
    <vue-dad-list v-model="list" @add-item="addMetadataBlock" :allowed-types="['metadataBlock']" item-type="vue-collapsible-dad-item">
     <vue-collapsible-dad-item slot-scope="props"
       :item="props.item"
       :index="props.index"
       :can-drop-in-title="true"
       @dropped-item="addItemFromDummyList"
       :allowed-types="allowedTypes"
       :last-opend-item-id="props.lastOpendItemId"
       :remove-options="{ name: 'Löschen', onRemove: onRemoveItem }"
       >
     </vue-collapsible-dad-item>
   </vue-dad-list>
</template>

<script>
export default {
  methods: {
    addItemFromDummyList: function({ dummyList, index }) {
      this.list[index].fields[0].push(dummyList[0]);
    },
    addMetadataBlock: function() {
      this.list.push({
        id: Vue.getUniqueId(),
        label: "New Item A1",
        type: "metadataBlock"
      });
    },
    onRemoveItem: function(item, index) {
      this.list.splice(index, 1);
    }
  },
  data() {
    return {
      allowedTypes: ["status"],
      list: [
        {
          id: 1,
          type: "metadataBlock",
          label: "Item A1",
          subLabel: "Caption",
          status: "warning",
          icon: "fas fa-camera-retro",
          fields: [
            [
              {
                id: 1,
                label: "SubItem 1",
                type: "status"
              },
              {
                id: 2,
                label: "SubItem 2",
                type: "status"
              }
            ],
            [
              {
                id: 11,
                label: "SubItem B",
                type: "status"
              }
            ]
          ]
        },
        {
          id: 2,
          type: "metadataBlock",
          label: "Item A2",
          status: "warning",
          fields: [
            [
              {
                id: 101,
                label: "SubItem 1",
                type: "status"
              },
              {
                id: 102,
                label: "SubItem 2",
                type: "status"
              }
            ],
            []
          ]
        }
      ]
    };
  }
};
</script>

