<template>
  <div class="doc-wrapper">
    <div class="doc">
      <h1>RPN</h1>
      <blockquote>
        <p>
          {{ t('doc.rpn.the') }}
          <em>{{ t('doc.rpn.rpn') }}</em> {{ t('doc.rpn.definition.p1') }}
        </p>
        <p>
          {{ t('doc.rpn.definition.p2') }}
        </p>
      </blockquote>
      <h2>{{ t('doc.rpn.h2') }}</h2>
      <p>
        {{ t('doc.rpn.introduction.p1') }}
      </p>
      <p>{{ t('doc.rpn.introduction.examples.examples') }}</p>
      {{ t('doc.rpn.introduction.examples.1.title') }}<br />
      <ol>
        <li>{{ t('doc.rpn.introduction.examples.1.li1') }}</li>
        <li>{{ t('doc.rpn.introduction.examples.1.li2') }}</li>
        <li>{{ t('doc.rpn.introduction.examples.1.li3') }}</li>
      </ol>
      <p>{{ t('doc.rpn.introduction.examples.2.title') }}</p>
      <ol>
        <li>{{ t('doc.rpn.introduction.examples.2.li1') }}</li>
        <li>{{ t('doc.rpn.introduction.examples.2.li2') }}</li>
        <li>{{ t('doc.rpn.introduction.examples.2.li3') }}</li>
        <li>{{ t('doc.rpn.introduction.examples.2.li4') }}</li>
        <li>{{ t('doc.rpn.introduction.examples.2.li5') }}</li>
      </ol>
      <p>
        {{ t('doc.rpn.introduction.p2') }}
      </p>
      <p>
        <em
          ><strong>{{ t('doc.rpn.note.title') }}</strong>
          {{ t('doc.rpn.note.content') }}</em
        >
      </p>
    </div>
  </div>
</template>
<script>
import { useI18n } from 'vue-i18n'
export default {
  name: 'RPN',
  setup () {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global'
    })
    return { t }
  }
}
</script>
<style>
p {
  font-size: 1.2em;
}
blockquote {
  font-family: 'EB Garamond', serif;
  background: var(--feature-bg-upsilon);
  padding: 20px;
  border-left: solid var(--foreground-2) 6pt;
  border-radius: 15px;
}
blockquote > p {
  margin: 0;
}
</style>
