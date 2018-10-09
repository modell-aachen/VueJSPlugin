<script>
import VueHeader from './VueHeader';
export default {
    extends: VueHeader,
    props: {
        level: {
            type: [Number, String],
            default: 2,
            validator: this.levelValidator,
        },
    },
};
</script>
