<template>
  <div class="custom-select" :name="sid" :id="sid">
    <div @click="open = !open" class="select activeElement">
      <div>{{ currentElement.text }}</div>
    </div>
    <transition name="fade" mode="out-in">
      <div class="background" v-if="open" @click="open = false">
        <div class="list-wrapper">
          <h2>{{ t('installer.selecta') }} {{ title }}</h2>
          <div class="list">
            <div
              v-for="item in this.items"
              :key="item.id"
              @click="selectItem(item)"
            >
              <div class="select-itm-text">{{ item.text }}</div>
              <img
                v-if="item.imgSrc !== undefined"
                :src="item.imgSrc"
                :alt="item.imgAlt"
              />
              <div
                class="select-itm-desc"
                v-if="item.description !== undefined"
              >
                {{ item.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { useI18n } from 'vue-i18n'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    sid: String,
    items: Array,
    title: String
  },
  setup () {
    const { t } = useI18n({ inheritLocale: true, useScope: 'global' })
    return { t }
  },

  methods: {
    selectItem (item) {
      this.currentElement = item
      this.open = false
      this.$emit('updated', item)
    }
  },
  data () {
    return { open: false, currentElement: this.items[0] }
  }
})
</script>
<style>
.fade-enter-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-out;
}
.fade-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in;
}
.fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
.fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.select-itm-text {
  margin-bottom: 0.5em;
}
.select {
  border: solid var(--upsilon-1) 2pt;
  border-radius: 3px;
  background-color: var(--upsilon-2);
  color: var(--foreground);
  display: block;
  margin: 0.5em;
  font-size: 1em;
  padding: 0.5em;
  text-align: center;
  cursor: pointer;
  user-select: none;
}
.background {
  --padding: 2rem;
  z-index: 99999;
  position: fixed;
  top: 0;
  left: 0;
  height: calc(100vh - 2 * var(--padding));
  width: calc(100vw - 2 * var(--padding));
  background-color: var(--feature-bg-upsilon);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--padding);
}
.list-wrapper {
  max-height: calc(100vh - 2 * var(--padding));
  max-width: calc(100vw - 2 * var(--padding));
  max-width: 1500px;
  overflow-y: auto;
}

.list {
  background-color: var(--upsilon-2);
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.list > *:hover {
  cursor: pointer;
  background: var(--upsilon-1);
  color: var(--background);
}
.list > * {
  border-radius: 5px;
  margin: 0.5em;
  padding: 0.5em;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
