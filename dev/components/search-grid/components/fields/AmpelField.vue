<template>
    <div class="ampel">
        <div class="signal">
            <span v-if="ampel.showDate && ampel.warnStatus != 'none'">{{ ampel.dueDate }}</span>
            <img
                v-tooltip="{
                    content: tooltip,
                    classes: 'flatskin-wrapped v-tooltip',
                }"
                :src="url">
        </div>
    </div>
</template>

<script>
import FieldMixin from "./FieldMixin.vue";
export default {
    i18nextNamespace: "SearchGrid",
    mixins: [FieldMixin],
    /* params:
        datefield
        show_date (optional)
        warning_days_yellow (optional)
        warning_days_red (optional)
    */
    data() {
        return {ampel:this.calculateAmpelData()};
    },
    computed: {
        url(){
            return this.$foswiki.getPubUrl(this.$foswiki.getPreference('SYSTEMWEB'), 'AmpelPlugin/images', this.ampel.statusImage);
        },
        tooltip(){
            let positivDaysRemaining = this.ampel.daysRemaining;
            if (this.ampel.warnStatus !== 'none'){
                let text ='more_days';
                if(this.ampel.daysRemaining === 1) {
                    text = 'still_one_day';
                }
                if(this.ampel.daysRemaining === 0) {
                    text = 'today';
                }
                if(this.ampel.daysRemaining === -1) {
                    text = 'since_one_day';
                }
                if(this.ampel.daysRemaining < -1){
                    positivDaysRemaining = positivDaysRemaining * (-1);
                    text = 'since_many_days';
                }
                return this.$t(text,[this.$moment(this.ampel.dueDate, "DD.MM.YYYY").add(this.ampel.daysRemaining, 'days').format('D.MM.YYYY'), positivDaysRemaining]);
            }else{
                return "";
            }
        },
    },
    watch: {
        doc: function () {
            this.ampel = this.calculateAmpelData();
        },
    },
    methods: {
        calculateAmpelData(){
            let statusImageMap = {
                red: "ampel_r.png",
                green: "ampel_g.png",
                yellow: "ampel_o.png",
                none: "ampel.png",
            };
            let showDate = (this.params[1])?((this.params[1] === 0)?false:true):false;
            let warnTimeY = (this.params[2])?parseInt(this.params[2]):7;
            let warnTimeR = (this.params[3])?parseInt(this.params[3]):-1;
            let date = this.doc[this.params[0]];
            let now = this.$moment();

            let dueDate = this.$moment(date);
            let daysRemaining = Math.ceil(dueDate.diff(now,'days',true));
            let warnStatus;
            if(!date || !dueDate.isValid() || this.$moment(dueDate).format('X') === "0"){
                warnStatus = "none";
            } else if (daysRemaining <= warnTimeR){
                warnStatus = "red";
            } else if(daysRemaining < warnTimeY){
                warnStatus = "yellow";
            } else{
                warnStatus = "green";
            }
            let diffDate = warnStatus === "none" ? "" : now.startOf('day').to(dueDate);
            let ampel = {
                dueDate: dueDate.format("D.MM.YYYY"),
                daysRemaining: daysRemaining,
                diffDate: diffDate,
                warnStatus: warnStatus,
                statusImage: statusImageMap[warnStatus],
                showDate: showDate,
            };
            return ampel;
        },
    },
};
</script>
<style lang="scss" scoped>
.signal {
    text-align: center;
}
</style>
