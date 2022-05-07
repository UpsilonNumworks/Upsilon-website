<template>
  <div class="question-n-answer">
    <h3 class="question">{{ t('faq.questions.' + question + '.question') }}</h3>
    <p v-html="t('faq.questions.' + question + '.answer')" class="answer"></p>
  </div>
  <br>
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
.question-n-answer {
  margin-left: 8px;
}
@media screen and (max-width: 720px) {
  h3 {
    font-size: 1.2em;
  }
}
@media screen and (min-width: 720px) {
  h3 {
    font-size: 1.5em;
  }
}
h3 {
  font-weight: bold;
}
</style>
