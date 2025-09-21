<template>
  <a class="download-itm" :href="fullUrl">
    <div class="download-itm-name">{{ name }}</div>
    <div class="download-itm-ext">{{ ext }}</div>
  </a>
</template>

<script>
import { useI18n } from 'vue-i18n'
export default {
  name: 'DownloadItem',
  props: { name: String, url: String, ext: String },
  data () {
    return { fullUrl: '' }
  },
  setup () {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global'
    })

    return { t }
  },
  mounted () {
    this.update()
  },
  watch: {
    url () {
      this.update()
    }
  },
  methods: {
    update () {
      this.fullUrl = 'https://yaya-cout.github.io/Upsilon-binfiles/binaries/' + this.url
    }
  }
}
</script>

<style scoped>
.download-itm {
  padding: 0.5em;
  border: solid var(--upsilon-1) 1pt;
  background: var(--upsilon-2);
  border-radius: 5px;
  min-width: 250px;
  margin: 0.5em;
  color: var(--foreground);
  font-weight: normal;
  cursor: pointer;
  flex: 1;
  display: flex;
  justify-content: space-between;
  text-decoration: none;
}
.download-itm-ext {
  font-family: monospace;
  opacity: 0.8;
}
</style>
