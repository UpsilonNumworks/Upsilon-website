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
// TODO: Test on the N0100
// TODO: Use GitHub releases
// TODO: Improve style
// TODO: Clean up code
// TODO: Progress bar no restart

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
  var installButton = document.getElementById('install')
  var progressbar = document.getElementById('progressbar-bar')
  var usernameInput = document.getElementById('username')
  let storage = null
  // const releasesList = { '1.0.0': { name: 'U1.0.0' } }
  // const GitHubRepoName = 'Yaya-Cout/Upsilon'
  const dryrun = false
  const language = 'en'
  const debug = true
  var shouldRestoreStorage = false
  var calculator = new Numworks()

  navigator.usb.addEventListener('disconnect', function (e) {
    calculator.onUnexpectedDisconnect(e, function () {
      calculator.autoConnect(connectedHandler)
      logDebug('Calculator disconnected')
      installButton.hidden = true
      usernameInput.hidden = true
      connect.hidden = false
      // Do stuff when the calculator gets disconnected.
    })
  })

  calculator.autoConnect(connectedHandler)

  function logDebug (...strings) {
    if (debug) {
      for (let index = 0; index < strings.length; index++) {
        console.log(strings[index])
      }
    }
  }

  function logProgress (done, total) {
    if (typeof total === 'undefined') {
      console.warn('Total progress is undefined : progress bar will not work')
    } else {
      const percentage = (done / total * 100)
      progressbar.style.width = percentage + '%'
      progressbar.textContent = percentage.toFixed() + '%'
    }
  }

  async function emulateFlash (data) {
    logDebug('Emulating Flash')
    const onesecdata = 120000
    const sectotal = data.byteLength / onesecdata
    const accuracy = 1000
    const sleeptime = sectotal / accuracy * 1000
    for (let i = 0; i < accuracy; i++) {
      logProgress(i, accuracy)
      await new Promise(resolve => setTimeout(resolve, sleeptime))
    }
  }

  function downloadAsync (method, url) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest()
      xhr.responseType = 'blob'
      xhr.open(method, url)
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response)
        } else {
          reject(new Error({
            status: this.status,
            statusText: xhr.statusText
          }))
        }
      }
      xhr.onerror = function () {
        reject(new Error({
          status: this.status,
          statusText: xhr.statusText
        }))
      }
      xhr.send()
    })
  }

  async function downloadBin (name, model) {
    const version = '1.0.0'
    model = model.toLowerCase()
    const mirror = ''
    let fwname = 'epsilon.onboarding.' + name + '.bin'
    if (model === 'n0100') {
      fwname = 'epsilon.onboarding.' + name + '.' + language + '.bin'
    }
    const url = mirror + 'firmwares/' + version + '/' + model.toLowerCase() + '/' + fwname

    // Download file
    logDebug('[DOWNLOADING] ' + url)
    const blob = await downloadAsync('GET', url)
    logDebug('[DOWNLOADED] ' + url)
    return await blob.arrayBuffer()
  }

  connect.onclick = function (e) {
    calculator.detect(function () {
      logDebug('Manually detection')
      calculator.stopAutoConnect()
      connectedHandler()
    }, function (error) {
      console.error('Error: ' + error)
    })
  }

  installButton.onclick = async function (e) {
    await install()
  }

  async function install () {
    installButton.hidden = true
    usernameInput.hidden = true
    connect.hidden = true
    calculator.device.logProgress = logProgress
    // Disable WebDFU logging because it crash debug console
    calculator.device.logDebug = function () {}
    calculator.device.logInfo = function () {}
    logProgress(0, 1)
    progressbar.parentNode.classList.add('progressbar-active')
    const model = calculator.getModel()
    storage = await calculator.backupStorage()
    // Ditch all non-python stuff, for convinience.
    for (var i in storage.records) {
      if (storage.records[i].type !== 'py') storage.records.splice(i, 1)
    }
    logDebug('Model :' + model)
    logDebug('Storage :', storage)
    if (model === '0100') await installN0100()
    else if (model === '0110') await installN0110()
    else console.error('Model not supported: ' + model)
    shouldRestoreStorage = true
    progressbar.parentNode.classList.remove('progressbar-active')
    connect.hidden = false
    // alert('Installation success')
    console.log('Installation success')
  }

  function patchUsername (InternalBin) {
    const username = usernameInput.value
    logDebug('Patching internal bin with username  : ' + username)
    if (username) {
      const internalBuf = new Uint8Array(InternalBin)

      const enc = new TextEncoder()
      let encoded = enc.encode(username + '\0')
      if (encoded.length > 16) {
        encoded[15] = 0
        encoded = encoded.slice(0, 16)
      }
      internalBuf.set(encoded, 0x1F8)
    }
  }

  async function installN0110 () {
    logDebug('Installing on N0110')
    logDebug('Downloading')
    const ExternalBin = await downloadBin('external', 'N0110')
    const InternalBin = await downloadBin('internal', 'N0110')
    logDebug('Installing')
    await installExternal(ExternalBin)
    await installInternal(InternalBin)
  }
  async function installN0100 () {
    logDebug('Installing on N0100')
    logDebug('Downloading')
    const InternalBin = await downloadBin('internal', 'N0100')
    logDebug('Installing')
    await installInternal(InternalBin)
  }

  async function installExternal (data) {
    logDebug('Flashing external')
    if (!dryrun) {
      await calculator.flashExternal(data)
    } else {
      await emulateFlash(data)
    }
    logDebug('External flashed successfully')
  }

  async function installInternal (data) {
    logDebug('Flashing internal')
    patchUsername(data)
    if (!dryrun) {
      await calculator.flashInternal(data)
    } else {
      await emulateFlash(data)
    }
    logDebug('Internal flashed successfully')
  }
  async function connectedHandler () {
    calculator.stopAutoConnect() // It's connected, so autoConnect should stop.
    logDebug('Calculator connected')
    // Do stuff when the claculator gets connected.
    installButton.hidden = false
    usernameInput.hidden = false
    connect.hidden = true
    const PlatformInfo = await calculator.getPlatformInfo()
    logDebug('PlatformInfo :', PlatformInfo)
    if (PlatformInfo.omega.user) {
      logDebug('Setting username input value to ' + PlatformInfo.omega.user)
      usernameInput.value = PlatformInfo.omega.user
    }
    if (shouldRestoreStorage) {
      logDebug('Restoring storage', shouldRestoreStorage)
      calculator.installStorage(storage, function () { logDebug('Storage restored successfully') })
    }
    shouldRestoreStorage = false
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
