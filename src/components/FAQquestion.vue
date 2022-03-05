<template>
  <div class="question-n-answer">
    <h3 class="question">{{ t('faq.questions.' + question + '.question') }}</h3>
    <p v-html="t('faq.questions.' + question + '.answer')" class="answer"></p>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
export default {
  name: 'FAQquestion',
  props: { question: String },
  setup () {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global'
    })
    return { t }
  }
}
</script>

<style scoped>
h3 {
  font-size: 1.5em;
  font-weight: bold;
}
</style>
