<template>
  <div class="generic-page" id="notfound">
    <h1>{{ t('notFound.title') }}</h1>
    <h2>{{ t('notFound.underTitle') }}</h2>
    <router-link to="/">{{ t('notFound.goHome') }}</router-link>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
export default {
  name: 'Not Found',
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
#notfound {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
}
#notfound h1 {
  margin-bottom: 0;
  margin-top: 0;
}
</style>
