<template>
  <div class="doc-wrapper">
    <div id="themes-doc" class="doc">
      <h2>{{ t('doc.themes.title') }}</h2>
      <p>
        {{ t('doc.themes.description') }}
      </p>
      <div id="themes-grid">
        <div class="theme" v-for="theme in themes" :key="theme">
          <div class="theme-title">
            {{ t('installer.themes.' + theme) }}
          </div>
          <img
            :src="'../themes/' + theme + '.webp'"
            :alt="t('installer.themes.' + theme)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
export default {
  name: '',
  setup () {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global'
    })
    return { t }
  },
  data () {
    return {
      themes: [
        'upsilon_light',
        'upsilon_dark',
        'epsilon_light',
        'epsilon_dark',
        'omega_light',
        'omega_dark',
        'arc_dark',
        'miami_vice',
        'omega_trans',
        'omega_blink',
        'omega_dracula',
        'omega_kawaii',
        'omega_shrek',
        'cursed_light',
        'omega_freenumworks',
        'ahegao'
      ]
    }
  }
}
</script>

<style scoped>
.theme-title {
  text-align: center;
  font-size: 1.1em;
  margin-bottom: 0.5em;
}
.theme {
  padding: 0.5em;
}
#themes-grid {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
h3,
h4 {
  text-align: center;
}
#themes-doc {
  max-width: 1500px;
  width: 100%;
}

.latex-table {
  margin-bottom: 30px;
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 0;

  background: var(--feature-bg-upsilon); /*#ffffff20*/
  padding: 15px;
  display: grid;
  grid-template-columns: auto auto;
  min-width: 12em;
  flex-grow: 1;
  break-inside: avoid;
}
.latex-table > p {
  margin-top: 0;
}
.latex-table-title {
  grid-column-start: 1;
  grid-column-end: 3;
}
.force-break {
  break-after: column;
}
</style>
