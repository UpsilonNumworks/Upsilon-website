<template>
  <div class="feature">
    <h2>{{ title }}</h2>
    <div class="feature-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Feature',
  props: {
    title: String,
    content: String,
    image: String
  }
}
</script>

<style>
@media screen and (min-width: 500px) {
  .feature {
    margin: 15px;
    padding: 30px;
    border-radius: 15px;
  }
  .feature-content {
    font-size: 1.2em;
  }
}
@media screen and (max-width: 500px) {
  .feature {
    margin: 5px;
    padding: 10px;
    border-radius: 25px;
  }
  .feature-content {
    font-size: 1em;
  }
}

.feature {
  background: #00000030;
  transition: margin, padding, border-radius 0.1s;
}

.feature > h2 {
  font-size: 1.6em;
  margin: 5px;
  margin-top: 0;
}
</style>
