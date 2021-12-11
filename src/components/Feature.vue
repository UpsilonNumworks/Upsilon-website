<template>
  <div class="feature-container">
    <div class="feature">
      <h2>{{ title }}</h2>
      <div class="feature-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Feature',
  props: {
    title: String,
    content: String,
    image: Image
  }
}
</script>

<style>
.feature {
  backdrop-filter: blur(20px);
  background: var(--transparent-bg-3) url('~@/assets/noise.webp');
  background-size: cover;
  image-rendering: pixelated;
  padding: 3em;
  border-radius: 50px;
  margin: 1em;
  font-size: 1.2em;
}
.feature h2 {
  margin-top: 0;
}
</style>
