<template>
  <div id="installer">
    <h1>{{ t('installer.title') }}</h1>
    <div class="installer">
      <button class="btn btn-primary" id="connect">{{ t('installer.connect') }}</button>
      <button class="btn btn-important" id="recovery">{{ t('installer.recovery') }}</button>
      <button class="btn btn-primary" id="install" hidden>{{ t('installer.install') }}</button>
      <input class="textinput" type="text" placeholder="Username" id="username" maxlength="16"  hidden> <!-- TODO: Translate placeholder -->
      <div class="progressbar" id="progressbar">
        <div class="progressbar-bar" id="progressbar-bar"></div>
      </div>
      <div id="progressbarText"></div>
      <div id="installationSuccess" class="installationMessage installationSuccess" hidden>{{ t('installer.installationSuccess') }}</div>
      <div id="installationFail" class="installationMessage installationFail" hidden>{{ t('installer.installationFail') }}</div>
      <div id="recoverySuccess" class="installationMessage recoverySuccess" hidden>{{ t('installer.recoverySuccess') }}
        <br>{{ t('installer.pleaseclickon') }} "{{ t('installer.connect') }}" {{ t('installer.thenselect') }}.</div>
    </div>
  </div>
</template>

// TODO: Test on the N0100
// TODO: Use GitHub releases
// TODO: Clean up code
// TODO: Progress bar no restart
// TODO: Use error message

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
  var recoveryButton = document.getElementById('recovery')
  var progressbar = document.getElementById('progressbar-bar')
  var progressbarText = document.getElementById('progressbarText')
  var usernameInput = document.getElementById('username')
  var installationSuccess = document.getElementById('installationSuccess')
  var installationFail = document.getElementById('installationFail')
  var recoverySuccess = document.getElementById('recoverySuccess')
  var storage = null
  var inRecoveryMode = false
  // const releasesList = { '1.0.0': { name: 'U1.0.0' } }
  // const GitHubRepoName = 'Yaya-Cout/Upsilon'
  const dryrun = false
  const language = 'en'
  const debug = true
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
      logDebug('Calculator disconnected')
      installButton.hidden = true
      usernameInput.hidden = true
      recoveryButton.hidden = false
      connect.hidden = false
    })
  })

  connect.onclick = function (e) {
    calculator.detect(function () {
      logDebug('Manually detection')
      calculator.stopAutoConnect()
      connectedHandler()
    }, function (error) {
      console.error('Error: ' + error)
    })
  }

  recoveryButton.onclick = function (e) {
    calculatorRecovery.detect(async function () {
      logDebug('Recovery mode detected')
      await recovery()
    }, function (error) {
      console.error('Error: ' + error)
    })
  }

  installButton.onclick = async function (e) {
    await install()
  }

  async function install () {
    // Install Upsilon on the calculator
    try {
      await initInstall()
      const model = calculator.getModel()
      logDebug('Model : ' + model)
      if (model === '0100') await installN0100()
      else if (model === '0110') await installN0110()
      else console.error('Model not supported: ' + model)
      console.log('Installation success')
      inRecoveryMode = false
      await postInstall()
      inRecoveryMode = false
    } catch (error) {
      await errorHandler(error)
    }
  }

  async function recovery () {
    // Flash Upsilon's recovery on the calculator
    calculatorRecovery.stopAutoConnect()
    inRecoveryMode = true
    connectedHandler()
    await initInstall()
    const model = calculatorRecovery.getModel()
    logDebug('Model : ' + model)
    logDebug('Downloading flasher')
    const flasher = await downloadBin('flasher', 'N' + model)
    logDebug('Flashing flasher')
    await calculatorRecovery.flashRecovery(flasher)
    logDebug('Recovery flashed successfully')
    await postInstall()
    recoverySuccess.hidden = false
  }

  async function installN0100 () {
    // Install Upsilon on the N0100
    logDebug('Installing on N0100')
    logDebug('Downloading')
    const InternalBin = await downloadBin('internal', 'N0100')
    logDebug('Installing')
    await installInternal(InternalBin)
  }

  async function installN0110 () {
    // Install Upsilon on the N0110
    logDebug('Installing on N0110')
    logDebug('Downloading')
    const ExternalBin = await downloadBin('external', 'N0110')
    const InternalBin = await downloadBin('internal', 'N0110')
    logDebug('Installing')
    await installExternal(ExternalBin)
    await installInternal(InternalBin)
  }

  async function connectedHandler () {
    // Do stuff when the calculator gets connected.
    logDebug('Calculator connected')
    installButton.hidden = false
    usernameInput.hidden = false
    recoveryButton.hidden = true
    recoverySuccess.hidden = true
    connect.hidden = true
    if (!inRecoveryMode) {
      const PlatformInfo = await calculator.getPlatformInfo()
      logDebug('PlatformInfo :', PlatformInfo)
      if (PlatformInfo.omega.user) {
        logDebug('Setting username input value to ' + PlatformInfo.omega.user)
        usernameInput.value = PlatformInfo.omega.user
      }
    }
    if (shouldRestoreStorage && !inRecoveryMode) {
      logDebug('Restoring storage', shouldRestoreStorage)
      calculator.installStorage(storage, function () { logDebug('Storage restored successfully') })
      shouldRestoreStorage = false
    }
  }

  function logDebug (...strings) {
    // Function to log debug message in debug if enabled
    if (debug) {
      for (let index = 0; index < strings.length; index++) {
        console.log(strings[index])
      }
    }
  }

  function logProgress (done, total) {
    // Function to log progress in progress bar
    if (typeof total === 'undefined') {
      console.warn('Total progress is undefined : progress bar will not work')
    } else {
      const percentage = (done / total * 100)
      progressbar.style.width = percentage + '%'
      progressbarText.textContent = percentage.toFixed() + '%'
    }
  }

  async function hash (blob) {
    // Hash blob file
    const msgUint8 = await blob.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }

  async function downloadBin (name, model) {
    // Function to download binary file that will be flashed on the calculator
    const version = '1.0.0'
    const mirror = ''
    const maxDownloads = 2
    let fwname = 'epsilon.onboarding.' + name + '.bin'
    model = model.toLowerCase()
    if (model === 'n0100') {
      fwname = 'epsilon.onboarding.' + name + '.' + language + '.bin'
    }
    if (name === 'flasher') {
      fwname = 'flasher.verbose.bin'
    }
    const url = mirror + 'firmwares/' + version + '/' + model.toLowerCase() + '/' + fwname

    // Download bin file
    for (var i = 0; i < maxDownloads; i++) {
      logDebug('[DOWNLOADING] ' + url)
      const bin = await downloadAsync('GET', url, 'blob')
      logDebug('[DOWNLOADED] ' + url)
      // Verify download
      logDebug('Downloading checksum')
      const ckecksum = await downloadAsync('GET', url + '.sha256', 'text')
      logDebug('Hashing bin file')
      let binHashed = null
      if (model === 'n0100') {
        binHashed = (await hash(bin)) + ' *final-output/' + fwname + '\n'
      } else {
        binHashed = (await hash(bin)) + ' *binpack/' + fwname + '\n'
      }
      logDebug('Verifying checksum')
      if (ckecksum === binHashed) {
        // If download is verified, return the downloaded bin file
        logDebug('Bin file downloaded successfully')
        return await bin.arrayBuffer()
      } else {
        // If download is errored, retry the download
        logDebug('Download failed')
        logDebug('Checksum: ' + ckecksum + ', Bin hash: ' + binHashed)
        console.log(i)
      }
    }
    throw new Error('Download failed with ' + i + ' try')
  }

  function downloadAsync (method, url, responseType = 'blob') {
    // Function to download a file asyncronously
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest()
      xhr.responseType = responseType
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

  async function initInstall () {
    // Function to setup the installation
    installButton.hidden = true
    usernameInput.hidden = true
    recoveryButton.hidden = true
    connect.hidden = true
    progressbarText.hidden = false
    installationSuccess.hidden = true
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
      calculator.device.logDebug = function () {}
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
      logDebug('Storage :', storage)
    } catch (e) {
      if (storage == null) {
        storage = new DataView(new ArrayBuffer())
        console.warn('Error when fetching scripts, creating a new empty storage')
      } else {
        logDebug('Error when fetching scripts, kepping old scripts')
      }
    }
    logProgress(0, 1)
    logDebug('Disabling protection')
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
    recoveryButton.hidden = false
    connect.hidden = false
    if (!inRecoveryMode) {
      installationSuccess.hidden = false
    } else {
      recoverySuccess.hidden = true
    }
  }

  async function installExternal (data) {
    // Function to flash the external memory
    logDebug('Flashing external')
    if (!dryrun) {
      await calculator.flashExternal(data)
    } else {
      await emulateFlash(data)
    }
    logDebug('External flashed successfully')
  }

  async function installInternal (data) {
    // Function to flash the internal memory
    logDebug('Flashing internal')
    patchUsername(data)
    if (!dryrun) {
      await calculator.flashInternal(data)
    } else {
      await emulateFlash(data)
    }
    logDebug('Internal flashed successfully')
  }

  async function emulateFlash (data) {
    // Function to emulate the flash in dry run mode.
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

  function patchUsername (InternalBin) {
    // Function to patch the internal bin with the username.
    const username = usernameInput.value
    logDebug('Patching internal bin with username : ' + username)
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
  async function errorHandler (error) {
    console.error(error)
    installationFail.hidden = false
    await postInstall()
    installationSuccess.hidden = true
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

.btn-primary {
  background-color: var(--upsilon-2);
  color: var(--foreground);
  border: 2px solid var(--upsilon-1);
}

.btn-primary:hover {
  background-color: var(--upsilon-1);
  color: white;
}

.btn-important {
  background-color: var(--upsilon-2);
  color: var(--foreground);
  border: 2px solid var(--foreground-2);
}

.btn-important:hover {
  background-color: var(--foreground-2);
  color: white;
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

</style>
