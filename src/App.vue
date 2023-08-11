<script>
import HeaderView from "./components/HeaderView.vue";
import MainView from "./components/Main.vue";
import FooterView from "./components/Footer.vue";
export default {
  components: {
    HeaderView,
    MainView,
    FooterView,
  },
};
</script>

<template>
  <div class="min-h-screen md:h-auto relative bg-[#131419] pb-16">
    <HeaderView />

    <MainView />

    <FooterView />
  </div>
</template>

<style lang="scss" scoped></style>
