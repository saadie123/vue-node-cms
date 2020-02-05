<template>
  <div>
    <h1 class="text-center font-weight-light display-2 mb-4">Sign up</h1>
    <v-card class="mx-auto" max-width="400" :loading="loading">
      <transition name="fade">
        <v-alert type="error" v-if="error">Error {{ error.code }} - {{ error.message }}</v-alert>
      </transition>
      <form class="pa-5" @submit.prevent="onSubmit">
        <v-text-field
          v-model="name"
          label="Name"
          type="text"
          :error="nameErrors.length > 0"
          :error-messages="nameErrors"
          required
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="email"
          label="E-mail"
          type="email"
          :error="emailErrors.length > 0"
          :error-messages="emailErrors"
          required
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          :error="passwordErrors.length > 0"
          :error-messages="passwordErrors"
          type="password"
          required
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
          :error-messages="confirmPasswordErrors"
          type="password"
          required
          @input="$v.confirmPassword.$touch()"
          @blur="$v.confirmPassword.$touch()"
        ></v-text-field>
        <v-btn class="mt-2" color="primary" type="submit" block :disabled="$v.$invalid || loading">
          <span class="mr-2">Submit</span>
        </v-btn>
      </form>
    </v-card>
  </div>
</template>
<script>
import { required, email, sameAs } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
  },
  validations: {
    name: { required },
    email: {
      required,
      email
    },
    password: {
      required
    },
    confirmPassword: {
      required,
      matched: sameAs("password")
    }
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push("Name is required");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("E-mail is not valid");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      !this.$v.confirmPassword.required &&
        errors.push("Please confirm your password");
      !this.$v.confirmPassword.matched && errors.push("Passwords do not match");
      return errors;
    },
    error() {
      return this.$store.getters.getError;
    },
    loading() {
      return this.$store.getters.getLoading;
    }
  },
  watch: {
    error(val) {
      if (val) {
        const { name, email, password } = val.errors;
        if (name) {
          this.nameErrors.push(name);
        }
        if (email) {
          this.emailErrors.push(email);
        }
        if (password) {
          this.passwordErrors.push(password);
        }
      }
    }
  },
  methods: {
    onSubmit() {
      const payload = {
        name: this.name,
        email: this.email,
        password: this.password
      };
      this.$store.dispatch("signupUser", payload);
    }
  },
  created() {
    this.$store.commit("setError", null);
  }
};
</script>
