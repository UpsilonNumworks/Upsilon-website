<template>
  <div class="downloads-page-wrapper">
    <div class="downloads-page">
      <h2>{{ t("downloads.installNow") }}</h2>
      <router-link to="/install/">{{
        t("downloads.onlineInstaller")
      }}</router-link>
      <h2>{{ t("downloads.download") }}</h2>
      <div class="downloads">
        <div class="download-section">
          <h3>{{ t("simulator.name") }}</h3>
          <div class="download-list">
            <DownloadItem
              url="beta/simulator/epsilon.exe"
              ext=".exe"
              name="Windows"
            />
            <DownloadItem
              url="beta/simulator/epsilon.bin"
              ext=".bin"
              name="Linux"
            />
            <DownloadItem
              url="beta/simulator/epsilon.apk"
              ext=".apk"
              name="Android"
            />
            <DownloadItem
              url="beta/simulator/epsilon.js"
              ext=".zip"
              name="Web"
            />
            <!--TODO upload zip-->
          </div>
        </div>
        <div class="download-section">
          <h3>Binpacks</h3>
          <div class="download-list">
            <CustomSelect
              style="flex: 1"
              name="select-lang"
              sid="select-lang"
              @updated="setLang"
              :title="t('installer.lang')"
              :items="
                languages.map((lang) => {
                  return { text: t('installer.languages.' + lang), id: lang };
                })
              "
            >
            </CustomSelect>
            <CustomSelect
              style="flex: 1"
              name="select-theme"
              sid="select-theme"
              @updated="setTheme"
              :title="t('installer.theme')"
              :items="
                themes.map((theme) => {
                  return {
                    text: t('installer.themes.' + theme),
                    imgSrc: './themes/' + theme + '.webp',
                    id: theme,
                  };
                })
              "
            >
            </CustomSelect>
          </div>
          <div class="download-list">
            <DownloadItem
              :url="'beta/n100/epsilon.onboarding.'+ theme+'.'+ lang + '.internal.bin'"
              ext=".bin"
              name="N100"
            />
            <DownloadItem
              :url="'beta/n110/binpack.'+theme+'.tgz'"
              ext=".tgz"
              name="N110"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DownloadItem from './DownloadItem'
import CustomSelect from './CustomSelect'
import { useI18n } from 'vue-i18n'
export default {
  name: 'DownloadsPage',
  components: { DownloadItem, CustomSelect },
  data () {
    return {
      lang: 'en',
      theme: 'upsilon_light',
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
      ],
      languages: ['en', 'fr', 'nl', 'pt', 'it', 'de', 'es', 'hu']
    }
  },
  methods: {
    setTheme (item) {
      this.theme = item.id
    },

    setLang (item) {
      this.lang = item.id
    }
  },
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
.light .downloads-page-wrapper {
  background-image: url("~@/assets/Calculators_upsilon_light.webp");
  background-size: cover;
}
.dark .downloads-page-wrapper {
  background-image: url("~@/assets/Calculators_upsilon_dark.webp");
  background-size: cover;
}
.downloads {
  display: flex;
  flex-wrap: wrap;
}
.downloads-page {
  width: 100%;
  max-width: 1500px;
  border-radius: 10px;
  background-color: var(--feature-bg-upsilon);
}
.download-section {
  flex: 1;
  margin: 0.5em;
  background-color: var(--feature-bg-upsilon);
  border-radius: 10px;
  padding: 0.5em;
}
.download-list {
  padding: 0.5em;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
}
.downloads-page-wrapper {
  display: flex;
  justify-content: center;
}
@media screen and (min-width: 720px) {
  .downloads-page {
    padding: 3em;
    margin: 1em;
    font-size: 1.2em;
  }
}
@media screen and (max-width: 720px) {
  .downloads-page {
    padding: 1em;
    margin: 0.5em;
    font-size: 1.1em;
  }
}
h3 {
  margin: 0.5em;
}
</style>
