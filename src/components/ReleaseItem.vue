<template>
  <div class="release-item">
    <div :class="'release-tag release-tag-' + changeType">
      {{ changeType.toUpperCase() }}
    </div>
    <div><slot></slot></div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'ReleaseItem',
  props: {
    changeType: String
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
  margin-right:.5em;
}

.release-tag-new {
  background: var(--tag-new);
  outline: solid var(--tag-new-outline) 2pt;
}
.release-tag-chg {
  background: var(--tag-change);
  outline: solid var(--tag-change-outline) 2pt;
}
.release-tag-fix {
  background: var(--tag-fix);
  outline: solid var(--tag-fix-outline) 2pt;
}
.release-item{
    display:flex;
    align-items: center;
    margin:.5em;
}
</style>
