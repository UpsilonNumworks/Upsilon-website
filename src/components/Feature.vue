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
.feature {
  background: #00000030;
  margin: 15px;
  border-radius: 15px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 30px;
}
</style>
