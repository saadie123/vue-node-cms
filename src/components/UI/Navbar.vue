<template>
  <v-app-bar app color="white" light>
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        transition="scale-transition"
        width="40"
      />

      <v-img
        alt="Vuetify Name"
        class="shrink mt-1 hidden-sm-and-down"
        contain
        min-width="100"
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
        width="100"
      />
    </div>

    <v-spacer></v-spacer>

    <template v-if="user">
      <v-btn text color="primary">
        <span class="mr-2">{{ user.name }}</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn text color="primary">
        <span class="mr-2" @click="onSignout">Signout</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </template>
    <template v-else>
      <v-btn to="/signup" text color="primary">
        <span class="mr-2">Sign up</span>
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
      <v-btn to="/signin" text color="primary">
        <span class="mr-2">Sign in</span>
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.getUser;
    }
  },
  methods: {
    onSignout() {
      this.$store.dispatch("signoutUser");
    }
  }
};
</script>

<style></style>
