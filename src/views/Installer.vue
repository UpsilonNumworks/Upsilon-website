<template>
  <div id="installer">
    <div class="generic-page" id="installer-container">
      <h1>{{ t('installer.title') }}</h1>
      <div class="installer">
        <div id="status-display"></div>
        <button id="btn-connect">
          {{ t('installer.connect') }}
        </button>
        <button id="btn-recovery">
          {{ t('installer.recovery') }}
        </button>
        <form hidden id="install-form">
          <label for="select-channel"
            >{{ t('installer.releaseChannel') }}:</label
          >
          <CustomSelect
            name="select-channel"
            sid="select-channel"
            @updated="setChannel"
            :title="t('installer.releaseChannel')"
            :items="[
              {
                text: t('installer.channels.beta.title'),
                id: 'beta',
                description: t('installer.channels.beta.description')
              },
              {
                text: t('installer.channels.dev.title'),
                id: 'dev',
                description: t('installer.channels.dev.description')
              }
            ]"
          >
          </CustomSelect>
          <label v-if="channel === 'beta'" for="select-theme"
            >{{ t('installer.theme') }}:</label
          >
          <CustomSelect
            v-if="channel === 'beta'"
            name="select-theme"
            sid="select-theme"
            @updated="setTheme"
            :title="t('installer.theme')"
            :items="
              themes.map((theme) => {
                return {
                  text: t('installer.themes.' + theme),
                  imgSrc: './themes/' + theme + '.webp',
                  id: theme
                }
              })
            "
          >
          </CustomSelect>

          <label for="input-uname">{{ t('installer.username') }}:</label>
          <input
            maxlength="16"
            type="text"
            name="input-uname"
            id="input-uname"
          />
          <button type="button" id="btn-disconnect">
            {{ t('installer.disconnect') }}
          </button>
          <button id="btn-install" class="btn-primary" type="submit">
            {{ t('installer.install') }}
          </button>
        </form>
        <div id="done-msg" hidden>
          <span id="thanks"> {{ t('installer.thanks') }}</span>
          <h2>{{ t('installer.whatnext') }}</h2>

          <p>
            {{ t('installer.external') }}
            <a
              id="external-link"
              href="https://upsilonnumworks.github.io/Upsilon-External/"
              target="_blank"
              rel="noopener noreferrer"
              >{{ t('installer.gothere') }}</a
            >
          </p>
          <p>
            {{ t('installer.jointhe') }}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://discord.gg/FSnX3tUu"
            >
              {{ t('installer.joinDiscord') }}
            </a>
          </p>
        </div>
        <div class="progressbar" id="progressbar">
          <div class="progressbar-bar" id="progressbar-bar"></div>
        </div>
        <div id="progressbar-text"></div>
      </div>
    </div>
  </div>
</template>

// TODO: Test on the N0100 (and fix because it doesn't even work.)

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Numworks from 'numworks.js'
import CustomSelect from '@/components/CustomSelect'

export default defineComponent({
  name: 'installer',
  components: { CustomSelect },
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
      onInstallerLoad(this.t, this)
    },
    setTheme (item) {
      this.theme = item.id
    },
    setChannel (item) {
      this.channel = item.id
    }
  },
  data () {
    return {
      theme: 'upsilon_light',
      channel: 'beta',
      themes: [
        'upsilon_light',
        'upsilon_dark',
        'epsilon_light',
        'epsilon_dark',
        'omega_light',
        'omega_dark',
        'arc_dark',
        'miami_vice',
        'omega_trans',
        'omega_blink',
        'omega_dracula',
        'omega_kawaii',
        'omega_shrek',
        'cursed_light',
        'omega_freenumworks',
        'ahegao'
      ]
    }
  }
})
function onInstallerLoad (t, component) {
  const installForm = document.getElementById('install-form')
  const connectBtn = document.getElementById('btn-connect')
  const disconnectBtn = document.getElementById('btn-disconnect')
  const installBtn = document.getElementById('btn-install')
  const recoveryBtn = document.getElementById('btn-recovery')
  const progressbar = document.getElementById('progressbar-bar')
  const progressbarText = document.getElementById('progressbar-text')
  const usernameInput = document.getElementById('input-uname')
  const statusDisplay = document.getElementById('status-display')
  const doneMsg = document.getElementById('done-msg')
  const externalLink = document.getElementById('external-link')

  externalLink.onclick = () => {
    calculator.device.device_.close()
  }

  if (!('usb' in navigator)) {
    statusDisplay.innerText = t('installer.incompatibleBrowser')
    statusDisplay.classList = ['error']
    // TODO use v-if
    connectBtn.hidden = true
    recoveryBtn.hidden = true
    return
  }

  var storage = null
  var inRecoveryMode = false
  // TODO language selection menu
  const language = 'en'
  var shouldRestoreStorage = false
  var calculator = new Numworks()
  var calculatorRecovery = new Numworks.Recovery()
  var currentbin = ''

  calculator.autoConnect(connectedHandler)

  navigator.usb.addEventListener('disconnect', function (e) {
    calculator.onUnexpectedDisconnect(e, function () {
      // Do stuff when the calculator gets disconnected.
      calculator.autoConnect(connectedHandler)
      setStatus('disconnected')
    })
  })

  connectBtn.onclick = (e) => {
    calculator.detect(() => {
      calculator.stopAutoConnect()
      connectedHandler()
    }, onError)
  }

  disconnectBtn.onclick = (e) => {
    e.preventDefault()
    calculator.device.device_.close()
    calculator.stopAutoConnect()
    recovery.stopAutoConnect()
    setStatus('disconnected')
  }

  recoveryBtn.onclick = () => {
    calculatorRecovery.detect(async function () {
      await recovery()
    }, onError)
  }

  installBtn.addEventListener('click', (event) => {
    event.preventDefault()
    install()
  })
  function onError (err) {
    shouldRestoreStorage = false
    statusDisplay.innerHTML = t('installer.error') + ': ' + err.message
    statusDisplay.classList = ['error']

    if (typeof err === 'string') {
      err = { message: err }
    }

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
    } else if (err.message.includes('No device selected')) {
      statusDisplay.innerHTML +=
        '<br>' +
        t('installer.hints.noDeviceSelected.text1') +
        '<ul style="text-align:left"><li>' +
        t('installer.hints.noDeviceSelected.li1') +
        '</li><li><details><summary>' +
        t('installer.hints.noDeviceSelected.li2') +
        '</summary><details><summary>Linux</summary>' +
        t('installer.hints.noDeviceSelected.driverHint.download') +
        ' <a href="https://workshop.numworks.com/files/drivers/linux/50-numworks-calculator.rules">' +
        t('installer.hints.noDeviceSelected.driverHint.linux.thisfile') +
        '</a> ' +
        t('installer.hints.noDeviceSelected.driverHint.linux.linuxMoveIt') +
        '<br>' +
        t('installer.hints.noDeviceSelected.driverHint.linux.command') +
        '<pre>wget https://workshop.numworks.com/files/drivers/linux/50-numworks-calculator.rules && sudo mv 50-numworks-calculator.rules /etc/udev/rules.d </pre>' +
        '</details><details><summary>Windows</summary>' +
        t('installer.hints.noDeviceSelected.driverHint.download') +
        ' ' +
        t('installer.hints.noDeviceSelected.driverHint.andInstall') +
        ' <a href="https://my.numworks.com/files/drivers/windows/numworks-driver-win64.msi">' +
        t('installer.hints.noDeviceSelected.driverHint.theDriver') +
        '</a> ' +
        t('installer.hints.noDeviceSelected.driverHint.rebootAfter') +
        '</details>' +
        '</details>' +
        '</li></ul><details><summary>' +
        t('installer.hints.noDeviceSelected.moreHelp.needHelp') +
        '</summary>' +
        t('installer.hints.noDeviceSelected.moreHelp.tryRecovery') +
        '<br>' +
        t('installer.hints.noDeviceSelected.moreHelp.1') +
        ' <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/FSnX3tUu">' +
        t('installer.hints.noDeviceSelected.moreHelp.discord') +
        '</a> ' +
        t('installer.hints.noDeviceSelected.moreHelp.2') +
        '</details>'
    } else if (err.message.endsWith('????')) {
      statusDisplay.innerHTML +=
        '<br>' +
        t('installer.e16.message') +
        '<br>' +
        t('installer.e16.beforeLink') +
        ' <a href="https://tiplanet.org/forum/viewtopic.php?f=113&t=25191&p=263495#p263495">' +
        t('installer.e16.link') +
        '</a>'
    }
    throw err
  }
  function setStatus (status) {
    console.log('Status set to', status)
    switch (status) {
      case 'connected':
        console.log('Calculator connected')
        if (inRecoveryMode) {
          statusDisplay.innerHTML = t('installer.recoveryConnected')
        } else {
          statusDisplay.innerHTML = t('installer.connected')
        }

        statusDisplay.classList = ['info']
        // TODO use v-if
        installForm.hidden = false
        recoveryBtn.hidden = true
        connectBtn.hidden = true
        doneMsg.hidden = true

        break
      case 'disconnected':
        if (statusDisplay.innerHTML === t('installer.waitingForReboot')) return
        console.log('Calculator disconnected')
        statusDisplay.innerHTML = t('installer.disconnected')
        statusDisplay.classList = ['disconnected']
        // TODO use v-if
        installForm.hidden = true
        recoveryBtn.hidden = false
        connectBtn.hidden = false
        doneMsg.hidden = true

        break
      case 'backingup':
        statusDisplay.innerHTML = t('installer.backingup')
        statusDisplay.classList = ['info']
        // TODO use v-if
        progressbar.hidden = false
        installForm.hidden = true
        recoveryBtn.hidden = true
        connectBtn.hidden = true
        doneMsg.hidden = true

        break
      case 'downloading':
        statusDisplay.innerHTML =
          t('installer.downloading') +
          (currentbin === 'external' ? ' 1' : ' 2') +
          '/2 ...'
        statusDisplay.classList = ['info']
        break
      case 'erasing':
        statusDisplay.innerHTML =
          t('installer.erasing') +
          (currentbin === 'external' ? ' 1' : ' 2') +
          '/2 ...'
        statusDisplay.classList = ['info']
        break
      case 'copying':
        statusDisplay.innerHTML =
          t('installer.writing') +
          (currentbin === 'external' ? ' 1' : ' 2') +
          '/2 ...'
        statusDisplay.classList = ['info']
        break
      case 'waitingForReboot':
        statusDisplay.innerHTML = t('installer.waitingForReboot')
        statusDisplay.classList = ['info']
        break
      case 'downloadingN100':
        statusDisplay.innerHTML = t('installer.downloading') + '...'
        statusDisplay.classList = ['info']
        break
      case 'installingN100':
        statusDisplay.innerHTML = t('installer.installing')
        statusDisplay.classList = ['info']
        break
      case 'installationDone':
        statusDisplay.innerHTML = t('installer.done')
        statusDisplay.classList = ['info']
        // TODO use v-if
        installForm.hidden = true
        doneMsg.hidden = false
        break
      case 'restoring':
        statusDisplay.innerHTML = t('installer.restoring')
        statusDisplay.classList = ['info']
        break
      case 'downloadingRecovery':
        statusDisplay.innerHTML = t('installer.downloadingRecovery')
        statusDisplay.classList = ['info']
        break
      case 'installingRecovery':
        statusDisplay.innerHTML = t('installer.installingRecovery')
        statusDisplay.classList = ['info']
        break
      case 'recoveryDone':
        statusDisplay.innerHTML = t('installer.recoveryDone')
        statusDisplay.classList = ['info']
        break
      default:
        throw new Error('Invalid status specified')
    }
  }
  function logInfo (text) {
    if (text === 'Erasing DFU device memory') {
      setStatus('erasing')
    } else if (text === 'Copying data from browser to DFU device') {
      setStatus('copying')
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log(text)
    }
  }
  async function install () {
    try {
      await initInstall()
      const model = calculator.getModel()
      console.log('Model : ' + model)
      if (model === '0100') {
        setStatus('downloadingN100')
        const bin = await downloadBin('internal', 'N0100')
        setStatus('installingN100')
        patchUsername(bin)
        await calculator.flashInternal(bin)
      } else if (model === '0110') {
        currentbin = 'external'
        setStatus('downloading')
        const externalBin = await downloadBin('external', 'N0110')
        await calculator.flashExternal(externalBin)
        console.log('downloading internal')
        currentbin = 'internal'
        setStatus('downloading')
        logProgress(0, 1)
        const internalBin = await downloadBin('internal', 'N0110')
        patchUsername(internalBin)
        await calculator.flashInternal(internalBin)
      } else throw new Error(t('installer.unsupportedModel') + ':' + model)

      setStatus('waitingForReboot')
      inRecoveryMode = false
      inRecoveryMode = false
    } catch (error) {
      onError(error)
    } finally {
      shouldRestoreStorage = true

      // TODO use v-if
      progressbar.parentNode.classList.remove('progressbar-active')
      progressbarText.hidden = true
      recoveryBtn.hidden = false
      connectBtn.hidden = false
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
      console.log('Downloading recovery')
      setStatus('downloadingRecovery')
      const flasher = await downloadBin('flasher', 'N' + model)
      console.log('Flashing recovery')
      setStatus('installingRecovery')
      await calculatorRecovery.flashRecovery(flasher)
      console.log('Recovery flashed successfully')
      setStatus('recoveryDone')
    } catch (error) {
      onError(error)
    } finally {
      shouldRestoreStorage = true
      // TODO use v-if
      progressbar.parentNode.classList.remove('progressbar-active')
      progressbarText.hidden = true
      recoveryBtn.hidden = false
      connectBtn.hidden = false
    }
  }

  async function connectedHandler () {
    // Do stuff when the calculator gets connected.
    setTimeout(() => {
      setStatus('connected')
    }, 0)
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
      await calculator.installStorage(storage, function () {
        console.log('Storage restored successfully')
        setStatus('installationDone')
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
      if (response.status === 404) {
        const err = new Error()
        err.message = t('installer.download404')
        throw err
      }
      return response.json().then((json) => {
        return jsonUrl + '?alt=media&token=' + json.downloadTokens
      })
    })
  }
  async function downloadBin (name, model) {
    // Function to download binary file that will be flashed on the calculator
    const mirror =
      'https://firebasestorage.googleapis.com/v0/b/upsilon-binfiles.appspot.com/o/'

    let fwname = ''
    if (name !== 'flasher') {
      fwname += 'epsilon.onboarding'
      if (component.channel === 'beta') {
        fwname += '.' + component.theme
      }
      if (model.toLowerCase() === 'n0100') {
        fwname += '.' + language
      }
      fwname += '.' + name + '.bin'
    } else {
      fwname = 'flasher.light.bin'
    }
    const jsonUrl = `${mirror}${component.channel}%2F${
      model.toLowerCase() === 'n0100' ? 'n100' : 'n110'
    }%2F${fwname}`
    const binUrl = await getDownloadURL(jsonUrl)
    const shaUrl = await getDownloadURL(jsonUrl + '.sha256')

    console.log('Downloading ' + fwname)
    const bin = await downloadAsync('GET', binUrl, 'blob')
    const checksum = await downloadAsync('GET', shaUrl, 'text')
    if (checksum.substring(0, 64) === (await hash(bin))) {
      console.log('Bin file downloaded successfully')
      return bin.arrayBuffer()
    } else {
      throw new Error('Failed to verify file integrity')
    }
  }

  async function downloadAsync (method, url, responseType = 'blob') {
    return fetch(url, { method: method }).then(async (response) => {
      if (response.status === 404) {
        const err = new Error()
        err.message = t('installer.download404')
        throw err
      }
      if (responseType === 'blob') {
        return response.blob()
      } else {
        return response.text()
      }
    })
  }

  async function initInstall () {
    // Function to setup the installation
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
      // Disable WebDFU logging in production
      if (process.env.NODE_ENV === 'production') {
        calculator.device.logDebug = () => {}
      }
      calculator.device.logInfo = logInfo
    } catch (e) {
      console.warn('Error while disabling WebDFU logging')
    }
    progressbar.parentNode.classList.add('progressbar-active')

    setStatus('backingup')
    try {
      storage = await calculator.backupStorage()
      // Ditch all non-python stuff, for convenience.
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
    if (!inRecoveryMode) {
      try {
        await calculator.device.requestOut(11)
        console.log('Protection disabled')
      } catch (e) {}
    }
  }

  function patchUsername (InternalBin) {
    const username = usernameInput.value
    console.log('Setting username to ' + username)
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
}
</script>
<style>
details {
  text-align: justify;
}
summary {
  user-select: none;
  cursor: pointer;
}
details details {
  margin-left: 10px;
}
pre {
  overflow-x: scroll;
}
pre::-webkit-scrollbar {
  height: 5px;
}
pre::-webkit-scrollbar-track {
  background: var(--error-bg);
}
pre::-webkit-scrollbar-thumb {
  background: var(--error-text);
  border-radius: 5pt;
}
</style>
<style scoped>
#thanks {
  font-size: 1.1em;
}
p {
  text-align: justify;
  padding-left: 1.5em;
  padding-right: 1.5em;
  font-size: 1.1em;
}
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

button {
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
  user-select: none;
}
#btn-disconnect {
  background-color: var(--feature-bg-omega);
  border: solid var(--error-text) 1pt;
  backdrop-filter: blur(50px);
  color: var(--foreground);
}
#btn-disconnect:hover {
  background-color: var(--error-text);
  border: solid var(--error-text) 1pt;
  color: var(--upsilon-2);
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
  display: flex;
  justify-content: center;
  align-items: baseline;
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

*[hidden] {
  display: none !important;
}
</style>
