<template>
  <div class="locale-changer">
    <button :class="currentLocale" @click="toggleLocale">
      <span>
        {{ currentLocale.toUpperCase() }}
        </span>
    </button>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
export default {
  name: 'LocaleChanger',
  setup () {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global'
    })
    return { t }
  },
  data () {
    return { currentLocale: '' }
  },
  mounted () {
    try {
      this.currentLocale = this.$i18n.global.locale.value === 'fr' ? 'en' : 'fr'
    } catch {
      this.currentLocale = navigator.language === 'fr' ? 'en' : 'fr'
    }
  },
  methods: {
    toggleLocale () {
      this.$i18n.global.locale._setter(this.currentLocale)
      this.currentLocale =
        this.$i18n.global.locale.value === 'en' ? 'fr' : 'en'
    }
  }
}
</script>

<style scoped>
button {
  transition: background-image 0.2s;
  margin-right: 2em;
  display: block;
  padding: 0.4em;
  font-size:0.7em;
  background-size: cover;
  background-position: center center;
  border: none;
  border-radius: 5px;
  aspect-ratio: 4;
}
.fr {
  background-image:
    url("~@/assets/flag_fr.svg");
}
.en {
  background-image:
    url("~@/assets/flag_en.svg");
}
span{
  background: rgba(0, 0, 0, .7);
  color:white;
  border-radius:2px;
}
</style>
