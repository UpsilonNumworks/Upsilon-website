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
  background-size: cover;
  image-rendering: pixelated;
  padding: 3em;
  border-radius: 10px;
  margin: 1em;
  font-size: 1.2em;
}
#features-upsilon .feature {
  background-color: var(--feature-bg-upsilon);
}
#features-omega .feature {
  background-color: var(--feature-bg-omega);
}
.feature h2 {
  margin-top: 0;
}
</style>
