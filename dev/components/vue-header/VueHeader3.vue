<script>
import VueHeader from './VueHeader';
import LevelValidator from "./LevelValidator.js";
export default {
    extends: VueHeader,
    props: {
        level: {
            type: [Number, String],
            default: 3,
            validator: LevelValidator,
        },
    },
};
</script>
