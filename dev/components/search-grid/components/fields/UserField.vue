<template>
    <div v-if="shouldRenderUserIcon">
        <span
            v-for="(user,index) in users"
            :key="index">
            {{ user.name }}
            <vue-user-card
                v-if="!user.name.includes('Group')"
                :id="user.id"/><br>
        </span>
    </div>
    <div v-else>
        <span
            v-for="(user,index) in users"
            :key="index">
            {{ user.name }}<br>
        </span>
    </div>
</template>

<script>
import FieldMixin from "./FieldMixin.vue";

export default {
    mixins: [FieldMixin],
    computed: {
        isEmployeeEnabled: function() {
            return 'vue-user-card' in Vue.options.components;
        },
        shouldRenderUserIcon: function() {
            return this.isEmployeeEnabled && parseInt(this.$foswiki.getPreference('EMPLOYEESAPP_USERICON'));
        },
        userNames: function(){
            let userNames = this.doc[this.params[0]] || "";
            return userNames.split(", ");
        },
        userIds: function(){
            let userIds = this.doc[this.params[1]] || "";
            return userIds.split(", ");
        },
        users: function() {
            let users = this.userNames.map((name, index) => {
                return {
                    name,
                    id: this.userIds[index]
                };
            });
            return users.sort((a,b) => {
                let lcNameA = a.name.toLowerCase();
                let lcNameB = b.name.toLowerCase();
                return lcNameA.localeCompare(lcNameB);
            });
        }
    }
};
</script>
