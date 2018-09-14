<template>
  <q-page class="padding">
    <div class="row">
      <div class="col-4">
        <img alt="WawyCam" src="~assets/PiBoxFront.png">
      </div>
      <div class="col-8">
        <div class="row column">
          <Info />
        </div>
        <div class="padding-top">
          <LatestTrack />
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scopped lang="stylus">
  .padding
    padding 30px 2rem 3rem 2rem;
  .padding-top
    padding-top 30px
  .margin-bottom
    margin-bottom 15px
  .camera
    position fixed
    left 0
</style>

<script>
import Info from 'components/info';
import LatestTrack from 'components/tracks';

export default {
  name: 'PageIndex',
  components: {
    Info,
    LatestTrack,
  },
  methods: {
  },
};
</script>
