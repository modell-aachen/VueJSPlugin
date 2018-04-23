<script>
import VueHeader from './VueHeader';
export default {
  extends: VueHeader,
  props: {
    level: {
      type: [Number, String],
      default: 1,
      validator: this.levelValidator,
    },
  },
};
</script>
