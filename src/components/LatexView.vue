<template>
  <div class="formula-display">
    <code>{{ typeof display != 'undefined' ? display : formula }}</code>
  </div>
  <div class="formula">
    <VueMathjax :formula="'$$' + formula + '$$'" />
  </div>
</template>
<script>
export default {
  props: {
    formula: String,
    display: String
  }
}
</script>
<style scoped>
.formula-display {
  display: flex;
  align-items: center;
}
code {
  display: block;
}
</style>
