<template>
  <label :for="sid">{{ label }}</label>
  <input @change="passEvent" type="checkbox" :name="sid" :id="sid" checked />
</template>
<script>
export default {
  props: {
    label: String,
    sid: String
  },
  methods: {
    passEvent () {
      this.$emit('switched', document.getElementById(this.sid).checked)
    }
  }
}
</script>
