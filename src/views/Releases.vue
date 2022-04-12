<template>
  <div id="releases">
    <div class="releases-table-wrapper">
      <h1>{{ t('releases.name') }}</h1>
      <div class="generic-page release-table">
        <p>{{ t('releases.version') }} 1.0 ({{ t('releases.dev') }})</p>
        <div class="grid">
          <ReleaseItem>{{ t('releases.versions.1-0.latex') }}</ReleaseItem>
          <ReleaseItem>{{ t('releases.versions.1-0.E16Security') }}</ReleaseItem>
          <ReleaseItem>{{ t('releases.versions.1-0.RecoveryMode') }}</ReleaseItem>
          <ReleaseItem>{{ t('releases.versions.1-0.Background') }}</ReleaseItem>
          <ReleaseItem>{{ t('releases.versions.1-0.Themes') }}</ReleaseItem>
          <ReleaseItem>{{ t('releases.versions.1-0.Ulab') }}</ReleaseItem>
          <ReleaseItem>{{ t('releases.versions.1-0.PythonBattery') }}</ReleaseItem>
          <ReleaseItem>{{ t('releases.versions.1-0.PythonSettingsAutocomplete') }}</ReleaseItem>
          <ReleaseItem>{{ t('releases.versions.1-0.KandinskyEnhancements') }}</ReleaseItem>
          <ReleaseItem>{{ t('releases.versions.1-0.Reader') }}</ReleaseItem>
          <ReleaseItem chg>{{ t('releases.versions.1-0.PythonBaseScripts') }}</ReleaseItem>
          <ReleaseItem chg>{{ t('releases.versions.1-0.StorageSize') }}</ReleaseItem>
          <ReleaseItem chg>
            {{ t('releases.versions.1-0.VariableLoadedPythonToolbox') }}
          </ReleaseItem>
          <ReleaseItem chg>{{ t('releases.versions.1-0.BatteryLogo') }}</ReleaseItem>
          <ReleaseItem>{{ t('releases.versions.1-0.BatteryPercentage') }}</ReleaseItem>
          <ReleaseItem chg>{{ t('releases.versions.1-0.EqualSymplification') }}</ReleaseItem>
          <ReleaseItem>{{ t('releases.versions.1-0.SecondDegreePolynominal') }}</ReleaseItem>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useI18n } from 'vue-i18n'
import ReleaseItem from '@/components/ReleaseItem.vue'
export default {
  name: 'ReleasesPage',
  components: {
    ReleaseItem
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

#releases {
  display: flex;
  justify-content: center;
}
.releases-table-wrapper {
  max-width: 1000px;
  flex: 1;
}
</style>
