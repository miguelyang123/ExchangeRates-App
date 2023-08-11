<script>
import InputNumComp from "./InputNumComp.vue";
import SwitchButton from "./SwitchButton.vue";
import SelectCurrencyInput from "./SelectCurrencyInput.vue";
export default {
  components: {
    InputNumComp,
    SwitchButton,
    SelectCurrencyInput,
  },
  props: ["exChange", "toFixedNum", "rateKeyList"],
  data() {
    return {
      toInputValue: null,
      fromInputValue: null,
      toSelectValue: "JPY",
      fromSelectValue: "TWD",
      numClass: ["inline", "text-7xl"],
    };
  },
  methods: {
    //input
    async changeToInputValue(value) {
      this.toInputValue = value;

      const changedValue = await this.exChange(
        +value,
        this.toSelectValue,
        this.fromSelectValue
      );
      this.fromInputValue = this.toFixedNum(changedValue);

      //emit
      this.$emit("changeToValue", value);
    },
    async changeFromInputValue(value) {
      this.fromInputValue = value;

      const changedValue = await this.exChange(
        +value,
        this.fromSelectValue,
        this.toSelectValue
      );
      this.toInputValue = this.toFixedNum(changedValue);

      //emit
      this.$emit("changeToValue", this.toInputValue);
    },

    //Select
    toSelectChange(value) {
      this.toSelectValue = value;
      this.$emit("changeToCode", value);

      this.changeFromInputValue(this.fromInputValue);
    },
    fromSelectChange(value) {
      this.fromSelectValue = value;

      this.changeToInputValue(this.toInputValue);
    },
    // Switch Button
    onSwitch() {
      const tempStr = this.fromSelectValue;
      this.fromSelectValue = this.toSelectValue;
      this.toSelectValue = tempStr;
      const tempNum = this.fromInputValue;
      this.fromInputValue = this.toInputValue;
      this.toInputValue = tempNum;

      this.$emit("changeToCode", this.toSelectValue);
    },
  },
  mounted() {},
  watch: {
    fromInputValue(v) {
      // console.log(v.length);
      if (v.length > 15) {
        this.numClass = ["inline", "text-3xl"];
      } else if (v.length > 8) {
        this.numClass = ["inline", "text-5xl"];
      } else {
        this.numClass = ["inline", "text-7xl"];
      }
    },
  },
};
</script>

<template>
  <div
    class="h-full bg-[#2E3545] lg:my-5 m-6 rounded-3xl p-7 text-white md:block flex flex-col-reverse w-11/12 md:w-auto min-w-fit"
  >
    <!-- input -->
    <div
      class="flex flex-col md:flex-row justify-center items-center md:items-end my-10"
    >
      <!-- left -->
      <div class="md:w-56 w-full">
        <InputNumComp
          id="amount"
          label="金額:"
          :value="toInputValue"
          :onChange="changeToInputValue"
        />
        <SelectCurrencyInput
          id="amountSelect"
          :rateKeyList="rateKeyList"
          :value="toSelectValue"
          :onChange="toSelectChange"
        />
      </div>
      <!-- switch button -->
      <SwitchButton class="mx-5 my-8" @click="onSwitch" />
      <!-- right -->
      <div class="md:w-56 w-full">
        <InputNumComp
          id="toRates"
          label="兌換為:"
          :value="fromInputValue"
          :onChange="changeFromInputValue"
        />
        <SelectCurrencyInput
          id="toRatesSelect"
          :rateKeyList="rateKeyList"
          :value="fromSelectValue"
          :onChange="fromSelectChange"
        />
      </div>
    </div>
    <!-- Show -->
    <div class="flex justify-center items-center md:mt-16 md:mb-10 mt-7">
      <div>
        <p class="text-lg">
          {{ toInputValue ? toFixedNum(toInputValue) : "0" }}
          {{ toSelectValue }} =
        </p>
        <p :class="numClass">
          {{ fromInputValue ? toFixedNum(fromInputValue) : "0" }}
        </p>
        <span>{{ fromSelectValue }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
