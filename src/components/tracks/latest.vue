<template>
  <div>
    <div class="col">
      <h4 class="padding-top margin-bottom"><q-icon name="gps_fixed" /> Tracks</h4>
    </div>
    <div class="col">
      <q-list>
        <q-item multiline>
          <q-item-side :avatar="latestTrack.thumb|path" />
          <q-item-main>
            <q-item-tile label>{{ latestTrack.name }}</q-item-tile>
            <q-item-tile sublabel lines="3">
              {{ latestTrack.geoposition }} geopositions | {{ latestTrack.media }} media
              <br/><br/><a href="">view more</a> | <a href="">download</a>
            </q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile stamp>{{ latestTrack.date | fromNow }}</q-item-tile>
          </q-item-side>
        </q-item>
      </q-list>
    </div>
  </div>
  </template>

<script>
import moment from 'moment';

export default {
  name: 'latest',
  props: ['latestTrack'],
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
};
</script>
