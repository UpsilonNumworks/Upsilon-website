<template>
  <div class="formula-display">
    <code>{{ typeof display != 'undefined' ? display : formula }}</code>
  </div>
  <div class="formula">
    <VueMathjax v-if="latex" :formula="'$$' + formula + '$$'" />
    <div v-else class="nonrendered-math">{{ output }}</div>
  </div>
</template>
<script>
export default {
  props: {
    formula: String,
    display: String,
    latex: Boolean,
    output: String
  }
}
</script>
<style>
.formula-display {
  display: flex;
  align-items: center;
}
code {
  display: block;
}
.nonrendered-math,
.MathJax_Display {
  margin: 0.7rem 0 !important;
}

.nonrendered-math {
  font-family: MathJax_Main, serif;
  font-size: 1.3em;
  text-align: center;
}
</style>
