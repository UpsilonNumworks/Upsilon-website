<template>
  <div>
    <h1>{{ t('simulator.commingSoon') }}</h1>
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

<style scoped></style>
