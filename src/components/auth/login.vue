<template>
  <div class="container">
    <div v-if="!create" class="row layout-padding">
      <div>
        <h4 style="padding-bottom: 20px;">{{ title }}</h4>
        <p>{{ help }}</p>
      </div>
      <div class="col-12">
        <q-input v-model="credentials.email" stack-label="Email" color="primary" />
      </div>
      <div class="col-12" style="margin-top:20px;">
        <q-field :error="isWrongCredentials" error-label="Wrong email or password">
          <q-input
            @keyup="onKeyUp"
            v-model="credentials.password"
            stack-label="Password"
            color="primary"
            type="password" />
        </q-field>
      </div>
      <div class="col-12" style="margin-top:20px;">
        <q-btn :loading="loading" @click="doLogin" full-width default color="primary">
          Login
          <span slot="loading">
            <div>connecting...</div>
          </span>
        </q-btn>
        &nbsp;OR&nbsp;
        <q-btn :loading="loading"
                @click="displayRegisterForm(true)"
                full-width
                default
                color="secondary">
          Create account
          <span slot="loading">
            <div>connecting...</div>
          </span>
        </q-btn>&nbsp;
      </div>
    </div>
    <div v-if="create" class="row layout-padding">
      <div>
        <h4 style="padding-bottom: 20px;">Register</h4>
      </div>
      <div class="col-12">
        <q-input v-model="account.name" stack-label="Name" color="primary" />
      </div>
      <div class="col-12">
        <q-field :error="isEmailError" error-label="Email is required">
          <q-input v-model="account.email" stack-label="Email" color="primary" />
        </q-field>
      </div>
      <div class="col-12" style="margin-top:20px;">
        <q-field :error="isPasswordError" error-label="Password should have at least 8 characters">
          <q-input
            @keyup="onKeyUp"
            v-model="account.password"
            stack-label="Password"
            color="primary"
            type="password" />
        </q-field>
      </div>
      <div class="col-12" style="margin-top:20px;">
        <q-field :error="isPasswordDoesntMatch" error-label="Password doesn't match">
          <q-input
            @keyup="onKeyUp"
            v-model="account.confirmPassword"
            stack-label="Confirm Password"
            color="primary"
            type="password" />
        </q-field>
      </div>
      <div class="col-12" style="margin-top:20px;">
        <q-btn :loading="loading" @click="createAccount" full-width default color="primary">
          create
          <span slot="loading">
            <div>connecting...</div>
          </span>
        </q-btn>
        &nbsp;OR&nbsp;
        <q-btn :loading="loading"
               @click="displayRegisterForm(false)"
               full-width
               default
               color="secondary">
          cancel
          <span slot="loading">
            <div>connecting...</div>
          </span>
        </q-btn>&nbsp;
      </div>
    </div>
  </div>
</template>


<script>
import { CREATE_USER } from '../../gql/graphql.js';

export default {
  name: 'login',
  props: ['title', 'help', 'callback'],
  data() {
    return {
      loading: false,
      create: false,
      skipQuery: true,
      isEmailError: false,
      isPasswordError: false,
      isWrongCredentials: false,
      isPasswordDoesntMatch: false,
      account: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      credentials: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    doLogin() {
      this.loading = true;
      this.$auth.login({
        data: this.credentials,
        redirect: null,
        rememberMe: true,
        fetchUser: true,
      }).then(() => {
        this.loading = false;
        this.callback();
      }, () => {
        this.isWrongCredentials = true;
        this.loading = false;
      });
    },
    createAccount() {
      let hasError = false;
      if (this.account.email.length === 0) {
        this.isEmailError = true;
        hasError = true;
      } else {
        this.isEmailError = false;
        hasError = false;
      }
      if (this.account.password.length < 8) {
        this.isPasswordError = true;
        hasError = true;
      } else {
        this.isPasswordError = false;
        hasError = false;
      }
      if (!hasError) {
        if (this.account.password === this.account.confirmPassword) {
          this.$apollo.mutate({
            mutation: CREATE_USER,
            variables: {
              name: this.account.name,
              email: this.account.email,
              password: this.account.password,
            },
          }).then(() => {
            this.$q.notify({
              message: 'Done ! Your are now register',
              type: 'positive',
              position: 'center',
              onDismiss: () => {
                this.create = false;
              },
            });
          });
        } else {
          this.isPasswordDoesntMatch = true;
        }
      }
    },
    onKeyUp(event) {
      if (event.key === 'Enter') {
        this.doLogin();
      }
    },
    displayRegisterForm(display) {
      this.create = display;
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .container
    display: flex;
    justify-content: center;
    align-items: center;
    .logo
      text-align: center;
      padding-bottom: 30px;
    .forgot-password
      padding-top:10px;
</style>
