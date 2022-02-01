<template>
  <select :name="sid" :id="sid">
    <slot></slot>
  </select>
</template>
<script>
export default {
  props: {
    sid: String
  }
}
</script>
<style scoped>
select {
  border: solid var(--upsilon-1) 2pt;
  border-radius: 3px;
  background-color: var(--upsilon-2);
  color: var(--foreground);
  display: block;
  margin: 0.5em;
  font-size: 1em;
  padding: 0.5em;
  text-align: center;
}
</style>
