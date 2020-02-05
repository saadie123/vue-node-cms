<template>
  <v-app>
    <transition name="fade" mode="out-in" appear>
      <full-page-loader v-if="dataLoading"></full-page-loader>
    </transition>
    <transition name="fade" mode="out-in" appear>
      <div v-if="!dataLoading">
        <navbar></navbar>
        <v-content class="mt-3">
          <v-container>
            <transition name="slide" mode="out-in" appear>
              <router-view></router-view>
            </transition>
          </v-container>
        </v-content>
      </div>
    </transition>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import Navbar from "@/components/UI/Navbar";
import FullPageLoader from "@/components/UI/FullPageLoader";

export default {
  name: "App",

  components: {
    HelloWorld,
    Navbar,
    FullPageLoader
  },

  computed: {
    dataLoading() {
      return this.$store.getters.getLoadingUserData;
    }
  },
  created() {
    this.$store.commit("setLoadingUserData", true);
    this.$store.dispatch("autoSigninUser");
  }
};
</script>
