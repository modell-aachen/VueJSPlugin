<template>
    <div class="vue-simple-pagination">
        <nav v-if="moreThanOnePage">
            <ul :class="ulClass">
                <li :class="getClass('previous')">
                    <a
                        aria-label="Previous"
                        href=""
                        @click.prevent="triggerPageChange(value-1)">
                        {{ $t('paging_previous') }}
                    </a>
                </li>
                <li
                    v-for="page in pages"
                    :key="page.number"
                    :class="getClass(page.number)"><a
                        v-if="page.number"
                        href=""
                        @click.prevent="triggerPageChange(page.number)">
                        {{ page.number }}</a><span v-if="pageNull(page)">...</span>
                </li>
                <li :class="getClass('next')">
                    <a
                        aria-label="Next"
                        href=""
                        @click.prevent="triggerPageChange(value+1)">
                        {{ $t('paging_next') }}
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    i18nextNamespace: 'VueJSPlugin',
    props: {
        value: {
            required: true,
            type: Number
        },
        pageCount: {
            required: true,
            type: Number
        },
        ulClass: {
            type: [String, Object],
            default: 'pagination'
        },
        pageLimit: {
            default: 7,
            type: Number,
            validator: function(limit) {
                return limit === 7 || limit === 15;
            }
        },
    },

    data: function () {
        return {
            pages: []
        };
    },

    computed: {
        moreThanOnePage() {
            return this.pageCount > 1;
        }
    },

    watch: {
        value(){
            this.buildPageList();
        },
        pageCount(){
            this.buildPageList();
        }
    },

    mounted() {
        this.buildPageList();
    },

    methods: {
        buildPageList() {
            this.pages = [];
            let offset = (this.pageLimit - 1);
            let spacing = Math.floor((this.pageLimit - 5)/ 2);
            if (this.pageCount > this.pageLimit) {
                if (this.value >= offset &&  this.value < this.pageCount - offset + 2) {
                    this.makePagesRange(1, 1);
                    this.pages.push({
                        number: null
                    });
                    this.makePagesRange(this.value - spacing, this.value + spacing);
                    this.pages.push({
                        number: null
                    });
                    this.makePagesRange(this.pageCount, this.pageCount);

                } else if (this.value < this.pageLimit -1) {
                    this.makePagesRange(1, offset - 1);
                    this.pages.push({
                        number: null
                    });
                    this.makePagesRange(this.pageCount, this.pageCount);

                } else if (this.value >= this.pageCount - offset + 2) {
                    this.makePagesRange(1, 1);
                    this.pages.push({
                        number: null
                    });
                    this.makePagesRange(this.pageCount - offset + 2, this.pageCount);

                }
            } else {
                this.makePagesRange(1, this.pageCount);
            }
        },

        makePagesRange(x,y) {
            for (let i=x;i<=y;i++){
                this.pages.push({
                    number: i
                });
            }
        },

        getClass(pageNumber) {
            if (pageNumber === this.value) {
                return 'active';
            } else if (pageNumber === null) {
                return 'disabled';
            } else if (pageNumber === 'previous' && this.value === 1) {
                return 'disabled';
            } else if (pageNumber === 'next' && this.value === this.pageCount) {
                return 'disabled';
            } else {
                return 'clickable';
            }
        },

        pageNull(page) {
            return page.number === null;
        },

        triggerPageChange(newPage) {
            if(newPage < 1 || newPage > this.pageCount) {
                return;
            }
            if (this.value !== newPage) {
                this.$emit('input', newPage);
            }
        }
    }
};
</script>
