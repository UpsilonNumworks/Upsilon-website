<template>
  <div>
    <iframe
      title="Upsilon Simulator"
      :src="
        ($window.location.href.endsWith('/') ? './' : './simulator/') +
        'simulator.html'
      "
    >
      Browser not supported
    </iframe>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
export default {
  name: 'SimulatorPage',
  setup () {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'local'
    })
    return { t }
  },
  mounted () {
    console.log(this)
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
