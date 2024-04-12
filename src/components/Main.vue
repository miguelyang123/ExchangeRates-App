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
      defaultList: ["USD", "HKD", "GBP", "CAD"],
      otherCurrencyList: [],
      rateDataList: [],
      rateList: {},
      loadedState: false,
      exchangeRateApiUrl: import.meta.env.VITE_EXCHANGE_RATE_API_URL,
      countryFlagApiUrl: import.meta.env.VITE_COUNTRY_FLAG_API_URL,
    };
  },
  methods: {
    async exChange(num, from, to) {
      try {
        const res = await fetch(this.exchangeRateApiUrl + from);
        const data = await res.json();

        // this.rateDataList = Object.keys(data.rates);

        const rates = data.rates[to];

        // console.log(num * rates);
        return num * rates;
      } catch (err) {
        if (err instanceof SyntaxError) {
          console.log("exChange fetch網址語法錯誤: ", err);
        } else {
          console.log("exChange fetch發生錯誤: ", err);
        }
      }
    },
    async getAllRateData() {
      try {
        const res = await fetch(this.exchangeRateApiUrl + "USD");
        const data = await res.json();

        //EX: [{key:"USD", img:"https://flag..."},{}...]
        for (const key of Object.keys(data.rates)) {
          // not find flag: SLE XDR HRK
          let removeKeys = ["SLE", "XDR", "HRK"];
          if (removeKeys.some((rk) => rk === key)) continue;

          const img = await this.getFlag(key);

          this.rateDataList.push({ key, img });
        }

        this.loadedState = true;
      } catch (err) {
        if (err instanceof SyntaxError) {
          console.log("getAllRateData fetch網址語法錯誤: ", err);
        } else {
          console.log("getAllRateData fetch發生錯誤: ", err);
        }
      }
    },
    async getFlag(key) {
      let dataIndex = 0;
      switch (key) {
        case "USD":
          dataIndex = 3;
          break;
      }

      const URL = this.countryFlagApiUrl + key;

      try {
        const res = await fetch(URL);
        const data = await res.json();

        return data[dataIndex].flags.png;
      } catch (err) {
        if (err instanceof SyntaxError) {
          console.log("getFlag fetch網址語法錯誤: ", err);
        } else {
          console.log("getFlag fetch發生錯誤: ", err);
        }
      }
    },
    toFixedNum(num) {
      return Number.parseFloat(num).toFixed(2);
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
    // input to rateDataList
    this.getAllRateData();
    //defaultList
    this.otherCurrencyList = this.defaultList.map((d) => ({
      code: d,
      value: 0,
    }));
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
      :rateDataList="rateDataList"
      :loadedState="loadedState"
      @changeToValue="changeToValue"
      @changeToCode="changeToCode"
    />

    <!-- Other Rate -->
    <OtherCurrencyBox
      :toValue="toValue"
      :toCode="toCode"
      :rateDataList="rateDataList"
      :otherCurrencyList="otherCurrencyList"
      :onDeleteList="onDeleteList"
      :selectedAddOne="selectedAddOne"
    />
  </main>
</template>

<style lang="scss" scoped></style>
