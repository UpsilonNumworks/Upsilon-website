<template>
  <div id="installer">
    <div id="installer-container">
      <h1>{{ t('installer.title') }}</h1>
      <div class="installer">
        <div id="status-display"></div>
        <button class="btn" id="btn-connect">
          {{ t('installer.connect') }}
        </button>
        <button class="btn" id="btn-recovery">
          {{ t('installer.recovery') }}
        </button>
        <form hidden id="install-form">
          <label for="input-restore">{{ t('installer.restore') }}:</label>
          <input type="checkbox" name="input-uname" id="input-restore" />
          <label for="input-uname">{{ t('installer.username') }}:</label>
          <input
            maxlength="16"
            type="text"
            name="input-uname"
            id="input-uname"
          />
          <button id="btn-install" class="btn btn-primary" type="submit">
            Install
          </button>
        </form>
        <div class="progressbar" id="progressbar">
          <div class="progressbar-bar" id="progressbar-bar"></div>
        </div>
        <div id="progressbar-text"></div>
      </div>
    </div>
  </div>
</template>

// TODO: Test on the N0100 // TODO: Use GitHub releases // TODO: Clean up code
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
    onload () {
      onInstallerLoad(this.t)
    }
  }
})
function onInstallerLoad (t) {
  const installForm = document.getElementById('install-form')
  const connectBtn = document.getElementById('btn-connect')
  const installBtn = document.getElementById('btn-install')
  const recoveryBtn = document.getElementById('btn-recovery')
  const progressbar = document.getElementById('progressbar-bar')
  const progressbarText = document.getElementById('progressbar-text')
  const usernameInput = document.getElementById('input-uname')
  const statusDisplay = document.getElementById('status-display')

  if (!('usb' in navigator)) {
    statusDisplay.innerText = t('installer.incompatibleBrowser')
    statusDisplay.classList = ['error']
    connectBtn.hidden = true
    recoveryBtn.hidden = true
    return
  }

  var storage = null
  var inRecoveryMode = false
  // const releasesList = { '1.0.0': { name: 'U1.0.0' } }
  // const GitHubRepoName = 'Yaya-Cout/Upsilon'
  const language = 'en'
  var shouldRestoreStorage = false
  var calculator = new Numworks()
  var calculatorRecovery = new Numworks.Recovery()

  // Auto connect for the Recovery
  // calculatorRecovery.autoConnect(recovery)

  // Auto connect for install
  calculator.autoConnect(connectedHandler)

  navigator.usb.addEventListener('disconnect', function (e) {
    calculator.onUnexpectedDisconnect(e, function () {
      // Do stuff when the calculator gets disconnected.
      calculator.autoConnect(connectedHandler)
      setStatus('disconnected')
    })
  })

  connectBtn.onclick = function (e) {
    calculator.detect(function () {
      calculator.stopAutoConnect()
      connectedHandler()
    }, onError)
  }

  recoveryBtn.onclick = () => {
    calculatorRecovery.detect(async function () {
      await recovery()
    }, onError)
  }

  installBtn.addEventListener('click', (event) => {
    event.preventDefault()
    install().catch(onError)
  })
  function onError (err) {
    statusDisplay.innerHTML = t('installer.error') + ': ' + err.message
    statusDisplay.classList = ['error']

    if (
      err.message.includes(
        "Cannot set properties of null (setting 'startAddress')"
      )
    ) {
      statusDisplay.innerHTML +=
        '<br> <b>' + t('installer.hints.DisableProtection') + '</b>'
    } else if (err.message.includes('Unable to claim interface')) {
      statusDisplay.innerHTML +=
        '<br> <b>' + t('installer.hints.closeOtherTabs') + '</b>'
    }
  }
  function setStatus (status) {
    console.log('Status set to', status)
    switch (status) {
      case 'connected':
        console.log('Calculator connected')
        statusDisplay.innerHTML = t('installer.connected')
        statusDisplay.classList = ['info']
        installForm.hidden = false
        recoveryBtn.hidden = true
        connectBtn.hidden = true
        break
      case 'disconnected':
        console.log('Calculator disconnected')
        statusDisplay.innerHTML = t('installer.disconnected')
        statusDisplay.classList = ['disconnected']
        installForm.hidden = true
        recoveryBtn.hidden = false
        connectBtn.hidden = false
        break
      case 'backingup':
        statusDisplay.innerHTML = t('installer.backingup')
        statusDisplay.classList = ['info']
        progressbar.hidden = false
        installForm.hidden = true
        recoveryBtn.hidden = true
        connectBtn.hidden = true
        break
      case 'downloading':
        statusDisplay.innerHTML = t('installer.downloading')
        statusDisplay.classList = ['info']
        break
      case 'installingInternal':
        statusDisplay.innerHTML = t('installer.installing2of2')
        statusDisplay.classList = ['info']
        break
      case 'installingExternal':
        statusDisplay.innerHTML = t('installer.installing1of2')
        statusDisplay.classList = ['info']
        break
      case 'installingN100':
        statusDisplay.innerHTML = t('installer.installing')
        statusDisplay.classList = ['info']
        break
      case 'installationDone':
        statusDisplay.innerHTML = t('installer.done')
        statusDisplay.classList = ['info']
        break
      case 'restoring':
        statusDisplay.innerHTML = t('installer.restoring')
        statusDisplay.classList = ['info']
        break
      default:
        throw new Error('Invalid status specified')
    }
  }
  async function install () {
    // Install Upsilon on the calculator
    try {
      await initInstall()
      const model = calculator.getModel()
      console.log('Model : ' + model)
      setStatus('downloading')
      if (model === '0100') {
        setStatus('installingN100')
        downloadBin('internal', 'N0100').then((bin) => {
          patchUsername(bin)
          calculator.flashInternal(bin).catch(onError)
        })
      } else if (model === '0110') {
        await downloadBin('external', 'N0110').then(async (bin) => {
          setStatus('installingExternal')
          await calculator.flashExternal(bin)
        })
        console.log('downloading internal')
        await downloadBin('internal', 'N0110').then(async (bin) => {
          patchUsername(bin)
          setStatus('installingInternal')
          await calculator.flashInternal(bin)
        })
      } else console.error('Model not supported: ' + model)

      setStatus('installationDone')
      inRecoveryMode = false
      await postInstall()
      inRecoveryMode = false
    } catch (error) {
      await errorHandler(error)
    }
  }

  async function recovery () {
    // Flash Upsilon's recovery on the calculator
    try {
      calculatorRecovery.stopAutoConnect()
      inRecoveryMode = true
      connectedHandler()
      await initInstall()
      const model = calculatorRecovery.getModel()
      console.log('Model : ' + model)
      console.log('Downloading flasher')
      const flasher = await downloadBin('flasher', 'N' + model)
      console.log('Flashing flasher')
      await calculatorRecovery.flashRecovery(flasher)
      console.log('Recovery flashed successfully')
      await postInstall()
    } catch (error) {
      await errorHandler(error)
    }
  }

  async function connectedHandler () {
    // Do stuff when the calculator gets connected.
    setStatus('connected')
    if (!inRecoveryMode) {
      const PlatformInfo = await calculator.getPlatformInfo()
      console.log('PlatformInfo :', PlatformInfo)
      if (PlatformInfo.omega.user) {
        console.log(
          'Setting username input value to ' + PlatformInfo.omega.user
        )
        usernameInput.value = PlatformInfo.omega.user
      }
    }
    if (shouldRestoreStorage && !inRecoveryMode) {
      console.log('Restoring storage', shouldRestoreStorage)
      calculator.installStorage(storage, function () {
        console.log('Storage restored successfully')
      })
      shouldRestoreStorage = false
    }
  }

  function logProgress (done, total) {
    const percentage = (done / total) * 100
    progressbar.style.width = percentage + '%'
    progressbarText.textContent = percentage.toFixed() + '%'
  }

  async function hash (blob) {
    // Hash blob file
    const msgUint8 = await blob.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  async function getDownloadURL (jsonUrl) {
    return fetch(jsonUrl).then((response) => {
      return response.json().then((json) => {
        return jsonUrl + '?alt=media&token=' + json.downloadTokens
      })
    })
  }
  async function downloadBin (name, model) {
    // Function to download binary file that will be flashed on the calculator
    const mirror =
      'https://firebasestorage.googleapis.com/v0/b/upsilon-binfiles.appspot.com/o/'
    const release = 'dev'
    const maxDownloads = 2
    let fwname = 'epsilon.onboarding.' + name + '.bin'
    model = model.toLowerCase()
    if (model === 'n0100') {
      fwname = 'epsilon.onboarding.' + name + '.' + language + '.bin'
    }
    if (name === 'flasher') {
      fwname = 'flasher.verbose.bin'
    }
    const jsonUrl = `${mirror}${release}%2F${
      model === 'n0100' ? 'n100' : 'n110'
    }%2F${fwname}`
    console.log(jsonUrl)
    const binUrl = await getDownloadURL(jsonUrl)
    console.log(binUrl)
    const shaUrl = await getDownloadURL(jsonUrl + '.sha256')
    console.log(shaUrl)

    // Download bin file
    for (var i = 0; i < maxDownloads; i++) {
      console.log('Downloading ' + fwname)
      const bin = await downloadAsync('GET', binUrl, 'blob')
      // Verify download
      console.log('Downloading checksum')
      const checksum = await downloadAsync('GET', shaUrl, 'text')
      console.log('Hashing bin file')
      let binHashed = null
      if (model === 'n0100') {
        binHashed = (await hash(bin)) + ' *final-output/' + fwname + '\n'
      } else {
        binHashed = (await hash(bin)) + ' *binpack/' + fwname + '\n'
      }
      console.log('Verifying checksum')
      if (checksum === binHashed) {
        // If download is verified, return the downloaded bin file
        console.log('Bin file downloaded successfully')
        return await bin.arrayBuffer()
      } else {
        // If download is errored, retry the download
        console.log('Download failed')
        console.log('Checksum: ' + checksum + ', Bin hash: ' + binHashed)
        throw new Error({ message: 'Failed to verify file integrity' })
      }
    }
    throw new Error('Download failed after ' + i + ' tr' + i > 1 ? 'ies' : 'y')
  }

  async function downloadAsync (method, url, responseType = 'blob') {
    return fetch(url, { method: method }).then((response) => {
      console.log(response)
      if (responseType === 'blob') {
        return response.blob()
      } else {
        return response.text()
      }
    })
  }

  async function initInstall () {
    // Function to setup the installation
    setStatus('backingup')
    if (inRecoveryMode) {
      calculatorRecovery.device.logProgress = logProgress
    }
    try {
      calculator.device.logProgress = logProgress
    } catch (err) {
      if (!inRecoveryMode) {
        console.warn('Error when initializing the progress bar')
      }
    }
    try {
      // Disable WebDFU logging because it crash debug console
      calculator.device.console.log = function () {}
      calculator.device.logInfo = function () {}
    } catch (e) {
      console.warn('Error while disabling WebDFU logging')
    }
    progressbar.parentNode.classList.add('progressbar-active')
    try {
      storage = await calculator.backupStorage()
      // Ditch all non-python stuff, for convinience.
      for (var i in storage.records) {
        if (storage.records[i].type !== 'py') storage.records.splice(i, 1)
      }
      console.log('Storage :', storage)
    } catch (e) {
      if (storage == null) {
        storage = new DataView(new ArrayBuffer())
        console.warn(
          'Error when fetching scripts, creating a new empty storage'
        )
      } else {
        console.log('Error when fetching scripts, kepping old scripts')
      }
    }
    logProgress(0, 1)
    console.log('Disabling protection')
    if (!inRecoveryMode) {
      try {
        await calculator.device.requestOut(0x11) // FIXME : It doesn't work
        // TODO: Add ask user to disable the protection
      } catch (e) {
        console.warn('Error while disabling calculator protection')
      }
    }
  }

  async function postInstall () {
    // Function to finish the installation cleanly.
    shouldRestoreStorage = true
    progressbar.parentNode.classList.remove('progressbar-active')
    progressbarText.hidden = true
    recoveryBtn.hidden = false
    connectBtn.hidden = false
  }

  function patchUsername (InternalBin) {
    // Function to patch the internal bin with the username.
    const username = usernameInput.value
    console.log('Patching internal bin with username : ' + username)
    if (username) {
      const internalBuf = new Uint8Array(InternalBin)

      const enc = new TextEncoder()
      let encoded = enc.encode(username + '\0')
      if (encoded.length > 16) {
        encoded[15] = 0
        encoded = encoded.slice(0, 16)
      }
      internalBuf.set(encoded, 0x1f8)
    }
  }
  async function errorHandler (error) {
    console.error(error)
    // installationFail.hidden = false
    await postInstall()
    // installationSuccess.hidden = true
  }
}
</script>

<style scoped>
h1 {
  margin: 0.5em;
  padding: 0.5em;
}
.error {
  background-color: var(--error-bg);
  border: red 1pt solid;
  color: var(--error-text);
  backdrop-filter: blur(50px);
  padding: 1em;
  margin: 1em;
}
.info {
  background-color: var(--feature-bg-upsilon);
  border: solid var(--upsilon-1) 1pt;
  backdrop-filter: blur(50px);
  padding: 1em;
  margin: 1em;
}

.disconnected {
  background-color: var(--feature-bg-omega);
  border: solid var(--error-text) 1pt;
  backdrop-filter: blur(50px);
  padding: 1em;
  margin: 1em;
}
#status-display {
  transition: all 0.1s;
  border-radius: 5px;
}
.progressbar {
  height: 8px;
  border-radius: 10px;
  background-color: var(--foreground-2);
  margin: 15px;
  opacity: 0;
  overflow: hidden;
}
.progressbar-active {
  opacity: 1;
}
.progressbar-bar {
  height: 8px;
  background-color: var(--upsilon-1);
}

.btn {
  border-radius: 5px;
  background-color: var(--upsilon-1);
  border: none;
  color: white;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  margin: 12px 6px;
  transition-duration: 0.4s;
  cursor: pointer;
}

#btn-connect,
#btn-install {
  background-color: var(--upsilon-2);
  color: var(--foreground);
  border: 2px solid var(--upsilon-1);
}

#btn-connect:hover,
#btn-install:hover {
  background-color: var(--upsilon-1);
  color: var(--upsilon-2);
}

#btn-recovery {
  background-color: var(--upsilon-2);
  color: var(--foreground);
  border: 2px solid var(--foreground-2);
}

#btn-recovery:hover {
  background-color: var(--foreground-2);
  color: var(--upsilon-2);
}

.textinput {
  border: 2px solid var(--upsilon-1); /* FIXME */
  border-radius: 5px;
  background-color: var(--upsilon-2);
  color: var(--foreground);
  padding: 16px 0px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
}

.installer {
  text-align: center;
}

.installationMessage {
  font-size: 20px;
}

#installer {
  padding: 1em;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: baseline;
}
#installer-container {
  width: 100%;
  background: var(--feature-bg-upsilon);
  padding: 1em;
  max-width: 700px;
}
#install-form {
  display: grid;
  grid-template-columns: auto auto;
  max-width: 400px;
  margin: auto;
  padding: 1em;
  border-radius: 5px;
}
#install-form > * {
  display: block;
}
label {
  user-select: none;
}
#install-form > label,
#install-form > input {
  text-align: left;
  margin: 0.5em;
  font-size: 1.1em;
  padding: 0.5em;
}
input {
  background-color: var(--upsilon-2);
  border: solid var(--upsilon-1) 2pt;
  border-radius: 3px;
  color: var(--foreground);
  font-family: inherit;
}
#btn-install {
  grid-column: 1 / 3;
}
.light #installer {
  background-image: url('~@/assets/r8.webp');

  background-size: cover;
  background-attachment: fixed;
}
.dark #installer {
  background-image: url('~@/assets/r7.webp');

  background-size: cover;
  background-attachment: fixed;
}
*[hidden] {
  display: none !important;
}
</style>
