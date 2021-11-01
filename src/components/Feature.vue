<template>
  <div>
    <h2>{{ title }}</h2>
    <div class="feature-content">{{ content }}</div>
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

<style></style>
