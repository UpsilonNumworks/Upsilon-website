<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
    <router-link to="/install">Install</router-link>
    <a target="_blank" href="https://github.com/Lauryy06/Upsilon">Github</a>
  </div>
  <router-view />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
}

#nav {
  background: #7ea2ce;
  border-bottom: solid #5e81ac 3pt;
  font-family: 'Righteous';
  font-size: 1.5em;
  display: flex;
}

#nav a {
  font-weight: bold;
  color: white;
  text-decoration: none;
  display: block;
  margin: 30px;
}

#nav a.router-link-exact-active {
  border-bottom: solid white 2pt;
}
body {
  overflow-x: hidden;
  padding: 0;
  margin: 0;
}
</style>
