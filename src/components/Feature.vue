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

<style scoped>
.feature {
  background-size: cover;
  image-rendering: pixelated;
  border-radius: 10px;
  margin: 1em;
  animation-name: appear-from-bottom;
  animation-delay: 0.1s;
  animation-duration: 0.3s;
}
@keyframes appear-from-bottom {
  0% {
    transform: translateY(50px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
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
