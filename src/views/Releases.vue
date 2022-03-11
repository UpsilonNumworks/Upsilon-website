<template>
  <div id="releases">
    <div class="releases-table-wrapper">
      <h1>{{ t('releases.name') }}</h1>
      <div class="generic-page release-table">
        <p>{{ t('releases.version') }} 1.0 ({{ t('releases.dev') }})</p>
        <div class="grid">
          <!--TODO clean this up-->
          <div class="release-tag release-tag-new">{{ t('releases.new') }}</div>
          <div>{{ t('releases.versions.1-0.latex') }}</div>

          <div class="release-tag release-tag-new">{{ t('releases.new') }}</div>
          <div>{{ t('releases.versions.1-0.E16Security') }}</div>

          <div class="release-tag release-tag-new">{{ t('releases.new') }}</div>
          <div>{{ t('releases.versions.1-0.RecoveryMode') }}</div>

          <div class="release-tag release-tag-new">{{ t('releases.new') }}</div>
          <div>{{ t('releases.versions.1-0.Background') }}</div>

          <div class="release-tag release-tag-new">{{ t('releases.new') }}</div>
          <div>{{ t('releases.versions.1-0.Themes') }}</div>

          <div class="release-tag release-tag-new">{{ t('releases.new') }}</div>
          <div>{{ t('releases.versions.1-0.Ulab') }}</div>

          <div class="release-tag release-tag-new">{{ t('releases.new') }}</div>
          <div>{{ t('releases.versions.1-0.PythonBattery') }}</div>

          <div class="release-tag release-tag-new">{{ t('releases.new') }}</div>
          <div>{{ t('releases.versions.1-0.PythonSettingsAutocomplete') }}</div>

          <div class="release-tag release-tag-new">{{ t('releases.new') }}</div>
          <div>{{ t('releases.versions.1-0.KandinskyEnhancements') }}</div>

          <div class="release-tag release-tag-new">{{ t('releases.new') }}</div>
          <div>{{ t('releases.versions.1-0.Reader') }}</div>

          <div class="release-tag release-tag-change">
            {{ t('releases.change') }}
          </div>
          <div>{{ t('releases.versions.1-0.PythonBaseScripts') }}</div>

          <div class="release-tag release-tag-change">
            {{ t('releases.change') }}
          </div>
          <div>{{ t('releases.versions.1-0.StorageSize') }}</div>

          <div class="release-tag release-tag-change">
            {{ t('releases.change') }}
          </div>
          <div>
            {{ t('releases.versions.1-0.VariableLoadedPythonToolbox') }}
          </div>

          <div class="release-tag release-tag-change">
            {{ t('releases.change') }}
          </div>
          <div>{{ t('releases.versions.1-0.BatteryLogo') }}</div>

          <div class="release-tag release-tag-new">{{ t('releases.new') }}</div>
          <div>{{ t('releases.versions.1-0.BatteryPercentage') }}</div>

          <div class="release-tag release-tag-change">
            {{ t('releases.change') }}
          </div>
          <div>{{ t('releases.versions.1-0.EqualSymplification') }}</div>

          <div class="release-tag release-tag-new">{{ t('releases.new') }}</div>
          <div>{{ t('releases.versions.1-0.SecondDegreePolynominal') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useI18n } from 'vue-i18n'
export default {
  name: 'ReleasesPage',
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
.grid {
  display: grid;
  grid-template-columns: max-content auto;
}
.grid > * {
  margin: 5px;
}
.release-table {
  margin-top: 30px;
  padding: 2em;
}
.release-table > p {
  margin-top: 0;
}
.release-tag {
  width: 40px;
  text-align: center;
  font-size: 14px;
  line-height: 26px;
  font-weight: 600;
  color: var(--foreground);
  border-radius: 6px;
  padding: 0 4px;
  user-select: none;
  outline-offset: -2pt;
  display: flex;
  justify-content: center;
  align-items: center;
}

.release-tag-new {
  background: var(--tag-new);
  outline: solid var(--tag-new-outline) 2pt;
}
.release-tag-change {
  background: var(--tag-change);
  outline: solid var(--tag-change-outline) 2pt;
}
.release-tag-update {
  background: var(--tag-update);
}
#releases {
  display: flex;
  justify-content: center;
}
.releases-table-wrapper {
  max-width: 1000px;
  flex: 1;
}
</style>
