<template>
  <div id="releases">
    <h1>{{ t("releases.name") }}</h1>
    <div class="release-table">
      <p>{{ t("releases.version") }} 1.0 ({{ t("releases.dev") }})</p>
      <table>
        <tbody>
          <tr>
            <td class="release-tag release-tag-new">{{ t("releases.new") }}</td>
            <td>{{ t("releases.versions.1-0.E16Security") }}</td>
          </tr>
          <tr>
            <td class="release-tag release-tag-new">{{ t("releases.new") }}</td>
            <td>{{ t("releases.versions.1-0.RecoveryMode") }}</td>
          </tr>
          <tr>
            <td class="release-tag release-tag-new">{{ t("releases.new") }}</td>
            <td>{{ t("releases.versions.1-0.Background") }}</td>
          </tr>
          <tr>
            <td class="release-tag release-tag-new">{{ t("releases.new") }}</td>
            <td>{{ t("releases.versions.1-0.Themes") }}</td>
          </tr>
          <tr>
            <td class="release-tag release-tag-new">{{ t("releases.new") }}</td>
            <td>{{ t("releases.versions.1-0.Ulab") }}</td>
          </tr>
          <tr>
            <td class="release-tag release-tag-new">{{ t("releases.new") }}</td>
            <td>{{ t("releases.versions.1-0.PythonSysModule") }}</td>
          </tr>
          <tr>
            <td class="release-tag release-tag-new">{{ t("releases.new") }}</td>
            <td>{{ t("releases.versions.1-0.PythonBattery") }}</td>
          </tr>
          <tr>
            <td class="release-tag release-tag-new">{{ t("releases.new") }}</td>
            <td>{{ t("releases.versions.1-0.PythonSettingsAutocomplete") }}</td>
          </tr>
          <tr>
            <td class="release-tag release-tag-change">{{ t("releases.change") }}</td>
            <td>{{ t("releases.versions.1-0.PythonBaseScripts") }}</td>
          </tr>
          <tr>
            <td class="release-tag release-tag-change">{{ t("releases.change") }}</td>
            <td>{{ t("releases.versions.1-0.StorageSize") }}</td>
          </tr>
          <tr>
            <td class="release-tag release-tag-change">{{ t("releases.change") }}</td>
            <td>{{ t("releases.versions.1-0.VariableLoadedPythonToolbox") }}</td>
          </tr>
          <tr>
            <td class="release-tag release-tag-change">{{ t("releases.change") }}</td>
            <td>{{ t("releases.versions.1-0.BatteryLogo") }}</td>
          </tr>
          <tr>
            <td class="release-tag release-tag-new">{{ t("releases.new") }}</td>
            <td>{{ t("releases.versions.1-0.BatteryPercentage") }}</td>
          </tr>
          <tr>
            <td class="release-tag release-tag-change">{{ t("releases.change") }}</td>
            <td>{{ t("releases.versions.1-0.EqualSymplification") }}</td>
          </tr>
          <tr>
            <td class="release-tag release-tag-new">{{ t("releases.new") }}</td>
            <td>{{ t("releases.versions.1-0.SecondDegreePolynominal") }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { useI18n } from 'vue-i18n'
export default {
  name: 'Releases',
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
.release-table {
  margin: 30px;
  background: var(--transparent-fg-1); /*#ffffff20*/
  border: solid var(--foreground-2) 2pt; /*lightgrey*/
  border-radius: 15px;
  padding: 15px;
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
  display: inline-block;
  color: #fff;
  border-radius: 6px;
  padding: 0 4px;
}
.release-tag-new {
  background: #307774
}
.release-tag-change {
  background: #cc6122
}
.release-tag-update {
  background: #dfa730;
}
</style>
