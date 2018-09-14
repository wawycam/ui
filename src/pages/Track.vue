<template>
  <div class="main-card row">
    <div class="justify-center col-xs-12 col-md-6">
      <q-card v-for="(media, index) in TrackMediaOnly"
              v-on:mouseover.native="highlightMarker(index)"
              v-on:mouseout.native="unHighlightMarker(index)"
              :key="media._id"
              inline
              class="q-ma-sm">
        <q-card-media>
          <img :src="media.media.file | path">
        </q-card-media>
        <q-card-title>
          <span class="filename">{{ media.media.file | noPng }}</span>
          <div class="info row justify-between items-center">
            <div>
              <q-icon name="place" />
              {{ media.location.coordinates[0] | toFixed }},
              {{ media.location.coordinates[1] | toFixed }}
            </div>
            <div>
              <q-icon name="show_chart" />
              {{ media.altitude | toFixed }} m.
            </div>
            <div>
              <q-icon name="schedule" />
              {{ media.createdAt | dateHour }}
            </div>
          </div>
        </q-card-title>
      </q-card>
    </div>
    <div class="map-container col-xs-12 col-md-6">
      <GmapMap
        class="map"
        ref="gmap"
        :center="mapCenterCoord"
        :zoom="16"
        map-type-id="terrain"
      >
        <GmapMarker
          v-for="(marker, index) in MediaMarkers"
          :key="index"
          :icon="marker.icon"
          :position="{
            lat: marker.lat,
            lng: marker.lon,
          }"
          :clickable="true"
          :draggable="false"
        />
      </GmapMap>
    </div>
  </div>
</template>

<script>
/* global google */
import _ from 'lodash';
import moment from 'moment';
import MAP_ICONS from '../constants/mapIcons';

export default {
  name: 'Track',
  data() {
    return {
      mapCenterCoord: {
        lat: 48.8624521,
        lng: 2.4396758999999997,
      },
      trackId: this.$route.params.id,
      Tracks: JSON.parse(this.$localStorage.get('tracks')),
      TrackMediaOnly: [],
      MediaMarkers: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.gmap.$mapPromise.then(() => {
        const Track = _.find(this.Tracks, track => track._id === this.trackId);
        const mediaTrack = _.filter(Track.geoData, geoData =>
          geoData.media && geoData.media.file);
        this.TrackMediaOnly = mediaTrack;
        const bounds = new google.maps.LatLngBounds();
        _.each(this.TrackMediaOnly, (media) => {
          bounds.extend({
            lat: media.location.coordinates[0],
            lng: media.location.coordinates[1],
          });
          this.MediaMarkers.push({
            lat: media.location.coordinates[0],
            lon: media.location.coordinates[1],
            icon: MAP_ICONS[media.media.type],
          });
          this.$refs.gmap.$mapPromise.then(() => {
            this.$refs.gmap.$mapObject.fitBounds(bounds);
          });
        });
      });
    });
  },
  filters: {
    path: (file) => {
      let thumb = file.split('.');
      thumb = `${thumb[0]}_480.${thumb[1]}`;
      const URL = (process.env.API_URL) ? process.env.API_URL.replace(/:3001/, '') : './';
      return `${URL}/photos/${thumb}`;
    },
    noPng: (file) => {
      const thumb = file.split('.');
      return thumb[0];
    },
    dateHour: (date) => {
      if (date) {
        return moment(date).format('HH[h]mm');
      }
      return '-';
    },
    toFixed: (number) => {
      if (number) {
        return number.toFixed(3);
      }
      return '-';
    },
    toKph: (number) => {
      if (number) {
        return Math.round((number * 1.609344));
      }
      return '-';
    },
  },
  methods: {
    highlightMarker(index) {
      this.$refs.gmap.$mapObject.setCenter(new google.maps.LatLng(
        this.MediaMarkers[index].lat,
        this.MediaMarkers[index].lon,
      ));
      this.MediaMarkers[index].icon = MAP_ICONS.imageBig;
    },
    unHighlightMarker(index) {
      this.MediaMarkers[index].icon = MAP_ICONS.image;
    },
  },
};
</script>

<style scopped lang="stylus">
  @import '~variables'
  .no-wk-margin
    -webkit-margin-before: 0
    -webkit-margin-after: 0
  .main-card
    border-radius 2px
  .map-container
    position fixed
    right 0
    bottom 0
    .map
      // margin-top 60px
      height calc(100vh - 60px)
  .q-card
    color #000 !important
    width: 47%;
    .filename
      font-size: 12px;
      color: grey;
    .info
      font-size: 12px;
    .q-card-container
      padding 5px
    .picto
      font-size 48px
    .mention
      h4
        padding-top 10px
        padding-left 10px
        -webkit-margin-before 0
        -webkit-margin-after 0
      p
        margin-bottom 0
  .bg-neutral
      background-color $neutral
  @media (max-width: 575px)
    .q-card
      width: 97%;
    .map-container
      padding 0
      .map
        height 250px
        -webkit-box-shadow 0px -5px 25px -5px rgba(0,0,0,0.5)
        -moz-box-shadow 0px -5px 25px -5px rgba(0,0,0,0.5)
        box-shadow 0px -5px 25px -5px rgba(0,0,0,0.5)
</style>
