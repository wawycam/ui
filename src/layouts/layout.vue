<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-toolbar-title>
          Wawy Configuration
        </q-toolbar-title>
        <q-btn
          flat
          @click="haltOrRebootDialog">
          <q-icon name="power_settings_new" />
        </q-btn>
      </q-toolbar>
    </q-layout-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { QSpinnerGears } from 'quasar';

export default {
  name: 'MyLayout',
  methods: {
    haltOrRebootDialog() {
      this.$q.dialog({
        title: 'Halt or Reboot',
        message: 'Type "halt" or "reboot"',
        prompt: {
          model: '',
        },
        cancel: true,
      }).then((data) => {
        if (data.toLowerCase() === 'halt') {
          this.axios.post('/service/halt').then((res) => {
            if (res.status === 201) {
              this.$router.push('/notconnected');
            }
          });
        } else if (data.toLowerCase() === 'reboot') {
          this.$q.loading.show({
            spinner: QSpinnerGears,
            message: 'Waiting while rebooting...',
            spinnerSize: 250,
            spinnerColor: 'white',
          });
          this.axios.post('/service/reboot').then((res) => {
            if (res.status === 201) {
              setInterval(() => {
                this.axios.get('/service/serial').then((serial) => {
                  if (serial.status === 200) {
                    this.$q.loading.hide();
                    window.location.reload();
                  }
                });
              }, 10000);
            }
          });
        } else {
          this.$q.dialog({
            title: 'Alert',
            message: 'Keyword have to be "reboot" or "halt"',
          });
        }
      });
    },
  },
};
</script>

<style>
</style>
