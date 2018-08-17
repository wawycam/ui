<template>
  <q-page padding class="padding-top">
    <div class="row no-wrap justify-center items-center">
      <div class="col-4 q-pr-lg" style="text-align: right">
        <img alt="WawyCam" src="~assets/PiBoxFront.png" style="width: 80%">
      </div>
      <div v-if="!name" class="col">
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
      <div v-if="name" class="col">
        <div class="row column">
          <div class="col info">
            <h2>
              {{ name }}
              <q-btn v-if="ip" color="secondary" size="sm" label="online" />
              <q-btn v-if="!ip" color="tertiary" size="sm" label="offline" />
            </h2>
            <p><small><strong>Serial:</strong> {{ serial }}</small></p>
            <p><small><strong>IP adress:</strong> {{ ip }}</small></p>
            <p><small><strong>Uptime:</strong> {{ uptime | uptime }}</small></p>
            <p><small><strong>Disk free:</strong> {{ diskFree }} Go</small></p>
          </div>
          <div class="col">
            <h4 class="padding-top margin-bottom"><q-icon name="settings" /> Settings</h4>
          </div>
          <div class="col margin-bottom">
            <div class="row">
              <q-input v-model="name" float-label="Camera Name" />
              <q-btn color="primary"
                     @click="setName"
                     style="height: 50%; margin-top: 20px;">
                save
              </q-btn>
            </div>
          </div>
          <div class="col">
            <p v-if="ssidList.length === 0" style="padding-top: 15px;">
              <q-spinner :size="15" /> searching wifi network...
            </p>
            <q-select
              v-if="ssidList.length > 0"
              v-model="ssid"
              float-label="Select a wifi network"
              @focus="startSsidSearch"
              @blur="clearSsidSearch"
              @input="setWifi"
              :options="ssidList"
            />
            <q-alert
              v-if="ssidPskError"
              type="negative"
              icon="warning"
              :actions="[{label: 'try again', handler () {
                setWifi();
              }}]">
              Unable to connect to selected Wifi, please check your password
            </q-alert>
          </div>
        </div>
      </div>
    </div>
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
  </q-page>
</template>

<style scopped lang="stylus">
  .padding-top
    padding-top 30px;
  .margin-bottom
    margin-bottom 15px
  h2, h4
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
  .info
    p
      margin 0.6em
    .title
      font-weight bold
      color primary
    small
      font-size 100%
      color #969696
</style>

<script>
import moment from 'moment';
import { QSpinnerGears } from 'quasar';

import { UPDATE_OR_REGISTER_CAMERA } from '../gql/graphql.js';
import Login from 'components/auth/login';

export default {
  name: 'PageIndex',
  components: {
    Login,
  },
  data() {
    return {
      openLogin: false,
      connecting: true,
      timeout: false,
      skipQuery: true,
      oldName: '',
      name: null,
      serial: '',
      diskFree: 0,
      uptime: 0,
      ssid: null,
      ssidPskError: false,
      ip: null,
      ssidsEnabled: [],
      ssidList: [],
    };
  },
  created() {
    this.getWawy();
  },
  beforeDestroy() {
    this.clearSsidSearch();
  },
  filters: {
    uptime: (uptime) => {
      const diff = moment().diff(moment(uptime * 1000));
      const oUptime = moment.utc(moment.duration(diff).asMilliseconds()).toObject();
      return `${(oUptime.date - 1)} days, ${oUptime.hours} hours, ${oUptime.minutes} mn`;
    },
  },
  methods: {
    authOk() {
      // need to reload page as Apollo should be initialize with JWT
      window.location.reload();
    },
    getWawy() {
      this.connecting = true;
      this.timeout = false;
      this.axios.get('/wawy')
        .then((response) => {
          const wawy = response.data;
          this.lastName = wawy.name;
          this.name = wawy.name;
          this.serial = wawy.serial;
          this.axios.get('/service/info')
            .then((infoResponse) => {
              const info = infoResponse.data;
              this.diskFree = info.disk.free;
              this.uptime = info.uptime;
            });
        })
        .catch(() => {
          this.connecting = false;
          this.timeout = true;
          clearInterval(this.pollingSsidList);
        });

      this.axios.get('/wifi/enabled')
        .then((ssidsEnabled) => {
          this.ssidsEnabled = ssidsEnabled.data.list.map(ssid => ssid.ssid);
        });

      this.getSsids();
      this.getConnectedSsid();
    },
    getSsids() {
      this.axios.get('/wifi')
        .then((response) => {
          const ssids = response.data;
          this.ssidList = ssids.list.map((ssid) => {
            let icon = 'signal_wifi_4_bar_lock';
            let leftColor = 'grey';
            if (this.ip && this.ssid === ssid.ssid) {
              icon = 'signal_wifi_4_bar';
              leftColor = 'green';
            } else if (this.ssidsEnabled.indexOf(ssid.ssid) > -1) {
              icon = 'signal_wifi_4_bar';
              leftColor = 'grey';
            }
            return {
              label: ssid.ssid,
              value: ssid.ssid,
              icon,
              leftColor,
            };
          });
        });
    },
    getConnectedSsid() {
      this.axios.get('/wifi/status')
        .then((activeSsid) => {
          if (activeSsid && activeSsid.data.ssid && activeSsid.data.ip_address) {
            this.$q.loading.hide();
            this.ssid = activeSsid.data.ssid;
            this.ip = activeSsid.data.ip_address;
            if (!this.$auth.check()) {
              this.openLogin = true;
            } else {
              this.updateOrRegisterCamera();
            }
          }
        });
    },
    startSsidSearch() {
      this.pollingSsidList = setInterval(() => {
        this.getSsids();
      }, 3000);
    },
    clearSsidSearch() {
      clearInterval(this.pollingSsidList);
    },
    setName() {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Change the camera name need camera reboot',
        ok: 'Agree',
        cancel: 'Disagree',
      }).then(() => {
        this.axios.post('/wawy/name', { name: this.name, lastName: this.lastName })
          .then((response) => {
            if (response.status === 201) {
              this.$q.loading.show({
                spinner: QSpinnerGears,
                message: 'Waiting while rebooting...',
                spinnerSize: 250,
                spinnerColor: 'white',
              });
              this.axios.post('/service/reboot').then((res) => {
                if (res.status === 201) {
                  const API_URL = `http://${this.name}.local`;
                  setInterval(() => {
                    this.axios.get(`${API_URL}:3001/service/serial`).then((serial) => {
                      if (serial.status === 200) {
                        this.$q.loading.hide();
                        window.location.href = API_URL;
                      }
                    });
                  }, 10000);
                }
              });
            }
          });
      }).catch(() => {
        this.name = this.lastName;
      });
    },
    setWifi() {
      this.clearSsidSearch();
      this.ssidPskError = false;
      this.$q.dialog({
        title: 'Password',
        message: `Please add password for ssid ${this.ssid}.`,
        prompt: {
          model: '',
        },
        cancel: true,
        color: 'secondary',
      }).then((psk) => {
        this.$q.loading.show({
          message: 'connecting...',
          spinnerSize: 25,
          spinnerColor: 'white',
        });
        this.axios.post('/wifi', { ssid: this.ssid, psk }).then(() => {
          this.getConnectedSsid();
        }).catch(() => {
          this.$q.loading.hide();
          this.ssidPskError = true;
        });
      });
    },
    updateOrRegisterCamera() {
      this.$apollo.mutate({
        mutation: UPDATE_OR_REGISTER_CAMERA,
        variables: {
          serial: this.serial,
          camera: {
            serial: this.serial,
            name: this.name,
            ip: this.ip,
          },
        },
      });
    },
  },
};
</script>
