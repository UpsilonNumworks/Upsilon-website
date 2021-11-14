<template>
  <div id="installer">
    <h1>{{ t('installer.title') }}</h1>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'installer',
  setup () {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global'
    })
    return { t }
  }
})
</script>

<style scoped></style>
