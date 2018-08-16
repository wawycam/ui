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
            <h2>{{ name }}</h2>
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
          </div>
        </div>
      </div>
    </div>
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

export default {
  name: 'PageIndex',
  data() {
    return {
      connecting: true,
      timeout: false,
      oldName: '',
      name: null,
      serial: '',
      diskFree: 0,
      uptime: 0,
      ssid: null,
      ip: '-',
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
            if (this.ssid === ssid.ssid) {
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
            this.ssid = activeSsid.data.ssid;
            this.ip = activeSsid.data.ip_address;
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
                  setInterval(() => {
                    this.axios.get('/service/serial').then((serial) => {
                      if (serial.status === 200) {
                        this.$q.loading.hide();
                        window.location.href = `http://${this.name}.local`;
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
    setWifi(ssid) {
      this.clearSsidSearch();
      this.$q.dialog({
        title: 'Password',
        message: `Please add password for ssid ${ssid}.`,
        prompt: {
          model: '',
        },
        cancel: true,
        color: 'secondary',
      }).then((psk) => {
        this.axios.post('/wifi', { ssid, psk });
      });
    },
  },
};
</script>
