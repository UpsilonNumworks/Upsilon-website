<template>
  <div id="nav">
    <router-link to="/">{{ t('home.name') }}</router-link>
    <router-link to="/install">{{ t('installer.name') }}</router-link>
    <router-link to="/releases">{{ t('releases.name') }}</router-link>
    <a target="_blank" href="https://github.com/Lauryy06/Upsilon">{{
      t('github.name')
    }}</a>
    <div class="right">
      <div class="darkmode-switch">
        <Switch
          :label="t('darkmode')"
          sid="theme-switch"
          @switched="switchTheme"
        />
      </div>
    </div>
  </div>
  <router-view />
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
  components: {
    Switch
  },
  methods: {
    switchTheme (checked) {
      const theme = checked ? 'dark' : 'light'
      document.body.classList = [theme]
    }
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital@0;1&display=swap');

.light {
  --upsilon-1: #accef8;

  --upsilon-2: white;
  --foreground: black;
  --transparent-fg-1: #00000005;
  --transparent-fg-2: #00000020;
  --transparent-bg-3: #00000030;
  --foreground-2: #303030;
  --complementary: #3265a3;
}
.dark {
  --upsilon-1: #7ea2ce;

  --upsilon-2: #0c1624;
  --foreground: #ffffff;
  --transparent-fg-1: #ffffff10;
  --transparent-fg-2: #ffffff20;
  --transparent-bg-3: #00000030;
  --foreground-2: lightgrey;
  --complementary: #7ecc70;
}
@media screen and (max-width: 500px) {
  #nav a {
    font-size: 0.8em;
    margin: 20px;
  }
}
@media screen and (min-width: 500px) {
  #nav a {
    font-size: 1em;
    margin: 30px;
  }
}
.darkmode-switch {
  margin-right: 30px;
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
  background: var(--transparent-fg-1);
  max-width: 1000px;
  border-radius: 30px 30px 0 0;
  padding: 30px;
  padding-top: 0;
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
  transition: color, background-color 0.5s;
}

#nav {
  background: var(--upsilon-1);
  border-bottom: solid var(--upsilon-2) 3pt;
  font-family: 'Righteous';
  font-size: 1.5em;
  display: flex;
}

#nav a {
  font-weight: 400;
  color: var(--foreground);
  text-decoration: none;
  display: block;
  transition: margin, font-size 0.1s;
}

#nav a.router-link-exact-active {
  border-bottom: solid var(--foreground) 2pt;
}
body {
  overflow-x: hidden;
  padding: 0;
  margin: 0;
  background: var(--upsilon-2);
}
</style>
