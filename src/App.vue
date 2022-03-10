<template>
  <transition name="hamburger-menu" mode="in-out">
    <div @click="hbmenuOpen = false" v-if="hbmenuOpen" id="hamburger-menu">
      <div id="nav-btn-wrapper">
        <button class="nav-btn"></button>
      </div>
      <router-link to="/">{{ t('home.name') }}</router-link>
      <router-link to="/install">{{ t('installer.name') }}</router-link>
      <router-link to="/releases">{{ t('releases.name') }}</router-link>
      <router-link to="/simulator">{{ t('simulator.name') }}</router-link>
      <router-link to="/doc/faq">{{ t('faq.name') }}</router-link>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/UpsilonNumworks/Upsilon"
        >{{ t('github.name') }}</a
      >
      <div class="darkmode-switch">
        <Switch
          :label="t('darkmode')"
          :checked="true"
          :border="true"
          sid="theme-switch"
          @switched="switchTheme"
        />
      </div>
    </div>
  </transition>
  <div class="closed" id="nav">
    <router-link id="link-mobile-upsilon" to="/">Upsilon</router-link>
    <button @click="hbmenuOpen = true" class="nav-btn"></button>
    <router-link to="/">{{ t('home.name') }}</router-link>
    <router-link to="/install">{{ t('installer.name') }}</router-link>
    <router-link to="/releases">{{ t('releases.name') }}</router-link>
    <router-link to="/simulator">{{ t('simulator.name') }}</router-link>
    <router-link to="/doc/faq">{{ t('faq.name') }}</router-link>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://github.com/UpsilonNumworks/Upsilon"
      >{{ t('github.name') }}</a
    >
    <div class="right">
      <div class="darkmode-switch">
        <Switch
          :label="t('darkmode')"
          :checked="true"
          sid="theme-switch"
          @switched="switchTheme"
        />
      </div>
    </div>
  </div>
  <router-view v-slot="{ Component }">
    <transition name="route" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Switch from '@/components/Switch.vue'
export default defineComponent({
  name: '',
  setup () {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global'
    })
    return { t }
  },
  data () {
    return { hbmenuOpen: false }
  },
  components: {
    Switch
  },
  methods: {
    switchTheme (checked) {
      const theme = checked ? 'dark' : 'light'
      document.body.classList = [theme]
    },
    toggleNavbar () {
      document.getElementById('nav').classList.toggle('open')
      document.getElementById('nav').classList.toggle('closed')
    }
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital@0;1&display=swap');
* {
  transition: background, background-color 0.2s;
}
::-webkit-scrollbar {
  width: 10px;
  background: #00000000;
}
::-webkit-scrollbar-track {
  background: var(--upsilon-2-transparent);
}
::-webkit-scrollbar-thumb {
  background: var(--upsilon-1);
  border-radius: 5pt;
}

.light {
  --upsilon-1: #accef8;
  --upsilon-2: white;
  --upsilon-2-transparent: #ffffff50;
  --foreground: black;
  --transparent-fg-1: #00000005;
  --transparent-fg-2: #00000020;
  --transparent-bg-3: #00000030;
  --foreground-2: #303030;
  --complementary: #3265a3;
  --feature-bg-upsilon: #accef8a0;
  --feature-bg-omega: #ffd9d9a0;
  --error-bg: #ff7d7d85;
  --error-text: darkred;

  --tag-new: #b1fdde;
  --tag-new-outline: #307774;
  --tag-change: #ffcdb0;
  --tag-change-outline: #cc6122;
  --tag-update: #ffe7b3;
  --tag-update-outline: #dfa730;
}
.dark {
  --upsilon-1: #7ea2ce;
  --upsilon-2: #0c1624;
  --upsilon-2-transparent: #0c162470;
  --foreground: #ffffff;
  --transparent-fg-1: #ffffff10;
  --transparent-fg-2: #ffffff20;
  --transparent-bg-3: #00000030;
  --foreground-2: lightgrey;
  --complementary: #7ecc70;
  --feature-bg-upsilon: #0c1624b0;
  --feature-bg-omega: #000000b0;
  --error-bg: #8b000085;
  --error-text: pink;

  --tag-new: #307774;
  --tag-change: #cc6122;
  --tag-update: #dfa730;
}
#hamburger-menu {
  position: fixed;
  top: 0;
  left: 0;
  display: block;

  width: 100vw;
  height: 100vh;
  z-index: 99999;
  background: var(--upsilon-2);
}
#hamburger-menu a,
#hamburger-menu .darkmode-switch {
  display: block;
  font-weight: 400;
  font-size: 2em;
  margin: 1em;
  text-decoration: none;
  color: var(--foreground);
  text-align: right;
}
#hamburger-menu .darkmode-switch .switch {
  justify-content: end;
}
#nav-btn-wrapper {
  font-size: 2em;
  margin: 1em;
  display: flex;
  justify-content: end;
}
#nav a {
  transition: font-size, margin 0.1s ease-in-out;
}
#nav #link-mobile-upsilon {
  display: none;
}
@media screen and (max-width: 720px) {
  /* Mobile navbar */

  #nav.closed {
    justify-content: space-between;
  }
  #nav a,
  #nav .right {
    display: none !important;
  }
  #nav #link-mobile-upsilon {
    display: block !important;
    margin: 15px;
  }
  .nav-btn-wrapper {
    display: flex;
    justify-content: end;
    margin: 1em;
    font-size: 2em;
  }
  .nav-btn {
    cursor: pointer;
    background: transparent;
    border: none;
    display: block;
    text-align: right;
  }

  .nav-btn::after {
    content: '\f0c9';
    font-weight: 900;
    font-size: 2em;
    font-family: 'Font Awesome 5 Free';
    color: var(--foreground);
    display: block;
  }
  #nav.closed .nav-btn::after {
    font-size: 2em;
  }
  #nav.open {
    flex-direction: column;
  }

  #nav.open a {
    margin: 10px;
    text-align: center;
  }
  #nav.open a.router-link-exact-active {
    text-decoration: underline;
  }
  .right {
    justify-content: center;
    margin-bottom: 15px;
    margin-top: 5px;
  }
}
@media screen and (max-width: 1200px) and (min-width: 720px) {
  /* Smaller navbar */
  #nav a,
  .darkmode-switch {
    font-size: 0.7em;
    font-family: Lato, sans-serif;
    font-weight: 600 !important;
    margin: 15px;
  }
  #nav a.router-link-exact-active {
    border-bottom: solid var(--foreground) 2pt;
  }
}
@media screen and (min-width: 1200px) {
  #nav a,
  .darkmode-switch {
    font-size: 1em;
    margin: 30px;
  }
  #nav a.router-link-exact-active {
    border-bottom: solid var(--foreground) 2pt;
  }
}
.right {
  flex: 1;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}
.doc-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.doc {
  background: var(--feature-bg-upsilon);
  max-width: 1000px;
  border-radius: 30px 30px 0 0;
  padding: 30px;
  padding-top: 0;
  width: 100%;
}
a[target='_blank']::after {
  content: ' \f35d';
  font-size: 0.9em;
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}
body {
  font-family: 'Lato', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--foreground);
  transition: background-image 0.5s, color 0.5s, background-color 0.5s,
    backdrop-filter 0.5s;
  overflow-y: overlay;
}

#nav {
  background: var(--upsilon-1);
  border-bottom: solid var(--upsilon-2) 3pt;
  font-family: 'Righteous';
  font-size: 1.5em;
  display: flex;
  z-index: 10000;
  position: relative;
  user-select: none;
}

#nav a {
  font-weight: 400;
  color: var(--foreground);
  text-decoration: none;
  display: block;
}

body {
  overflow-x: hidden;
  padding: 0;
  margin: 0;
  background: var(--upsilon-2);
}

/* Route transitions */
.route-enter-from {
  opacity: 0;
}
.route-enter-active {
  transition: all 0.1s ease-out;
}
.route-leave-to {
  opacity: 0;
}
.route-leave-active {
  transition: all 0.1s ease-in;
}
.hamburger-menu-enter-from {
  opacity: 0;
  transform: translateX(100vw);
}
.hamburger-menu-enter-active {
  transition: all 0.2s ease-out;
}
.hamburger-menu-leave-to {
  opacity: 0;
  transform: translateX(100vw);
}
.hamburger-menu-leave-active {
  transition: all 0.2s ease-in;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: normal;
}

body.light {
  background-image: url('~@/assets/Calculators_upsilon_light.webp');

  background-size: cover;
  background-attachment: fixed;
}
body.dark {
  background-image: url('~@/assets/Calculators_upsilon_dark.webp');

  background-size: cover;
  background-attachment: fixed;
}
.generic-page {
  width: 100%;
  margin: auto;
  background: var(--feature-bg-upsilon);
  padding: 1em;
  max-width: 800px;
  border-radius: 10px;
}
</style>
