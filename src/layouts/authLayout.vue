<template>
  <div class="row auth-layout">
    <div class="col-xs-12 col-sm-6">
      <router-view></router-view>
    </div>
    <div class="col-xs-12 col-sm-6 cover">
      <div>
        <p>Wawy</p>
      </div>
    </div>
  </div>
</template>

<style scopped lang="stylus">
@import '~variables'
.auth-layout
  min-height: 100%;
  .cover
    color: $neutral;
    font-size: 5rem;
    background-color: $primary;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
    p
      -webkit-margin-before: 0;
      -webkit-margin-after: 0;
    small
      font-size: 50%;
      display block

@media (max-width: 575px)
  .auth-layout
    .cover
      position: absolute;
      height: 60px;
      font-size: 30px;
      small
        display none !important;
</style>
