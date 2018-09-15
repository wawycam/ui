<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-toolbar-title>
          Wawy Camera
          <span slot="subtitle">
            <strong>UI version: </strong>
            <span class="changelog" @click="getChangeLog('ui')">{{ uiVersion }}</span> |
            <strong>API version: </strong>
            <span class="changelog" @click="getChangeLog('api')">{{ apiVersion }}</span>
          </span>
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
    <q-modal
      content-css="padding: 20px"
      v-model="openChangeLog">
      <h3>{{ repo }} change log</h3>
      <q-list no-border inset-separator>
        <q-item
          v-for="log in changeLog"
          :key="log.hash">
          <q-item-side icon="fab fa-github" />
          <q-item-main>
            <q-item-tile label><a :href="`https://github.com/wawycam/${repo}/commit/${log.hash}`" target="_blank">{{ log.message }}</a></q-item-tile>
            <q-item-tile sublabel lines="2">
              {{ log.date | date }}
            </q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
    </q-modal>
  </q-layout>
</template>

<script>
import { date, QSpinnerGears } from 'quasar';

export default {
  name: 'MyLayout',
  data() {
    return {
      openChangeLog: false,
      repo: false,
      uiVersion: '-',
      apiVersion: '-',
      changeLog: [],
    };
  },
  created() {
    this.axios.get('/service/update?repo=ui')
      .then((uiResponse) => {
        this.axios.get('/service/update?repo=api')
          .then((apiResponse) => {
            this.uiVersion = uiResponse.data;
            this.apiVersion = apiResponse.data;
            this.applyUpdate();
          });
      });
  },
  filters: {
    date: (dateLog => date.formatDate(dateLog, 'dddd DD MMMM YYYY - HH[h]mm')),
  },
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
    getChangeLog(repo) {
      this.repo = repo.toUpperCase();
      this.openChangeLog = true;
      this.axios.get(`/service/changelog?repo=${repo}`)
        .then((changeLog) => {
          this.changeLog = changeLog.data;
        });
    },
    showLoading(repo) {
      this.$q.loading.hide();
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: `Updating ${repo}...please wait.`,
        spinnerSize: 250,
        spinnerColor: 'white',
      });
    },
    pullUpdate(repo, callback) {
      this.axios.post(`/service/update?repo=${repo}`)
        .then(() => callback());
    },
    applyUpdate() {
      if (this.uiVersion === 'updateAvailable') {
        this.showLoading('UI');
        this.pullUpdate('ui', () => {
          if (this.apiVersion === 'updateAvailable') {
            this.showLoading('API');
            this.pullUpdate('api', () => {
              window.location.reload();
            });
          } else {
            window.location.reload();
          }
        });
      } else if (this.apiVersion === 'updateAvailable') {
        this.showLoading('API');
        this.pullUpdate('api', () => {
          window.location.reload();
        });
      }
    },
  },
};
</script>

<style scopped lang="stylus">
  a {
    color: #000;
    font-weight: bold;
    text-decoration: none;
  }
  ul
    list-style-type: none
  h3
    -webkit-margin-before: 0
    -webkit-margin-after: 20px;
  .changelog
    color: white
    cursor: pointer
    text-decoration: underline
</style>
