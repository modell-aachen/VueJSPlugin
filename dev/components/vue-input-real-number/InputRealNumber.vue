<template lang="pug">
    extends ../vue-input-text/InputTextTemplate.pug

    block inputExtraAttributes
        - inputExtraAttributes[':cacheDefeat'] = "cacheDefeat"
        - inputExtraAttributes[':name'] = "name"
        - delete inputExtraAttributes['v-validate']
</template>

<script>
import InputTextField from '../vue-input-text/InputText';

const isANumber = input => input !== undefined && input !== '' && input !== '-';

const displayValueToNumberString = function(input) {
    input = input.replace(/\s/g, '');
    const decimalDelimiter = getDecimalDelimiter(input);
    input = input.replace(decimalDelimiter, '_').replace(/[.,]/g, '').replace('_', '.');
    if(!isANumber(input)) {
        return '';
    }
    return String(new Number(input));
}

const escapeCursorPos = function(cursorStart, cursorEnd, newValue) {
    newValue = newValue.replace(/s/g, '_').replace(/e/g, '_');
    newValue = newValue.slice(0, cursorStart) + 's' + newValue.slice(cursorStart, cursorEnd) + 'e' + newValue.slice(cursorEnd);

    return newValue;
};

const extractCursorPos = (newValue) => {
    const newCursorStart = newValue.indexOf('s');
    const newCursorEnd = newValue.indexOf('e') - 1;
    newValue = newValue.replace(/[se]/g, '');

    return {newCursorStart, newCursorEnd, newValue};
};

const filterDisallowedChars = (newValue) => {
    return newValue.replace(/[^0-9., se-]/g, '');
};

const reduceConsecutiveSeparators = (newValue, delimiter) => {
    newValue = newValue
        .replace(/\s{2,}/g, ' ')
        .replace(new RegExp(`([${delimiter}][\\sse]*)[,.]+`, 'g'), '$1')
        .replace(new RegExp(`[,.]+([\\sse]*[${delimiter}])`, 'g'), '$1')
        .replace(/([,.]){2,}/, '$1')
        .replace(new RegExp(`[${delimiter}]\\s[.,]|[.,]\\s${delimiter}`, 'g'), delimiter)
        .replace(/(\s?[,.]\s?)[,.]+/g, '$1');
    return newValue;
};

const markDecimalDelimiter = (newValue, delimiter) => {
    return newValue.replace(new RegExp(`[${delimiter}]\\s*`), `${delimiter}  `);
};

const removeDecimalMarker = (newValue, delimiter) => {
    newValue =  newValue
        .replace(`${delimiter}  `, delimiter);
    return newValue;
};

const filterLeadingSpaces = (newValue) => {
    return newValue.replace(/^([se]*)\s+/g, '$1');
};

const filterInBetweenMinuses = (newValue) => {
    return newValue.replace(/^([se]{0,2})-/, '$1_').replace(/-/g, '').replace(/_/, '-');
};

const inhibitCursorInsideDecimalMarker = (newValue, decimalDelimiter) => {
    return newValue
        .replace(new RegExp(`([${decimalDelimiter}])([se]+)  `), '$2$1  ')
        .replace(new RegExp(`([${decimalDelimiter}]) ([se]+) `), '$2$1  ');
};
const getDecimalDelimiter = (value) => {
    if(/,/.test(value) || !/\./.test(value) || /\.[^.]+\./.test(value)) {
        return ',';
    } else {
        return '.';
    }
};

const filterInput = (cursorStart, cursorEnd, newValue, oldValue = '') => {
    let decimalDelimiter = getDecimalDelimiter(newValue);
    const decimalMarkerDeleted = oldValue === newValue.replace(`${decimalDelimiter} `, `${decimalDelimiter}  `);

    let newCursorEnd;
    let newCursorStart;
    newValue = escapeCursorPos(cursorStart, cursorEnd, newValue);
    if(decimalMarkerDeleted) {
        newValue = newValue.replace(new RegExp(`[${decimalDelimiter}]([se]*) `), '$1'); // XXX misbehaves when pressing 'del' between marker spaces
    } else {
        const oldDecimalDelimiter = getDecimalDelimiter(oldValue);
        newValue = removeDecimalMarker(newValue, decimalDelimiter);
        newValue = removeDecimalMarker(newValue, oldDecimalDelimiter);
    }
    newValue = filterDisallowedChars(newValue);
    newValue = filterLeadingSpaces(newValue);
    newValue = reduceConsecutiveSeparators(newValue, decimalDelimiter);
    newValue = markDecimalDelimiter(newValue, decimalDelimiter);
    newValue = filterInBetweenMinuses(newValue);
    newValue = inhibitCursorInsideDecimalMarker(newValue, decimalDelimiter);
    ({newCursorStart, newCursorEnd, newValue} = extractCursorPos(newValue));
    return {newValue, newCursorStart, newCursorEnd};
};

export default {
    props: InputTextField.props,
    inject: InputTextField.inject,
    data() {
        const formattedLocaleNumber = new Number(1.2).toLocaleString();
        const delimiter = getDecimalDelimiter(formattedLocaleNumber);
        let displayValue = isANumber(this.value) ? new String(new Number(this.value)) : '';
        displayValue = displayValue.replace(/\./, delimiter);
        ({newValue: displayValue} = filterInput(0, 0, displayValue));
        return {
            cacheDefeat: Math.random(),
            displayValue,
        };
    },
    computed: Object.assign(
        {},
        InputTextField.computed,
        {
            data: {
                get() {
                    return this.displayValue;
                },
                set(value) {
                    const oldCursorStart = this.$refs.input.selectionStart || 0;
                    const oldCursorEnd = this.$refs.input.selectionEnd || oldCursorStart;
                    let {newCursorStart, newCursorEnd, newValue} = filterInput(oldCursorStart, oldCursorEnd, value, this.displayValue);

                    if(newValue === this.displayValue) {
                        this.cacheDefeat = Math.random();
                    }
                    this.displayValue = newValue;
                    this.$emit('input', displayValueToNumberString(newValue));

                    this.$nextTick(() => {
                        this.$refs.input.selectionStart = newCursorStart;
                        this.$refs.input.selectionEnd = newCursorEnd;
                    });
                },
            },
        },
    ),
    mounted() {
        this.$refs.input.selectionStart = this.displayValue.length;
        this.$refs.input.selectionEnd = this.displayValue.length;
    },
};
</script>

<style lang="scss">
@import '../../sass/settings.scss';
</style>

