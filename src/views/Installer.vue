<template>
  <div id="installer">
    <h1>{{ t('installer.title') }}</h1>
    <button id="connect">{{ t('installer.connect') }}</button>
    <button id="install" hidden>{{ t('installer.install') }}</button>
    <input placeholder="Username" id="username" hidden> <!-- TODO: Translate placeholder -->
    <div class="progressbar">
      <div class="progressbar-bar" id="progressbar-bar"></div>
    </div>
  </div>
</template>

// TODO: Check of checksum is correct
// TODO: Add N0100 support
// TODO: Use GitHub releases
// TODO: Improve style
// TODO: Clean up code

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Numworks from 'numworks.js'

export default defineComponent({
  name: 'installer',
  setup () {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global'
    })
    return { t }
  },
  mounted: function () {
    this.onload()
  },
  methods: {
    onload: function () {
      onInstallerLoad()
    }
  }

})
function onInstallerLoad () {
  var connect = document.getElementById('connect')
  var install = document.getElementById('install')
  var progressbar = document.getElementById('progressbar-bar')
  var usernameInput = document.getElementById('username')
  // const GitHubRepoName = 'Yaya-Cout/Upsilon'
  const dryrun = true
  // const releasesList = { '1.0.0': { name: 'U1.0.0' } }
  var calculator = new Numworks()

  navigator.usb.addEventListener('disconnect', function (e) {
    calculator.onUnexpectedDisconnect(e, function () {
      calculator.autoConnect(connectedHandler)
      console.log('Calculator disconnected')
      install.hidden = true
      usernameInput.hidden = true
      connect.hidden = false
      // Do stuff when the calculator gets disconnected.
    })
  })

  calculator.autoConnect(connectedHandler)

  function logProgress (done, total) {
    if (typeof total === 'undefined') {
      console.log('Total progress is undefined : progress bar will not work')
    } else {
      const percentage = (done / total * 100)
      progressbar.style.width = percentage + '%'
      progressbar.textContent = percentage.toFixed() + '%'
    }
  }

  async function emulateFlash (data) {
    const onesecdata = 120000
    const sectotal = data.byteLength / onesecdata
    const accuracy = 1000
    const sleeptime = sectotal / accuracy * 1000
    for (let i = 0; i < accuracy; i++) {
      logProgress(i, accuracy)
      await new Promise(resolve => setTimeout(resolve, sleeptime))
    }
  }

  function downloadBin (name, callback) {
    const version = '1.0.0'
    const model = 'N0110'.toLowerCase()
    const fwname = 'epsilon.onboarding.' + name + '.bin'
    const mirror = ''
    const url = mirror + 'firmwares/' + version + '/' + model.toLowerCase() + '/' + fwname
    // console.log(version, releasesList)
    // const fwname = 'epsilon-binpack-' + model + '.tgz.zip'
    // const url = 'https://github.com/' + GitHubRepoName + '/releases/download/' + releasesList[version].name + '/' + fwname
    // const releasesAPIURL = 'https://api.github.com/repos/' + GitHubRepoName + '/releases'
    // console.log(releasesAPIURL)

    // // Download release URL
    // const xhr = new XMLHttpRequest()
    // xhr.open('GET', releasesAPIURL)
    // xhr.responseType = 'json'
    // xhr.onload = function (e) {
    //   if (this.status === 200) {
    //     console.log('response', this.response) // JSON response
    //   }
    // }
    // xhr.send()

    // Download file

    var oReq = new XMLHttpRequest()
    oReq.responseType = 'blob'

    console.log('[DOWNLOADING] ' + url)

    oReq.onload = function (oEvent) {
      var blob = oReq.response
      callback(blob)
    }
    oReq.open('GET', url, true)
    oReq.send()
  }

  connect.onclick = function (e) {
    calculator.detect(function () {
      calculator.stopAutoConnect()
      connectedHandler()
    }, function (error) {
      console.error('Error: ' + error)
    })
  }

  install.onclick = async function (e) {
    await installUpsilon()
  }

  async function installUpsilon () {
    install.hidden = true
    usernameInput.hidden = true
    connect.hidden = true
    calculator.device.logProgress = logProgress
    logProgress(0, 1)
    progressbar.parentNode.classList.add('progressbar-active')
    downloadBin('external', installExternal)
  }

  async function installExternal (blob) {
    console.log('External downloaded successfully')
    const externalArrayBuffer = await blob.arrayBuffer()
    if (!dryrun) {
      await calculator.flashExternal(externalArrayBuffer)
    } else {
      await emulateFlash(externalArrayBuffer)
    }
    console.log('External flashed successfully')
    downloadBin('internal', installInternal)
  }
  async function installInternal (blob) {
    console.log('Internal downloaded successfully')
    const internalArrayBuffer = await blob.arrayBuffer()
    const username = usernameInput.value
    if (username) {
      const internalBuf = new Uint8Array(internalArrayBuffer)

      const enc = new TextEncoder()
      let encoded = enc.encode(username + '\0')
      if (encoded.length > 16) {
        encoded[15] = 0
        encoded = encoded.slice(0, 16)
      }
      internalBuf.set(encoded, 0x1F8)
    }
    if (!dryrun) {
      await calculator.flashInternal(internalArrayBuffer)
    } else {
      await emulateFlash(internalArrayBuffer)
    }
    console.log('Internal flashed successfully')
    progressbar.parentNode.classList.remove('progressbar-active')
    connect.hidden = false
    alert('Installation success')
  }
  async function connectedHandler () {
    calculator.stopAutoConnect() // It's connected, so autoConnect should stop.
    console.log('Calculator connected')
    // Do stuff when the claculator gets connected.
    install.hidden = false
    usernameInput.hidden = false
    connect.hidden = true
    const PlatformInfo = await calculator.getPlatformInfo()
    if (PlatformInfo.omega.user) {
      usernameInput.value = PlatformInfo.omega.user
    }
  }
}
</script>

<style scoped>
.progressbar {
  height: 3px;
  border-radius: 1.5px;
  background-color: var(--foreground-2);
  margin-right: 32px;
  margin-top: 14px;
  opacity: 0;
  transition: all 0.2 ease-in-out
}
.progressbar-active {
    opacity: 1;
}
.progressbar-bar {
  height: 3px;
  border-radius: 1.5px;
  background-color: var(--upsilon-1)
}
</style>
