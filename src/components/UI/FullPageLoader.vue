<template>
  <div class="full-page-loader d-flex justify-center align-center">
    <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
  </div>
</template>

<style lang="scss" scoped>
.full-page-loader {
  height: 100%;
  width: 100%;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
}
</style>