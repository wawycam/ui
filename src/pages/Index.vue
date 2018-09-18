<template>
  <q-page class="padding">
    <div class="row justify-center">
      <div class="camera col-md-4 col-sm-12">
        <img alt="WawyCam" :src="imageDevice">
      </div>
      <div class="info col-md-8 col-sm-12">
        <div class="row column">
          <Info />
        </div>
        <div class="tracks">
          <LatestTrack />
        </div>
      </div>
    </div>
    <q-window-resize-observable @resize="onResize" />
  </q-page>
</template>

<style scopped lang="stylus">
  .padding
    padding 30px 2rem 3rem 2rem;
  .padding-top
    padding-top 30px
  .margin-bottom
    margin-bottom 15px
  .tracks
      height calc(100vh - 400px)
      overflow-y auto;
  @media (max-width: 768px)
    .tracks
      height 100%
    .info
      padding-top 5px
  @media (max-width: 1200px)
    .camera
      img
        width 100%
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
  data() {
    return {
      imageDevice: 'statics/PiBoxFront.png',
    };
  },
  methods: {
    onResize(size) {
      if (size.width < 768) {
        this.imageDevice = 'statics/PiBoxFront90.png';
      } else {
        this.imageDevice = 'statics/PiBoxFront.png';
      }
    },
  },
};
</script>
