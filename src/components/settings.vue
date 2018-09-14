<template>
  <div>
    <div class="row settings-padding">
      <div class="col-12">
        <h4>
          <q-icon name="settings" /> Settings
        </h4>
      </div>
      <div class="col-12">
        <div class="row">
          <div class="col-10">
            <q-input v-model="cameraForm.name" float-label="Camera Name" />
          </div>
          <div class="col-2">
            <q-btn color="primary"
                  @click="setName"
                  style="height: 50%; margin-top: 20px;">
              save
            </q-btn>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <q-select
              v-model="ssid"
              float-label="Select a wifi network"
              @focus="startSsidSearch"
              @blur="clearSsidSearch"
              @input="setWifi"
              :options="ssidList"
            />
          </div>
          <div class="col-6">
            <p v-if="searchingSsids" class="search">
              <q-spinner :size="15" /> searching wifi network...
            </p>
          </div>
        </div>
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
</template>

<style scopped lang="stylus">
  .settings-padding {
    padding 2rem
  }
  .search {
    padding-top 30px
    padding-left 20px
    margin 0
  }
</style>

<script>
import { QSpinnerGears } from 'quasar';

export default {
  name: 'Settings',
  props: ['camera', 'ip', 'ssid'],
  data() {
    return {
      cameraForm: Object.assign({}, this.camera),
      searchingSsids: false,
      ssidPskError: false,
      ssidsEnabled: [],
      ssidList: [],
    };
  },
  created() {
    this.axios.get('/wifi/enabled')
      .then((ssidsEnabled) => {
        this.ssidsEnabled = ssidsEnabled.data.list.map(ssid => ssid.ssid);
      });

    this.getSsids();
  },
  beforeDestroy() {
    this.clearSsidSearch();
  },
  methods: {
    setName() {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Change the camera name need camera reboot',
        ok: 'Agree',
        cancel: 'Disagree',
      }).then(() => {
        this.axios.post('/wawy/name', { name: this.cameraForm.name, lastName: this.camera.name })
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
        this.cameraForm.name = this.camera.name;
      });
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
    startSsidSearch() {
      this.getSsids();
      this.searchingSsids = true;
      this.pollingSsidList = setInterval(() => {
        this.getSsids();
      }, 3000);
    },
    clearSsidSearch() {
      this.searchingSsids = false;
      clearInterval(this.pollingSsidList);
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
  },
};
</script>
