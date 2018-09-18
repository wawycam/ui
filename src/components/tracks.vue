<template>
  <div v-if="mediaTracks">
    <div>
      <q-list no-border inset-separator>
        <q-item v-for="(track, index) in mediaTracks" :key="index" multiline>
          <q-item-side :avatar="track.thumb | path" />
          <q-item-main>
            <q-item-tile label>{{ track.name }}</q-item-tile>
            <q-item-tile sublabel lines="3">
              {{ track.geoposition }} geopositions | {{ track.media }} media
              <br/><br/>
              <router-link :to="`/track/${track.id}`">details</router-link> |
              <a href="">download</a>
            </q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile stamp>{{ track.date | fromNow }}</q-item-tile>
          </q-item-side>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<style scopped lang="stylus">
  .q-item
    padding 8px 8px
</style>

<script>
import moment from 'moment';
import _ from 'lodash';

export default {
  name: 'latest',
  data() {
    return {
      latestTrack: null,
      tracks: JSON.parse(this.$localStorage.get('tracks')),
      mediaTracks: null,
    };
  },
  filters: {
    path: (file) => {
      let thumb = file.split('.');
      thumb = `${thumb[0]}_480.${thumb[1]}`;
      const URL = (process.env.API_URL) ? process.env.API_URL.replace(/:3001/, '') : './';
      return `${URL}/photos/${thumb}`;
    },
    fromNow: (date) => {
      if (date) {
        return moment(date).fromNow();
      }
      return '';
    },
  },
  created() {
    this.getTracks();
  },
  methods: {
    getTracks() {
      const mediaTracks = [];
      if (this.tracks && this.tracks.length > 0) {
        _.each(this.tracks, (track) => {
          const mediaTrack = _.filter(track.geoData, geoData =>
            geoData.media && geoData.media.file);
          if (mediaTrack.length > 0) {
            mediaTracks.push({
              id: track._id,
              name: track.name,
              date: track.updatedAt,
              geoposition: track.geoData.length,
              media: mediaTrack.length,
              thumb: mediaTrack[0].media.file,
            });
          }
        });
        this.mediaTracks = mediaTracks.reverse();
      }
    },
    getLatestTrack(tracks) {
      let latestTrack = {};
      if (tracks && tracks.length > 0) {
        latestTrack = tracks[tracks.length - 1];
        const mediaTrack = _.filter(latestTrack.geoData, geoData =>
          geoData.media && geoData.media.file);
        this.latestTrack = {
          id: latestTrack._id,
          name: latestTrack.name,
          date: latestTrack.updatedAt,
          geoposition: latestTrack.geoData.length,
          media: mediaTrack.length,
          thumb: mediaTrack[0].media.file,
        };
      }
    },
  },
};
</script>
