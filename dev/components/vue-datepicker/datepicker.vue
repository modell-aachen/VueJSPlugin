<template>
    <div class="vue-datepicker">
        <label
            v-if="labelDummy && !label"
            class="input-label label-dummy">
            &nbsp;
        </label>
        <label
            v-if="label"
            class="input-label">
            {{ label }}
        </label>
        <vue-datepicker-component
            ref="datepicker"
            v-model="internalValue"
            :language="datepickerLanguage"
            use-utc />
    </div>
</template>

<script>
import VueDatepickerComponent from 'vuejs-datepicker';

// Note: the translations have been copied, because the tests failed when they do not go through babel
//import { DatepickerTranslationEn, DatepickerTranslationDe } from 'vuejs-datepicker/dist/locale';
import DatepickerTranslationDe from './translation-de';
import DatepickerTranslationEn from './translation-en';

const languageRegExp = new RegExp("^(de|en)(?:-|$)", "i");
export default {
    components: {
        VueDatepickerComponent,
    },
    props: {
        value: {
            type: [Date, String, Number],
            default: () => new Date(0),
        },
        labelDummy: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            datepickerLanguage: this.getTranslation(navigator.languages) === 'de' ? DatepickerTranslationDe : DatepickerTranslationEn,
        };
    },
    computed: {
        internalValue: {
            get() {
                if(typeof(this.value) === 'string' || typeof(this.value) === 'number') {
                    return new Date(new Number(this.value) * 1000);
                } else {
                    return this.value;
                }
            },
            set(newValue) {
                let emitValue;
                if(typeof(this.value) === 'string' || typeof(this.value) === 'number') {
                    emitValue = newValue.getTime() / 1000;
                } else {
                    emitValue = newValue;
                }
                this.$emit('input', emitValue);
            },
        },
    },
    methods: {
        getTranslation(languages) {
            let selectedLanguage;
            languages.forEach(language => {
                if(!selectedLanguage) {
                    let match = languageRegExp.exec(language);
                    if(match) {
                        selectedLanguage = match[1].toLowerCase();
                    }
                }
            });
            return selectedLanguage || 'en';
        },
    },
};
</script>

