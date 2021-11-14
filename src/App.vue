<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
    <router-link to="/install">Install</router-link>
    <a target="_blank" href="https://github.com/Lauryy06/Upsilon">Github</a>
  </div>
  <router-view />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital@0;1&display=swap');

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
.doc-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.doc {
  background: #ffffff10;
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
:root {
  --upsilon-1: #7ea2ce;
  --upsilon-2: #5e81ac;
  --complementary: #7ecc70;
}
#app {
  font-family: 'Lato', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
}

#nav {
  background: var(--upsilon-1);
  border-bottom: solid var(--upsilon-2) 3pt;
  font-family: 'Righteous';
  font-size: 1.5em;
  display: flex;
}

#nav a {
  font-weight: bold;
  color: white;
  text-decoration: none;
  display: block;
  transition: margin, font-size 0.1s;
}

#nav a.router-link-exact-active {
  border-bottom: solid white 2pt;
}
body {
  overflow-x: hidden;
  padding: 0;
  margin: 0;
  background: var(--upsilon-2);
}
</style>
