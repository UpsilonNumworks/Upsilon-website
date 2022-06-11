<template>
  <div class="switch">
    <label :for="sid">{{ label }}</label>
    <input
      @change="passEvent"
      type="checkbox"
      :name="sid"
      :id="sid"
      :checked="checked"
    />
    <label :class="(border ? 'border ' : '') + 'slider'" :for="sid"></label>
  </div>
</template>

<script>
export default {
  name: 'CustomSwitch',
  props: {
    label: String,
    sid: String,
    border: Boolean,
    checked: Boolean
  },
  methods: {
    passEvent () {
      this.$emit('switched', document.getElementById(this.sid).checked)
    }
  }
}
</script>
<style scoped>
.border {
  outline: solid var(--upsilon-1) 2pt;
}
.switch {
  display: flex !important;
  align-items: center;
  justify-content: center;
  --switch-height: 1em;
  --switch-width: 2em;
  --button-scale: 0.9;
}
input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: var(--upsilon-2);
  transition: 0.2s;
  height: var(--switch-height);
  width: var(--switch-width);
}

.slider:before {
  background-color: var(--foreground);
  content: '';
  height: var(--switch-height);
  width: var(--switch-height);
  left: 4px;
  bottom: 4px;
  transition: 0.2s;
  display: block;
  transform: scale(var(--button-scale));
}

input:checked + .slider:before {
  transform: translateX(calc(var(--switch-width) - var(--switch-height)))
    scale(var(--button-scale));
}

/* Rounded sliders */
.slider {
  border-radius: 34px;
}

.slider:before {
  border-radius: 50%;
}
label {
  user-select: none;
}
</style>
