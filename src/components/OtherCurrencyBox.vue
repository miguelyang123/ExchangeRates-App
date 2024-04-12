<script>
export default {
  props: [
    "toValue",
    "toCode",
    "rateDataList",
    "otherCurrencyList",
    "onDeleteList",
    "selectedAddOne",
  ],
  data() {
    return {
      isEdit: false,
      selectValue: "default",
    };
  },
  methods: {
    onEdit() {
      this.isEdit = !this.isEdit;
    },
  },
  watch: {
    selectValue() {
      setTimeout(() => {
        this.selectValue = "default";
      }, 1);
    },
  },
};
</script>

<template>
  <div
    class="w-[18rem] bg-[#2E3545] lg:my-5 m-6 mb-20 rounded-3xl p-7 text-white relative"
  >
    <button
      type="button"
      class="bg-slate-600 w-10 h-10 rounded-full absolute right-5 top-5 hover:bg-slate-800"
      @click="onEdit"
    >
      <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <div class="border-b-2 mt-2 pb-1">
      <div class="inline-block text-2xl truncate w-32">{{ toValue }}</div>
      <span class="text-sm">{{ toCode }} =</span>
    </div>

    <div
      v-for="(item, index) in otherCurrencyList"
      :key="index"
      class="my-3 flex justify-between"
    >
      <div class="">
        <p class="inline-block text-xl truncate w-16">{{ item.code }} :</p>
        <p class="inline-block ml-2 text-lg truncate w-32">{{ item.value }}</p>
      </div>
      <button
        class="text-red-500 text-xl hover:text-red-600"
        type="button"
        v-show="isEdit"
        @click="onDeleteList(item.code)"
      >
        <i class="fa-solid fa-circle-minus"></i>
      </button>
    </div>
    <!-- Add one -->
    <div v-show="isEdit">
      <select
        id="countries"
        v-model="selectValue"
        @change="selectedAddOne"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option selected value="default">增加幣別</option>

        <option v-for="({key}, index) in rateDataList" :key="index" :value="key">
          {{ key }}
        </option>
        <!-- <option value="USD">United States</option> -->
      </select>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
