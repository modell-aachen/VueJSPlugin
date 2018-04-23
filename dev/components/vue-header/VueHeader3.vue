<script>
import VueHeader from './VueHeader';
export default {
  extends: VueHeader,
  props: {
    level: {
      type: [Number, String],
      default: 3,
      validator: this.levelValidator,
    },
  },
};
</script>
