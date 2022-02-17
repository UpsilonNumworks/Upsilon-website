<template>
  <div>
    <iframe title="Upsilon Simulator" src="./simulator/simulator.html">
      Browser not supported
    </iframe>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
export default {
  name: '',
  setup () {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'local'
    })
    return { t }
  }
}
</script>

<style scoped>
iframe {
  width: 100%;
  height: 100vh;
  border: none;
}
</style>
