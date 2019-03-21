<template>
    <div class="loader__wrapper">
        <div class="loader">Loading...</div>
    </div>
</template>

<script>
</script>
<style style="scss">
.loader__wrapper {
  height: 5em;
  overflow: hidden;
}
.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 10px auto;
  font-size: 5px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(82,202,228, 0.2);
  border-right: 1.1em solid rgba(82,202,228, 0.2);
  border-bottom: 1.1em solid rgba(82,202,228, 0.2);
  border-left: 1.1em solid $ma-primary;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
