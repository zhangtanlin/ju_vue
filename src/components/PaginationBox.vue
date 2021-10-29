<template>
  <div class="pagination">
    <div
      class="prev"
      :disabled="selfNextDisabled"
      @click="prevPage"
    />
    <div v-show="selfPages[0] > 1" class="ellipsis" @click="prevPageFive">
      ...
    </div>
    <div
      v-for="(item, index) in selfPages"
      :key="index"
      :class="[
        'list',
        item === selfPage ? 'active' : ''
      ]"
      @click="changePage(item)"
    >
      {{ item }}
    </div>
    <div v-show="selfPages[selfPagesLength - 1] < selfCountPage" class="ellipsis" @click="nextPageFive">
      ...
    </div>
    <div
      class="next"
      :disabled="selfNextDisabled"
      @click="nextPage()"
    />
    <div class="select">
      {{ selfSize }}条/页
      <div class="select-down" />
      <div class="options-box">
        <div class="options-box-inner">
          <div
            v-for="(item, index) in sizeList"
            :key="index"
            :class="[
              'option',
              selfSize === item.value ? 'option-acitve' : ''
            ]"
            @click="changeSize(item)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="text">
      跳至
    </div>
    <input
      :v-model="selfInputNumber"
      type="text"
      class="input"
      @input="changeOnlyNumber"
    >
    <div class="text">
      页
    </div>
    <div class="btn" @click="changePage(selfInputNumber)">
      确认
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    // 显示的页码数组
    pages: {
      type: Array,
      default: () => {
        return [1, 2, 3, 4, 5];
      }
    },
    // 当前页码
    page: {
      type: Number,
      default: 1
    },
    // 每页显示的条数
    size: {
      type: Number,
      default: 1
    },
    // 每页显示的条数列表
    sizeList: {
      type: Array,
      default: () => {
        return [
          {
            label: '1条/页',
            value: 1
          },
          {
            label: '2条/页',
            value: 2
          },
          {
            label: '3条/页',
            value: 3
          },
          {
            label: '5条/页',
            value: 5
          },
        ]
      }
    },
    // 总数
    total: {
      type: Number,
      default: 0
    },
    // 显示页码的个数
    pagesLength: {
      type: Number,
      default: 5
    },
    // 切换页码（参数为数值页码）
    changePage: {
      type: Function
    },
    // 修改每页显示的条数（参数为数值条数）
    changeSize: {
      type: Function
    },
  },
  data() {
    let tempMimPage = 1,
      tempCountPage = Math.ceil(this.total / this.size),
      tempMaxPage = this.pages.length,
      tempPageArr = [];
    if (this.pagesLength > tempCountPage) {
      tempMaxPage = tempCountPage;
    }
    for (let i = tempMimPage; i <= tempMaxPage; i++) {
      tempPageArr.push(i);
    }
    return {
      /**
       * @param selfPages        页码数组
       * @param selfPage         当前页码
       * @param selfSize         每页显示的条数
       * @param selfCountPage    总页数
       * @param selfTotal        总条数
       * @param selfPagesLength  页码数组长度
       * @param selfPrevDisabled 是否显示上一页按钮
       * @param selfNextDisabled 是否显示下一页按钮
       */
      selfPages: tempPageArr,
      selfPage: this.page,
      selfSize: this.size,
      selfCountPage: tempCountPage,
      selfTotal: this.total,
      selfPagesLength: this.pagesLength,
      selfPrevDisabled: false,
      selfNextDisabled: false,
      selfInputNumber: ''
    }
  },
  watch: {
    page: function (newVal) {
      if (newVal) {
        /**
         * 页码数组中是否包含当前选中的页码，
         * 有则设置为选中，
         * 没有则根据定义的显示页码个数和页码总数，生成一个含有当前页码的数组，并选中当前页码
         */
        if (this.selfPages.includes(newVal)) {
          this.selfPage = newVal;
        } else {
          let tempProportion = Math.ceil(newVal / this.selfPagesLength);
          let tempMimPage = (tempProportion - 1) * this.selfPagesLength + 1,
            tempMaxPage = tempMimPage + this.selfPagesLength - 1,
            tempPageArr = [];
          if (tempMaxPage > this.selfCountPage) {
            tempMaxPage = this.selfCountPage
          }
          for (let i = tempMimPage; i <= tempMaxPage; i++) {
            tempPageArr.push(i);
          }
          this.selfPages = tempPageArr;
          this.selfPage = newVal;
        }
      }
    },
    size: function (newVal) {
      if (newVal) {
        this.selfSize = newVal;
        this.init();
      }
    },
    total: function (newVal) {
      if (newVal) {
        this.selfTotal = newVal;
        this.init();
      }
    },
  },
  methods: {
    // 控制只能输入数字
    changeOnlyNumber(e) {
      const numTemp = e.target.value.replace(/[^\d]/g, '')
      if (Number(numTemp) > this.selfCountPage) {
        const strTemp = String(numTemp).substr(
          0,
          String(numTemp).length - 1
        );
        e.target.value = strTemp;
        this.selfInputNumber = strTemp;
        return;
      }
      e.target.value = numTemp;
      this.selfInputNumber = numTemp;
    },
    // 初始化
    init() {
      let tempMimPage = 1,
        tempMaxPage = this.selfPagesLength,
        maxPage = Math.ceil(this.selfTotal / this.selfSize),
        tempPageArr = [];
      if (this.selfPagesLength > maxPage) {
        tempMaxPage = maxPage;
      }
      for (let i = tempMimPage; i <= tempMaxPage; i++) {
        tempPageArr.push(i);
      }
      this.selfPages = tempPageArr;
      this.selfPage = 1;
      this.selfCountPage = maxPage;
      this.selfPrevDisabled = false;
      this.selfNextDisabled = false;
    },
    // 上一页
    prevPage() {
      let tempPrevNumber = this.selfPage - 1;
      if (this.selfPages.includes(tempPrevNumber)) {
        this.selfPage--;
        this.changePage(this.selfPage--);
      } else {
        this.prevPageFive()
      }
    },
    // 下一页
    nextPage() {
      let tempNextNumber = this.selfPage + 1;
      if (this.selfPages.includes(tempNextNumber)) {
        this.selfPage++;
        this.changePage(this.selfPage++);
      } else {
        this.nextPageFive()
      }
    },
    // 上n页
    prevPageFive() {
      let tempMin = this.selfPages[0] - this.selfPagesLength,
        tempMax = this.selfPages[0] - 1,
        tempPageArr = [];
      if (tempMin < 1) {
        return;
      }
      if (tempMax < this.selfPagesLength) {
        tempMax = this.selfPagesLength;
      }
      for (let i = tempMin; i <= tempMax; i++) {
        tempPageArr.push(i);
      }
      this.selfPages = tempPageArr;
      this.selfPage = tempMax;
      this.changePage(tempMax);
    },
    // 下n页
    nextPageFive() {
      let tempMin = this.selfPages[this.selfPagesLength - 1] + 1,
        tempMax = this.selfPages[this.selfPagesLength - 1] + this.selfPagesLength,
        tempPageArr = [];
      if (tempMax > this.selfCountPage) {
        tempMax = this.selfCountPage
      }
      if (tempMin > this.selfCountPage || isNaN(tempMin) || isNaN(tempMax)) {
        return;
      }
      for (let i = tempMin; i <= tempMax; i++) {
        tempPageArr.push(i);
      }
      this.selfPages = tempPageArr;
      this.selfPage = tempMin;
      this.changePage(tempMin);
    },
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  padding: 10px 0;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
  .prev,
  .ellipsis,
  .next {
    width: 25px;
    height: 25px;
    line-height: 25px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .list {
    height: 25px;
    line-height: 25px;
    margin: 0 3px;
    padding: 0 15px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .prev::after {
    content: '';
    width: 7px;
    height: 7px;
    margin-left: 5px;
    border-top: 2px solid rgb(41, 41, 41);
    border-left: 2px solid rgb(41, 41, 41);
    transform: rotate(-45deg);
  }
  .next::after {
    content: '';
    width: 6px;
    height: 6px;
    margin-left: -5px;
    border-top: 2px solid rgb(41, 41, 41);
    border-left: 2px solid rgb(41, 41, 41);
    transform: rotate(135deg);
  }
  .prev:hover,
  .ellipsis:hover,
  .list:hover,
  .next:hover,
  .active {
    color: #fff;
    background: rgb(255, 0, 46);
  }
  .prev:hover::after,
  .next:hover::after {
    border-top-color: #fff;
    border-left-color: #fff;
  }
  .text {
    margin: 0 5px;
  }
  .input {
    width: 50px;
    height: 23px;
    line-height: 23px;
    text-align: center;
    margin: 0 3px;
    background: #fff;
    border: 1px solid #cecece;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    outline: none;
  }
  .select {
    width: 100px;
    height: 25px;
    line-height: 25px;
    margin: 0 3px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .select:hover .options-box {
    display: block;
  }
  .select-down {
    width: 20px;
    height: 20px;
    position: relative;
  }
  .select-down::after {
    content: '';
    width: 6px;
    height: 6px;
    border-bottom: 2px solid rgb(41, 41, 41);
    border-left: 2px solid rgb(41, 41, 41);
    transform: rotate(135deg);
    position: absolute;
    top: 7.5px;
    left: 5px;
  }
  .options-box {
    width: 100px;
    display: none;
    position: absolute;
    bottom: 25px;
    left: 0;
    z-index: 1;
  }
  .options-box-inner {
    background: #f1f1f1;
    overflow: hidden;
  }
  .option {
    padding: 0 10px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }
  .option:hover,
  .option-acitve {
    color: #fff;
    background: #F7992B;
  }
  .btn {
    height: 25px;
    line-height: 25px;
    padding: 0 10px;
    background: #fff;
  }
  .btn:hover {
    color: #fff;
    background: rgb(255, 0, 46);
  }
}
</style>
