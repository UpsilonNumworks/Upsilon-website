<template>
  <div id="installer">
    <div class="generic-page" id="installer-container">
      <h1>{{ t('installer.title') }}</h1>
      <div class="installer">
        <div
          v-if="showInfo"
          :class="infoClass"
          id="status-display"
          v-html="statusHTML"
        ></div>
        <button @click="connect" v-if="showButtons" id="btn-connect">
          {{ t('installer.connect') }}
        </button>
        <button @click="recoveryClick" v-if="showButtons" id="btn-recovery">
          {{ t('installer.recovery') }}
        </button>
        <form v-if="showInstaller" id="install-form">
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
          <label v-if="n100" for="select-lang"
            >{{ t('installer.lang') }}:</label
          >

          <CustomSelect
            v-if="n100"
            name="select-lang"
            sid="select-lang"
            @updated="setLang"
            :title="t('installer.lang')"
            :items="
              languages.map((lang) => {
                return { text: t('installer.languages.' + lang), id: lang }
              })
            "
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
            v-model="username"
            maxlength="16"
            type="text"
            name="input-uname"
            id="input-uname"
          />
          <button @click="forceDisconnect" type="button" id="btn-disconnect">
            {{ t('installer.disconnect') }}
          </button>
          <button
            @click="install"
            id="btn-install"
            class="btn-primary"
            type="submit"
          >
            {{ t('installer.install') }}
          </button>
        </form>
        <div v-if="done">
          <span id="thanks"> {{ t('installer.thanks') }}</span>
          <h2>{{ t('installer.whatnext') }}</h2>

          <p>
            {{ t('installer.external') }}
            <a
              @click="forceDisconnect"
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
        <div v-if="showProgressbar" class="progressbar" id="progressbar">
          <div
            class="progressbar-bar"
            id="progressbar-bar"
            :style="`width:${percentage}%`"
          ></div>
        </div>
        <div v-if="showProgressbar" id="progressbar-text"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Numworks from 'numworks.js'
import CustomSelect from '@/components/CustomSelect'

export default defineComponent({
  name: 'InstallerPage',
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
  data () {
    return {
      done: false,
      error: false,
      showInstaller: false,
      showButtons: true,
      showProgressbar: false,
      showInfo: false,
      statusHTML: '',
      calculatorRecovery: new Numworks.Recovery(),
      calculator: new Numworks(),
      storage: null,
      inRecoveryMode: false,
      lastError: 0,
      currentbin: '',
      shouldRestoreStorage: false,
      username: '',
      infoClass: '',
      percentage: 0,
      n100: false,
      theme: 'upsilon_light',
      lang: 'en',
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
      ],
      languages: ['en', 'fr', 'nl', 'pt', 'it', 'de', 'es', 'hu']
    }
  },
  methods: {
    logProgress (done, total) {
      this.percentage = (done / total) * 100
    },
    forceDisconnect () {
      this.calculator.device.device_.close()
      this.setStatus('disconnected')
    },
    disconnect (event) {
      event.preventDefault()
      this.calculator.device.device_.close()
      this.calculator.stopAutoConnect()
      this.recovery.stopAutoConnect()
      this.setStatus('disconnected')
    },
    async connect () {
      await this.calculator.detect(() => {
        this.calculator.stopAutoConnect()
        this.connectedHandler()
      }, this.onError)
    },
    async recoveryClick () {
      const _this = this
      this.calculatorRecovery.detect(async function () {
        await _this.recovery()
      }, this.onError)
    },
    onload () {
      if (!('usb' in navigator)) {
        this.statusHTML = this.t('installer.incompatibleBrowser')
        return
      }

      this.calculator.autoConnect(this.connectedHandler)
      const _this = this
      navigator.usb.addEventListener('disconnect', function (e) {
        _this.calculator.onUnexpectedDisconnect(e, function () {
          _this.calculator.autoConnect(_this.connectedHandler)
          _this.setStatus('disconnected')
        })
      })
    },
    setTheme (item) {
      this.theme = item.id
    },
    setChannel (item) {
      this.channel = item.id
    },
    setLang (item) {
      this.lang = item.id
    },
    logInfo (text) {
      if (text === 'Erasing DFU device memory') {
        this.setStatus('erasing')
      } else if (text === 'Copying data from browser to DFU device') {
        this.setStatus('copying')
      }
      if (process.env.NODE_ENV !== 'production') {
        console.log(text)
      }
    },
    setStatus (status) {
      console.log('Status set to', status)
      switch (status) {
        case 'connected':
          this.done = false
          this.showInstaller = true
          this.showButtons = false
          this.infoClass = 'info'
          console.log('Calculator connected')
          if (this.inRecoveryMode) {
            this.statusHTML = this.t('installer.recoveryConnected')
          } else {
            this.statusHTML = this.t('installer.connected')
          }

          break

        case 'disconnected':
          console.log(new Date().getTime() - this.lastError)
          if (new Date().getTime() - this.lastError < 500) return
          if (this.statusHTML === this.t('installer.waitingForReboot')) {
            return
          }
          this.showButtons = true
          this.showInstaller = false
          this.showProgressbar = false
          this.showInfo = true
          this.infoClass = 'disconnected'
          console.log('Calculator disconnected')
          this.statusHTML = this.t('installer.disconnected')
          break
        case 'backingup':
          this.showProgressbar = true
          this.showInfo = true
          this.showInstaller = false
          this.infoClass = 'info'
          this.statusHTML = this.t('installer.backingup')
          break
        case 'downloading':
          this.statusHTML =
            this.t('installer.downloading') +
            (this.n100
              ? ''
              : (this.currentbin === 'external' ? ' 1' : ' 2') + '/2 ') +
            '...'
          break
        case 'erasing':
          this.statusHTML =
            this.t('installer.erasing') +
            (this.n100
              ? ''
              : (this.currentbin === 'external' ? ' 1' : ' 2') + '/2 ') +
            '...'
          break
        case 'copying':
          this.statusHTML =
            this.t('installer.writing') +
            (this.n100
              ? ''
              : (this.currentbin === 'external' ? ' 1' : ' 2') + '/2 ') +
            '...'
          break
        case 'waitingForReboot':
          this.statusHTML = this.t('installer.waitingForReboot')
          break
        case 'installationDone':
          this.done = true
          this.showButtons = false
          this.showProgressbar = false
          this.showInstaller = false
          this.statusHTML = this.t('installer.done')
          break
        case 'restoring':
          this.statusHTML = this.t('installer.restoring')
          break
        case 'downloadingRecovery':
          this.statusHTML = this.t('installer.downloadingRecovery')
          break
        case 'installingRecovery':
          this.statusHTML = this.t('installer.installingRecovery')
          break
        case 'recoveryDone':
          this.statusHTML = this.t('installer.recoveryDone')
          break
        default:
          throw new Error('Invalid status specified')
      }
    },
    async connectedHandler () {
      this.setStatus('connected')
      if (!this.inRecoveryMode) {
        this.n100 = this.calculator.getModel().toLowerCase() === '0100'
        const PlatformInfo = await this.calculator.getPlatformInfo()
        console.log('PlatformInfo :', PlatformInfo)
        if (PlatformInfo.omega.user) {
          console.log(
            'Setting username input value to ' + PlatformInfo.omega.user
          )
          this.username = PlatformInfo.omega.user
        }
      }
      if (this.shouldRestoreStorage && !this.inRecoveryMode) {
        console.log('Restoring storage', this.shouldRestoreStorage)
        const _this = this
        await this.calculator.installStorage(this.storage, function () {
          console.log('Storage restored successfully')
          _this.setStatus('installationDone')
        })
        this.shouldRestoreStorage = false
      }
    },
    async initInstall () {
      // Function to setup the installation
      if (this.inRecoveryMode) {
        this.calculatorRecovery.device.logProgress = this.logProgress
      }
      try {
        this.calculator.device.logProgress = this.logProgress
      } catch (err) {
        if (!this.inRecoveryMode) {
          console.warn('Error when initializing the progress bar')
        }
      }
      try {
        this.calculator.device.logInfo = this.logInfo
        // Disable WebDFU logging in production
        if (process.env.NODE_ENV === 'production') {
          this.calculator.device.logDebug = () => {}
          // FIXME the following line produces an error
          this.calculatorRecovery.device.logDebug = () => {}
        }
      } catch (e) {
        console.warn('Error while disabling WebDFU logging')
      }
      this.setStatus('backingup')
      try {
        this.storage = await this.calculator.backupStorage()
        // Ditch all non-python stuff, for convenience.
        for (const i in this.storage.records) {
          if (this.storage.records[i].type !== 'py') {
            this.storage.records.splice(i, 1)
          }
        }
        console.log('Storage :', this.storage)
      } catch (e) {
        if (this.storage == null) {
          this.storage = new DataView(new ArrayBuffer())
          console.warn(
            'Error when fetching scripts, creating a new empty storage'
          )
        } else {
          console.log('Error when fetching scripts, kepping old scripts')
        }
      }
      this.logProgress(0, 1)
      if (!this.inRecoveryMode) {
        try {
          await this.calculator.device.requestOut(11)
          console.log('Protection disabled')
        } catch (e) {}
      }
    },
    async getDownloadURL (jsonUrl) {
      return fetch(jsonUrl).then(async (response) => {
        if (response.status === 404) {
          const err = new Error()
          err.message = this.t('installer.download404')
          throw err
        }
        const json = await response.json()
        return jsonUrl + '?alt=media&token=' + json.downloadTokens
      })
    },
    async downloadAsync (method, url, responseType = 'blob') {
      return fetch(url, { method: method }).then(async (response) => {
        if (response.status === 404) {
          const err = new Error()
          err.message = this.t('installer.download404')
          throw err
        }
        if (responseType === 'blob') {
          return response.blob()
        } else {
          return response.text()
        }
      })
    },
    async hash (blob) {
      const msgUint8 = await blob.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    },
    async downloadBin (name, model) {
      const mirror =
        'https://firebasestorage.googleapis.com/v0/b/upsilon-binfiles.appspot.com/o/'

      let fwname = ''
      if (name !== 'flasher') {
        fwname += 'epsilon.onboarding'
        if (this.channel === 'beta') {
          fwname += '.' + this.theme
        }
        if (model.toLowerCase() === 'n0100') {
          fwname += '.' + this.lang
        }
        fwname += '.' + name + '.bin'
      } else {
        fwname = 'flasher.verbose.bin'
      }
      const jsonUrl = `${mirror}${this.channel}%2F${
        model.toLowerCase() === 'n0100' ? 'n100' : 'n110'
      }%2F${fwname}`
      const binUrl = await this.getDownloadURL(jsonUrl)
      const shaUrl = await this.getDownloadURL(jsonUrl + '.sha256')

      console.log('Downloading ' + fwname)
      const bin = await this.downloadAsync('GET', binUrl, 'blob')
      const checksum = await this.downloadAsync('GET', shaUrl, 'text')
      if (checksum.substring(0, 64) === (await this.hash(bin))) {
        console.log('Bin file downloaded successfully')
        return bin.arrayBuffer()
      } else {
        throw new Error('Failed to verify file integrity')
      }
    },
    patchUsername (InternalBin) {
      console.log('Setting username to ' + this.username)
      if (this.username) {
        const internalBuf = new Uint8Array(InternalBin)

        const enc = new TextEncoder()
        let encoded = enc.encode(this.username + '\0')
        if (encoded.length > 16) {
          encoded[15] = 0
          encoded = encoded.slice(0, 16)
        }
        internalBuf.set(encoded, 0x1f8)
      }
    },
    async install (event) {
      event.preventDefault()
      try {
        await this.initInstall()
        const model = this.calculator.getModel()
        console.log('Model : ' + model)
        if (model === '0100') {
          this.setStatus('downloading')
          const bin = await this.downloadBin('internal', 'N0100')
          this.patchUsername(bin)
          await this.calculator.flashInternal(bin)
        } else if (model === '0110') {
          this.currentbin = 'external'
          this.setStatus('downloading')
          const externalBin = await this.downloadBin('external', 'N0110')
          await this.calculator.flashExternal(externalBin)
          console.log('downloading internal')
          this.currentbin = 'internal'
          this.setStatus('downloading')
          this.logProgress(0, 1)
          const internalBin = await this.downloadBin('internal', 'N0110')
          this.patchUsername(internalBin)
          await this.calculator.flashInternal(internalBin)
        } else {
          throw new Error(this.t('installer.unsupportedModel') + ':' + model)
        }

        this.setStatus('waitingForReboot')
        this.inRecoveryMode = false
        this.shouldRestoreStorage = true
      } catch (error) {
        this.lastError = new Date().getTime()
        this.onError(error)
      } finally {
        this.showButtons = false
        this.showProgressbar = false
      }
    },
    async recovery () {
      // Flash Upsilon's recovery on the calculator
      try {
        this.inRecoveryMode = true
        await this.initInstall()
        const model = this.calculatorRecovery.getModel()
        console.log('Model : ' + model)
        console.log('Downloading recovery')
        this.setStatus('downloadingRecovery')
        const flasher = await this.downloadBin('flasher', 'N' + model)
        console.log('Flashing recovery')
        this.setStatus('installingRecovery')
        await this.calculatorRecovery.flashRecovery(flasher)
        console.log('Recovery flashed successfully')
        this.setStatus('recoveryDone')
      } catch (error) {
        this.onError(error)
      } finally {
        this.shouldRestoreStorage = true
      }
    },
    onError (err) {
      if (typeof err === 'string') {
        err = new Error(err)
      }
      this.statusHTML = this.t('installer.error') + ': ' + err.message

      if (
        err.message.includes(
          "Cannot set properties of null (setting 'startAddress')"
        )
      ) {
        this.statusHTML +=
          '<br> <b>' + this.t('installer.hints.DisableProtection') + '</b>'
      } else if (err.message.includes('Unable to claim interface')) {
        this.statusHTML +=
          '<br> <b>' + this.t('installer.hints.closeOtherTabs') + '</b>'
      } else if (err.message.includes('No device selected')) {
        this.statusHTML +=
          '<br>' +
          this.t('installer.hints.noDeviceSelected.text1') +
          '<ul style="text-align:left"><li>' +
          this.t('installer.hints.noDeviceSelected.li1') +
          '</li><li><details><summary>' +
          this.t('installer.hints.noDeviceSelected.li2') +
          '</summary><details><summary>Linux</summary>' +
          this.t('installer.hints.noDeviceSelected.driverHint.download') +
          ' <a href="https://cdn.numworks.com/assets/files/my/drivers/linux/50-numworks-calculator-f2be8a48f68f1ee4d88c997c35194960.rules">' +
          this.t('installer.hints.noDeviceSelected.driverHint.linux.thisfile') +
          '</a> ' +
          this.t(
            'installer.hints.noDeviceSelected.driverHint.linux.linuxMoveIt'
          ) +
          '<br>' +
          this.t('installer.hints.noDeviceSelected.driverHint.linux.command') +
          '<pre>wget https://cdn.numworks.com/assets/files/my/drivers/linux/50-numworks-calculator-f2be8a48f68f1ee4d88c997c35194960.rules && sudo mv 50-numworks-calculator-f2be8a48f68f1ee4d88c997c35194960.rules /etc/udev/rules.d </pre>' +
          '</details><details><summary>Windows</summary>' +
          this.t('installer.hints.noDeviceSelected.driverHint.download') +
          ' ' +
          this.t('installer.hints.noDeviceSelected.driverHint.andInstall') +
          ' <a href="https://cdn.numworks.com/assets/files/my/drivers/windows/numworks-driver-win64-81cc6426fa4548ecc57076d876779da1.msi">' +
          this.t('installer.hints.noDeviceSelected.driverHint.theDriver') +
          '</a> ' +
          this.t('installer.hints.noDeviceSelected.driverHint.rebootAfter') +
          '</details>' +
          '</details>' +
          '</li></ul><details><summary>' +
          this.t('installer.hints.noDeviceSelected.moreHelp.needHelp') +
          '</summary>' +
          this.t('installer.hints.noDeviceSelected.moreHelp.tryRecovery') +
          '<br>' +
          this.t('installer.hints.noDeviceSelected.moreHelp.1') +
          ' <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/FSnX3tUu">' +
          this.t('installer.hints.noDeviceSelected.moreHelp.discord') +
          '</a> ' +
          this.t('installer.hints.noDeviceSelected.moreHelp.2') +
          '</details>'
      } else if (err.message.endsWith('????')) {
        this.statusHTML +=
          '<br>' +
          this.t('installer.e16.message') +
          '<br>' +
          this.t('installer.e16.beforeLink') +
          ' <a href="https://tiplanet.org/forum/viewtopic.php?f=113&t=25191&p=263495#p263495">' +
          this.t('installer.e16.link') +
          '</a>'
      } else if (err.message.includes('A transfer error has occurred')) {
        this.statusHTML +=
          '<br>' +
          this.t('installer.tError.text') +
          '<ul><li>' +
          this.t('installer.tError.li1') +
          '</li><li>' +
          this.t('installer.tError.li2') +
          '</li><li>' +
          this.t('installer.tError.li3') +
          '</li></ul>'
      }
      this.infoClass = 'error'
      this.showButtons = true
      this.showInfo = true
      throw err
    }
  }
})
</script>
<style>
ul {
  text-align: left;
}
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
  overflow: hidden;
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
</style>
