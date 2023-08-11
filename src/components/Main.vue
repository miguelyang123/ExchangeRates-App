<script>
import ExchangeInputBox from "./ExchangeInputBox.vue";
import OtherCurrencyBox from "./OtherCurrencyBox.vue";

export default {
  components: {
    ExchangeInputBox,
    OtherCurrencyBox,
  },
  data() {
    return {
      toValue: null,
      toCode: "JPY",
      otherCurrencyList: [],
      rateKeyList: [],
    };
  },
  methods: {
    async exChange(num, from, to) {
      const res = await fetch(
        `https://open.exchangerate-api.com/v6/latest/${from}`
      );
      const data = await res.json();

      this.rateKeyList = Object.keys(data.rates);

      const rates = data.rates[to];

      // console.log(num * rates);
      return num * rates;
    },
    async getAllRateKey() {
      try {
        const res = await fetch(
          `https://open.exchangerate-api.com/v6/latest/USD`
        );
        const data = await res.json();
        this.rateKeyList = Object.keys(data.rates);
      } catch (err) {
        console.log(err);
      }
    },
    toFixedNum(num) {
      // console.log(num.tofixed(2));
      return Number.parseFloat(num).toFixed(2);
      // return "123";
    },
    changeToValue(v) {
      this.toValue = +v;
    },
    changeToCode(v) {
      this.toCode = v;
    },

    async changeAllOtherValue() {
      let tempArr = [];
      for (const d of this.otherCurrencyList) {
        const value = await this.exChange(this.toValue, this.toCode, d.code);
        tempArr.push({
          code: d.code,
          value: this.toFixedNum(value),
        });
      }
      this.otherCurrencyList = tempArr;
    },
    onDeleteList(code) {
      let tempList = this.otherCurrencyList;
      const index = tempList.findIndex((l) => l.code === code);
      if (index > -1) {
        tempList.splice(index, 1);
      }
      // this.otherCurrencyList = tempList
    },
    selectedAddOne(e) {
      // console.log(e.target.value);
      if (this.otherCurrencyList.length > 10) {
        return;
      }
      this.otherCurrencyList.push({
        code: e.target.value,
        value: 0,
      });
      this.changeAllOtherValue();
    },
  },
  mounted() {
    // input to rateKeyList
    this.getAllRateKey();
    //defaultList
    const defaultList = ["USD", "HKD", "GBP", "CAD"];
    this.otherCurrencyList = defaultList.map((d) => ({ code: d, value: 0 }));
  },
  watch: {
    toValue() {
      this.changeAllOtherValue();
    },
  },
};
</script>

<template>
  <main class="h-[75%] flex justify-center flex-wrap p-7">
    <!-- Exchange Input -->
    <ExchangeInputBox
      :exChange="exChange"
      :toFixedNum="toFixedNum"
      :rateKeyList="rateKeyList"
      @changeToValue="changeToValue"
      @changeToCode="changeToCode"
    />

    <!-- Other Rate -->
    <OtherCurrencyBox
      :toValue="toValue"
      :toCode="toCode"
      :rateKeyList="rateKeyList"
      :otherCurrencyList="otherCurrencyList"
      :onDeleteList="onDeleteList"
      :selectedAddOne="selectedAddOne"
    />
  </main>
</template>

<style lang="scss" scoped></style>
