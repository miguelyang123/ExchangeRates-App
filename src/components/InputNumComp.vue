<script>
export default {
  props: ["id", "label", "value", "onChange"],
  inject: [],
  data() {
    return {
      inputValue: null,
    };
  },
  methods: {
    onChangeValue(e) {
      this.onChange(e.target.value);
    },
  },
};
</script>

<template>
  <div class="mb-6">
    <label :for="id" class="block mb-2 font-medium text-lg">
      {{ label }}
    </label>
    <input
      type="number"
      :id="id"
      @input="onChangeValue"
      :value="value"
      class="bg-gray-50 border border-gray-300 text-gray-950 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>
</template>

<style lang="scss" scoped></style>
