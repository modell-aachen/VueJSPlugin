<template>
  <div class="vue-simple-pagination">
    <nav v-if="moreThanOnePage">
      <ul :class="ulClass">
        <li :class="getClass('previous')">
          <a
            @click="triggerPageChange(currentPage-1)"
            aria-label="Previous">
            {{ $t('paging_previous') }}
          </a>
        </li>
        <li
          v-for="page in pages"
          :class="getClass(page.number)"><a
            v-if="page.number"
            @click="triggerPageChange(page.number)">
            {{ page.number }}</a><span v-if="pageNull(page)">...</span>
        </li>
        <li :class="getClass('next')">
          <a
            @click="triggerPageChange(currentPage+1)"
            aria-label="Next">
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
    currentPage: {
      required: true,
      type: Number
    },
    pageCount: {
      required: true,
      type: Number
    },
    ulClass: {
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
      // Whenever pageCount changes, it triggers the page list to be rebuilt
      this.buildPageList();
      return this.pageCount > 1;
    }
  },

  watch: {
    currentPage(){
      this.buildPageList();
    }
  },

  methods: {
    buildPageList() {
      this.pages = [];
      let offset = (this.pageLimit - 1);
      let spacing = Math.floor((this.pageLimit - 5)/ 2);
      if (this.pageCount > this.pageLimit) {
        if (this.currentPage >= offset &&  this.currentPage < this.pageCount - offset + 2) {
          this.makePagesRange(1, 1);
          this.pages.push({
            number: null
          });
          this.makePagesRange(this.currentPage - spacing, this.currentPage + spacing);
          this.pages.push({
            number: null
          });
          this.makePagesRange(this.pageCount, this.pageCount);

        } else if (this.currentPage < this.pageLimit -1) {
          this.makePagesRange(1, offset - 1);
          this.pages.push({
            number: null
          });
          this.makePagesRange(this.pageCount, this.pageCount);

        } else if (this.currentPage >= this.pageCount - offset + 2) {
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
      if (pageNumber === this.currentPage) {
        return 'active';
      } else if (pageNumber === null) {
        return 'disabled';
      } else if (pageNumber === 'previous' && this.currentPage === 1) {
        return 'disabled';
      } else if (pageNumber === 'next' && this.currentPage === this.pageCount) {
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
      if (this.currentPage !== newPage) {
        this.$emit('page-changed', newPage);
      }
    }
  }
};
</script>
