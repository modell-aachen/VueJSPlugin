<template>
    <div class="test-grid-field">
        <ul>
            <li
                v-for="(param,index) in params"
                :key="index">
                {{ doc[param] }}
            </li>
        </ul>
    </div>
</template>

<script>
import FieldMixin from "./FieldMixin.vue";

export default {
    mixins: [FieldMixin]
};
</script>

<style lang="scss">
.test-grid-field {
	margin: 5px;
	border: solid 1px black;
	background-color: lightgray;
	overflow: hidden;
}
</style>
