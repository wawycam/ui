<template>
  <div class="container">
    <div class="row layout-padding">
      <div>
        <h4 style="padding-bottom: 20px;">{{ title }}</h4>
        <p>{{ help }}</p>
      </div>
      <div class="col-12">
        <q-input v-model="credentials.email" stack-label="Login" color="primary" />
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
      <div class="col-6" style="margin-top:20px;">
        <q-btn :loading="loading" @click="doLogin" full-width default color="primary">
          Login
          <span slot="loading">
            <div>connecting...</div>
          </span>
        </q-btn>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'login',
  props: ['title', 'help', 'callback'],
  data() {
    return {
      loading: false,
      skipQuery: true,
      isWrongCredentials: false,
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
    onKeyUp(event) {
      if (event.key === 'Enter') {
        this.doLogin(null, null);
      }
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
