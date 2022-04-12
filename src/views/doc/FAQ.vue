<template>
  <div>
    <div class="doc-wrapper">
      <div class="doc">
        <h1>{{ t('faq.name') }}</h1>
        <h2>{{ t('faq.sections.canInstall') }}</h2>
        <FAQquestion question="supportedBrowsers" />
        <FAQquestion question="supportedModels" />
        <FAQquestion question="numLocked" />
        <h2>{{ t('faq.sections.how2') }}</h2>
        <FAQquestion question="how2backup" />
        <FAQquestion question="how2external" />
        <FAQquestion question="how2reader" />
        <FAQquestion question="how2py" />
        <FAQquestion question="how2themes" />
        <FAQquestion question="how2contribute" />
        <FAQquestion question="how2createReaderFile" />
        <FAQquestion question="how2testReaderOnline" />
        <FAQquestion question="how2recovery" />
        <FAQquestion question="canRollback" />
        <FAQquestion question="cheatsheet" />
        <hr>
        <FAQquestion question="stillCouldntFind" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import FAQquestion from '@/components/FAQquestion'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'FAQ',
  components: { FAQquestion },
  setup () {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'local'
    })
    return { t }
  }
})
</script>

<style scoped></style>
