<template>
  <div class="feature-container">
    <div  data-aos="fade-up" :data-aos-delay="column * 50" class="feature">
      <h2>{{ title }}</h2>
      <div class="feature-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeatureCard',
  props: {
    title: String,
    content: String,
    image: Image,
    column: Number
  }
}
</script>

<style scoped>
.feature {
  background-size: cover;
  image-rendering: pixelated;
  border-radius: 10px;
  margin: 1em;
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
@media screen and (min-width: 720px) {
  .feature {
    padding: 3em;
    margin: 1em;
    font-size: 1.2em;
  }
}
@media screen and (max-width: 720px) {
  .feature {
    padding: 1em;
    margin: 0.5em;
    font-size: 1.1em;
  }
}
</style>
