<script>
export default {
  props: ["id", "rateKeyList", "value", "onChange"],
  inject: [],
  data() {
    return {
      isOpen: false,
      // value: "USD",
    };
  },
  methods: {
    onOpen() {
      this.isOpen = !this.isOpen;
    },
    // onSelected(name) {
    //   this.value = name;
    // },
    getCountriesIconUrl(str) {
      let substrStr = str.substr(0, 2);
      switch (str) {
        case "XAF":
          substrStr = "TD";
          break;
        case "XCD":
          substrStr = "VC";
        case "XDR":
          return "https://www.crwflags.com/fotw/images/i/int-imf.gif";
        case "XOF":
          substrStr = "TG";
          break;
        case "XPF":
          substrStr = "PF";
          break;
      }
      return `https://www.countryflagicons.com/FLAT/64/${substrStr}.png`;
    },
  },
  mounted() {},
};
</script>

<template>
  <div>
    <div
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 relative cursor-pointer"
      @click="onOpen"
    >
      <div class="select-btn flex justify-between items-center">
        <div>
          <img class="h-6 inline mr-3" :src="getCountriesIconUrl(value)" />
          <span class="sBtn-text">{{ value }}</span>
        </div>
        <i class="fa-solid fa-caret-down mr-2" v-if="!isOpen"></i>
        <i class="fa-solid fa-caret-up mr-2" v-if="isOpen"></i>
      </div>
      <div
        v-show="isOpen"
        class="absolute top-14 left-0 rounded-lg bg-white w-full p-2 z-10"
      >
        <ul class="options overflow-auto max-h-60">
          <li
            class="option p-2.5 rounded-lg hover:bg-slate-200 cursor-pointer"
            @click="onChange(name)"
            v-for="(name, index) in rateKeyList"
            :key="index"
          >
            <img class="w-6 inline mr-3" :src="getCountriesIconUrl(name)" />
            <span class="option-text">{{ name }}</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- click bg -->
    <div
      class="h-screen w-screen fixed top-0 left-0"
      v-if="isOpen"
      @click="onOpen"
    ></div>
  </div>
</template>

<style lang="scss" scoped></style>
