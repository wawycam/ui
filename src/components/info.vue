<template>
  <div>
    <div v-if="camera" class="col info">
      <h2>
        {{ camera.name }}
        <q-btn v-if="ip" color="secondary" size="sm" label="online" />
        <q-btn v-if="!ip" color="tertiary" size="sm" label="offline" />
        <q-btn icon="settings"
               :disable="!enableSettings"
               @click="openSettings = true"
               color="warning" size="sm" label="settings" style="margin-left: 20px;"/>
      </h2>
      <div class="row">
        <div class="col-6">
          <p><small><strong>Serial:</strong> {{ camera.serial }}</small></p>
        </div>
        <div class="col-6">
          <p><small><strong>IP adress:</strong> {{ ip }}</small></p>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <p><small><strong>Uptime:</strong> {{ camera.uptime | uptime }}</small></p>
        </div>
        <div class="col-6">
          <p><small><strong>Disk free:</strong> {{ camera.diskFree }} Go</small></p>
        </div>
      </div>
    </div>
    <div v-if="!camera" class="col">
      <q-alert
        v-if="timeout"
        type="negative"
        icon="warning"
        :actions="[{label: 'try again', handler () {
          getWawy();
        }}]">
        Sorry couldn't reach your camera
      </q-alert>
      <h3 v-if="connecting"><q-spinner :size="30" /> connecting to your camera...</h3>
    </div>
    <q-modal
      v-if="enableSettings"
      v-model="openSettings">
      <Settings :ssid="ssid"
                :ip="ip"
                :camera="camera"></Settings>
    </q-modal>
    <q-modal
      :no-esc-dismiss="true"
      :no-backdrop-dismiss="true"
      v-model="openLogin">
      <Login
        title="Authentication"
        help="Please login to register your camera"
        :callback="authOk"
      ></Login>
    </q-modal>
  </div>
</template>

<style scopped lang="stylus">
  h2, h4
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
  .info
    p
      margin-top 0.6em
      margin-bottom 0.6em
    .title
      font-weight bold
      color primary
    small
      font-size 100%
      color #969696
</style>

<script>
import moment from 'moment';

import Settings from './settings';
import Login from './auth/login';
import { UPDATE_OR_REGISTER_CAMERA } from '../gql/graphql.js';

export default {
  name: 'Info',
  components: {
    Login,
    Settings,
  },
  data() {
    return {
      connecting: true,
      timeout: false,
      camera: null,
      ip: null,
      ssid: null,
      enableSettings: false,
      openLogin: false,
      openSettings: false,
    };
  },
  filters: {
    uptime: (uptime) => {
      const diff = moment().diff(moment(uptime * 1000));
      const oUptime = moment.utc(moment.duration(diff).asMilliseconds()).toObject();
      return `${(oUptime.date - 1)} days, ${oUptime.hours} hours, ${oUptime.minutes} mn`;
    },
  },
  created() {
    this.getWawy();
  },
  methods: {
    getWawy() {
      this.connecting = true;
      this.timeout = false;
      this.axios.get('/wawy')
        .then((response) => {
          const wawy = response.data;
          this.lastName = wawy.name;
          this.$localStorage.set('tracks', JSON.stringify(wawy.tracks));
          this.axios.get('/service/info')
            .then((infoResponse) => {
              const info = infoResponse.data;
              this.camera = {
                name: wawy.name,
                serial: wawy.serial,
                diskFree: info.disk.free,
                uptime: info.uptime,
              };
              this.getConnectedSsid();
            });
        })
        .catch(() => {
          this.connecting = false;
          this.timeout = true;
          // clearInterval(this.pollingSsidList);
        });
    },
    getConnectedSsid() {
      this.axios.get('/wifi/status')
        .then((activeSsid) => {
          if (activeSsid && activeSsid.data.ssid && activeSsid.data.ip_address) {
            this.ssid = activeSsid.data.ssid;
            this.ip = activeSsid.data.ip_address;
            this.enableSettings = true;
            if (!this.$auth.check()) {
              this.openLogin = true;
            } else {
              this.updateOrRegisterCamera();
            }
          } else {
            this.enableSettings = true;
          }
        });
    },
    updateOrRegisterCamera() {
      this.$apollo.mutate({
        mutation: UPDATE_OR_REGISTER_CAMERA,
        variables: {
          serial: this.camera.serial,
          camera: {
            serial: this.camera.serial,
            name: this.camera.name,
            ip: this.ip,
          },
        },
      });
    },
    authOk() {
      // need to reload page as Apollo should be initialize with JWT
      window.location.reload();
    },
  },
};
</script>
