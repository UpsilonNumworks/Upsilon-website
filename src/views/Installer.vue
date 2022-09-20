<template>
  <div id="installer">
    <div class="generic-page" id="installer-container">
      <h1>{{ t('installer.title') }}</h1>
      <div class="installer">
        <div v-if="showInfo" :class="infoClass" id="status-display" v-html="statusHTML"></div>
        <button @click="connect" v-if="showButtons" id="btn-connect">
          {{ t('installer.connect') }}
        </button>
        <button @click="recoveryClick" v-if="showButtons" id="btn-recovery">
          {{ t('installer.recovery') }}
        </button>
        <form v-if="showInstaller" id="install-form">
          <label for="select-channel">{{ t('installer.releaseChannel') }} :</label>
          <CustomSelect name="select-channel" sid="select-channel" @updated="setChannel"
            :title="t('installer.releaseChannel')" :items="[
              {
                text: t('installer.channels.master.title'),
                id: 'official',
                description: t('installer.channels.master.description')
              },
              {
                text: t('installer.channels.beta.title'),
                id: 'beta',
                description: t('installer.channels.beta.description')
              },
              {
                text: t('installer.channels.dev.title'),
                id: 'dev',
                description: t('installer.channels.dev.description')
              },
              {
                text: t('installer.channels.custom.title'),
                id: 'custom',
                description: t('installer.channels.custom.description')
              }
            ]">
          </CustomSelect>
          <label v-if="n100" for="select-lang">{{ t('installer.lang') }}:</label>

          <CustomSelect v-if="n100" name="select-lang" sid="select-lang" @updated="setLang" :title="t('installer.lang')"
            :items="
              languages.map((lang) => {
                return { text: t('installer.languages.' + lang), id: lang }
              })
            ">
          </CustomSelect>
          <label v-if="channel === 'beta' || channel === 'official'" for="select-theme">{{ t('installer.theme') }}
            :</label>
          <CustomSelect v-if="channel === 'beta' || channel === 'official'" name="select-theme" sid="select-theme"
            @updated="setTheme" :title="t('installer.theme')" :items="
              themes.map((theme) => {
                return {
                  text: t('installer.themes.' + theme),
                  imgSrc: '/themes/' + theme + '.webp',
                  id: theme
                }
              })
            ">
          </CustomSelect>
          <label v-if="channel ==='custom'" for="input-file">{{t('installer.custom.customFile')}}</label>
          <input v-if="channel ==='custom'" @change="updateFiles" id="input-file" name="input-file" type="file" multiple/>
          <label v-if="channel !== 'custom'" for="input-uname">{{ t('installer.username') }} :</label>
          <div v-if="channel === 'custom'" id="file-list">
            <tr v-for="binary in binaries" :key="'file-display-'+binary.uuid">
              <td>
                0x
                <input :value="binary.address.toString(16)" type="text" :id="'address-input-'+ binary.uuid">

              </td><td class="file-display">
                {{ binary.file.name }}
              </td>
              <td><button class="icon-button ic-up"></button></td>
              <td><button class="icon-button ic-down"></button></td>
              <td><button @click="(event )=>{event.preventDefault();removeFile(binary.uuid)}" class="icon-button ic-delete"></button></td>
            </tr>
          </div>
          <input v-if="channel !== 'custom'" v-model="username" maxlength="15" type="text" name="input-uname"
            id="input-uname" />
          <label v-if="!n100 && channel !== 'custom'" for="select-slot">{{t('installer.slot')}}:</label>
          <select v-if="!n100 && channel !== 'custom'" v-model="slot" name="select-slot" id="select-slot">
            <option value="A">A</option>
            <option value="B">B</option>
            <option :disabled="modelUnknown || !internalAvailable" value="legacy">{{t('installer.noSlots')}}</option>
          </select>
          <button @click="forceDisconnect" type="button" id="btn-disconnect">
            {{ t('installer.disconnect') }}
          </button>
          <button @click="install" id="btn-install" class="btn-primary" type="submit">
            {{ t('installer.install') }}
          </button>

        </form>
        <div v-if="done">
          <span id="thanks"> {{ t('installer.thanks') }}</span>
          <h2>{{ t('installer.whatnext') }}</h2>

          <p>
            {{ t('installer.external') }}
            <a @click="forceDisconnect" href="https://upsilonnumworks.github.io/Upsilon-External/" target="_blank"
              rel="noopener noreferrer">{{ t('installer.gothere') }}</a>
          </p>
          <p>
            {{ t('installer.jointhe') }}
            <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/X2TWhh9">
              {{ t('installer.joinDiscord') }}
            </a>
          </p>
        </div>
        <div v-if="showProgressbar" class="progressbar" id="progressbar">
          <div class="progressbar-bar" id="progressbar-bar" :style="`width:${percentage}%`"></div>
        </div>
        <div v-if="showProgressbar" id="progressbar-text"></div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomSelect from '@/components/CustomSelect'
import { unpack } from '@/installer/dfuHelper.js'
import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js'
import untar from 'js-untar'
import pako from 'pako'
import Numworks from 'upsilon.js'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

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
      internalAvailable: false,
      shouldRestoreStorage: false,
      username: '',
      infoClass: '',
      percentage: 0,
      n100: false,
      modelUnknown: false,
      theme: 'upsilon_light',
      lang: 'en',
      channel: 'official',
      slot: 'A',
      slots: ['A', 'B'],
      binaries: [],
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
        'omega_freenumworks'
      ],
      languages: ['en', 'fr', 'nl', 'pt', 'it', 'de', 'es', 'hu']
    }
  },
  methods: {
    async addFile (file) {
      if (file.name.endsWith('.sha256')) return
      if (file.name.endsWith('.tgz') || file.name.endsWith('.tar.gz')) {
        let buf = await file.arrayBuffer()
        buf = await pako.inflate(buf).buffer
        const files = await untar(buf)
        files.forEach((f) => this.addFile(new File([f.blob], f.name)))
      } else if (file.name.endsWith('.zip')) {
        const zipFileReader = new BlobReader(file)
        const zipReader = new ZipReader(zipFileReader)
        for (const entry of await zipReader.getEntries()) {
          const outWriter = new BlobWriter()
          await entry.getData(outWriter)
          const out = new File([await outWriter.getData()], entry.filename)
          this.addFile(out)
        }
        await zipReader.close()
      } else if (file.name.endsWith('.dfu')) {
        // Unpack DFU and add both files
        unpack(await file.arrayBuffer()).forEach((f) => this.addFile(f))
      } else {
        let address = 0x00000000
        if (file.name.includes('internal') || file.name.includes('bootloader')) {
          address = 0x08000000
        } else if (file.name.includes('external') || file.name.includes('A')) {
          address = 0x90000000
        } else if (file.name.includes('B')) {
          address = 0x90400000
        }
        this.binaries.push({ address: address, uuid: Math.floor(Math.random() * 1000000), file: file })
      }
    },
    removeFile (uuid) {
      console.log('Removing file ' + uuid)
      this.binaries = this.binaries.filter((binary) => { return binary.uuid !== uuid })
    },
    updateFiles () {
      const files = document.getElementById('input-file').files

      for (const file of files) {
        this.addFile(file)
      }
    },
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
        this.showButtons = false
        this.showInfo = true
        this.infoClass = 'error'
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
          this.showInfo = true
          this.infoClass = 'info'
          console.log('Calculator connected')
          if (this.inRecoveryMode) {
            this.statusHTML = this.t('installer.recoveryConnected')
          } else if (!this.internalAvailable) {
            this.statusHTML = this.t('installer.internalUnavailable')
            this.infoClass = 'warning'
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
          this.done = false
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
          this.showButtons = false
          this.statusHTML = this.t('installer.downloadingRecovery')
          break
        case 'installingRecovery':
          this.statusHTML = this.t('installer.installingRecovery')
          break
        case 'recoveryDone':
          this.showProgressbar = false
          this.statusHTML = this.t('installer.recoveryDone')
          break
        case 'unknownModelDone':
          this.showProgressbar = false
          this.done = true
          this.statusHTML = this.t('installer.unknownModelDone')
          break
        case 'unknownConnected':
          this.modelUnknown = true
          this.showInfo = true
          this.infoClass = 'warning'
          this.statusHTML = this.t('installer.unknownModelConnected.text') +
            '<ul>' +
            '<li>' +
            this.t('installer.unknownModelConnected.li1') +
            '</li>' +
            '<li>' +
            this.t('installer.unknownModelConnected.li2') +
            '</ul>'
          break
        default:
          throw new Error('Invalid status specified')
      }
    },
    async connectedHandler () {
      this.modelUnknown = false
      this.internalAvailable = this.calculator.device.settings.name.includes('0x08000000/04*016Kg')
      this.setStatus('connected')
      if (this.calculator.getModel() === '????') {
        this.setStatus('unknownConnected')
      }
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
          this.calculator.device.logDebug = () => { }
          // FIXME the following line produces an error
          this.calculatorRecovery.device.logDebug = () => { }
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
          console.log('Error when fetching scripts, keeping old scripts')
        }
      }
      this.logProgress(0, 1)
      if (!this.inRecoveryMode) {
        try {
          await this.calculator.device.requestOut(11)
          console.log('Protection disabled')
        } catch (e) { }
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
    downloadAsync (method, url, responseType = 'blob') {
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
      if (name === 'flasher') {
        fwname = 'flasher.verbose.bin'
      } else if (name === 'bootloader') {
        fwname = 'bootloader.bin'
      } else {
        fwname += 'epsilon.onboarding'
        if (this.channel === 'beta' || this.channel === 'official') {
          fwname += '.' + this.theme
        }
        if (model.toLowerCase() === 'n0100') {
          fwname += '.' + this.lang
        }
        fwname += '.' + name + '.bin'
      }

      const jsonUrl = `${mirror}${this.channel}%2F${model.toLowerCase() === 'n0100' ? 'n100' : 'n110'
        }%2F${fwname}`
      console.log('Downloading ' + fwname)
      const binUrl = await this.getDownloadURL(jsonUrl)
      const shaUrl = await this.getDownloadURL(jsonUrl + '.sha256')

      const bin = await this.downloadAsync('GET', binUrl, 'blob')
      const checksum = await this.downloadAsync('GET', shaUrl, 'text')
      if (checksum.substring(0, 64) === (await this.hash(bin))) {
        console.log('Bin file downloaded successfully')
        return bin.arrayBuffer()
      } else {
        throw new Error('Failed to verify file integrity')
      }
    },
    patchUsername (bin) {
      console.log('Setting username to ' + this.username)
      if (this.username) {
        const buf = new Uint8Array(bin)

        const enc = new TextEncoder()
        let encoded = enc.encode(this.username + '\0')
        if (encoded.length > 16) {
          encoded[15] = 0
          encoded = encoded.slice(0, 16)
        }
        if (this.slot === 'legacy') {
          buf.set(encoded, 0x1f8)
        } else {
          buf.set(encoded, 0x1003C)
          // Assert that the patched slot is A or B
          if (this.slot !== 'A' && this.slot !== 'B') {
            throw new Error('Slot is not A or B')
          }
        }
      }
    },
    async install (event) {
      event.preventDefault()
      try {
        await this.initInstall()
        const model = this.calculator.getModel()
        console.log('Model : ' + model)
        if (this.channel === 'custom') {
          console.table(this.binaries)
          for (const [index, binary] of this.binaries.entries()) {
            console.log('Installing binary ', index + 1, 'of', this.binaries.length)
            this.calculator.device.startAddress = binary.address
            await this.calculator.device.do_download(this.calculator.transferSize, await binary.file.arrayBuffer(), false)
          }
          return
        }
        if (model === '0100') {
          this.setStatus('downloading')
          const bin = await this.downloadBin('internal', 'N0100')
          this.patchUsername(bin)
          await this.calculator.flashInternal(bin)
        } else if (model === '????' || !this.internalAvailable) {
          this.currentbin = 'external'
          this.setStatus('downloading')
          const externalBin = await this.downloadBin(this.slot, 'N0110')
          if (this.slot === 'B') {
            this.calculator.device.startAddress = 0x90400000
            await this.calculator.device.do_download(this.calculator.transferSize, externalBin, false)
          } else {
            await this.calculator.flashExternal(externalBin)
          }
          this.setStatus('unknownModelDone')
          this.showButtons = false
          this.showProgressbar = false
          this.inRecoveryMode = false
          this.shouldRestoreStorage = true
          return
        } else if (model === '0110') {
          this.currentbin = 'external'
          this.setStatus('downloading')
          const externalBin = await this.downloadBin(this.slot === 'legacy' ? 'external' : this.slot, 'N0110')
          // Patch the username on slot A and B if we're not in legacy mode
          if (this.slot !== 'legacy') {
            this.patchUsername(externalBin)
          }
          if (this.slot === 'B') {
            this.calculator.device.startAddress = 0x90400000
            await this.calculator.device.do_download(this.calculator.transferSize, externalBin, false)
          } else {
            await this.calculator.flashExternal(externalBin)
          }
          console.log('downloading internal')
          this.currentbin = 'internal'
          this.setStatus('downloading')
          this.logProgress(0, 1)

          const internalBin = await this.downloadBin(this.slot === 'legacy' ? 'internal' : 'bootloader', 'N0110')
          // Patch the username in we're in legacy mode
          if (this.slot === 'legacy') {
            this.patchUsername(internalBin)
          }
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
        this.channel = 'beta' // FIXME we use beta channel as there is no flasher in official
        const flasher = await this.downloadBin('flasher', 'N' + model)
        console.log('Flashing recovery')
        this.setStatus('installingRecovery')
        await this.calculatorRecovery.flashRecovery(flasher)
        console.log('Recovery flashed successfully')
        this.setStatus('recoveryDone')
        this.channel = 'official' // FIXME we use beta channel as there is no flasher in official
      } catch (error) {
        this.onError(error)
      } finally {
        this.shouldRestoreStorage = true
      }
    },
    onError (err) {
      try {
        this.forceDisconnect()
      } catch { }
      if (typeof err === 'string') {
        err = new Error(err)
      }
      this.statusHTML = this.t('installer.error') + ': ' + err.message
      this.infoClass = 'error'
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
        this.infoClass = 'warning'
        this.statusHTML +=
          '<br>' +
          this.t('installer.hints.noDeviceSelected.text1') +
          '<ul style="text-align:left"><li>' +
          this.t('installer.hints.noDeviceSelected.li1') +
          '</li><li><details><summary>' +
          this.t('installer.hints.noDeviceSelected.li2') +
          '</summary><details><summary>Linux</summary>' +
          this.t('installer.hints.noDeviceSelected.driverHint.download') +
          ' <a href="https://cdn.numworks.com/f2be8a48/50-numworks-calculator.rules">' +
          this.t('installer.hints.noDeviceSelected.driverHint.linux.thisfile') +
          '</a> ' +
          this.t(
            'installer.hints.noDeviceSelected.driverHint.linux.linuxMoveIt'
          ) +
          '<br>' +
          this.t('installer.hints.noDeviceSelected.driverHint.linux.command') +
          '<pre>wget https://cdn.numworks.com/f2be8a48/50-numworks-calculator.rules /etc/udev/rules.d </pre>' +
          '</details><details><summary>Windows</summary>' +
          this.t('installer.hints.noDeviceSelected.driverHint.download') +
          ' ' +
          this.t('installer.hints.noDeviceSelected.driverHint.andInstall') +
          ' <a href="https://cdn.numworks.com/81cc6426/numworks-driver-win64.msi">' +
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
          ' <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/X2TWhh9">' +
          this.t('installer.hints.noDeviceSelected.moreHelp.discord') +
          '</a> ' +
          this.t('installer.hints.noDeviceSelected.moreHelp.2') +
          '</details>'
      } else if (err.message.endsWith('Address 90000000 outside of memory map')) {
        this.statusHTML +=
          '<br>' +
          this.t('installer.e16.message') +
          '<br>' +
          this.t('installer.e16.beforeLink') +
          ' <a href="https://guide.getomega.dev/">' +
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
          '</li><li>' +
          this.t('installer.tError.li4') +
          '</li></ul>'
      }
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
select {
  border: solid var(--upsilon-1) 2pt;
  border-radius: 3px;
  background-color: var(--upsilon-2);
  color: var(--foreground);
  margin: .5em;
  padding: .5em;
  font-size: 1.1em;
  text-align: center;
}

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

.warning {
  border: grey 1pt solid;
  backdrop-filter: blur(50px) saturate(0.5);
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

#file-list {
  grid-column: 1 / 3;
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
  border: 2px solid var(--upsilon-1);
  /* FIXME */
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
  max-width: 500px;
  margin: auto;
  padding: 1em;
  border-radius: 5px;
}

#install-form>* {
  display: block;
}

label {
  user-select: none;
}

#install-form>label,
#install-form>input {
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

.icon-button {
  border: none;
  background: none;
  padding: unset;
}

.ic-delete::after {
  content: '\f1f8';
}

.ic-up::after {
  content: '\f077';
}

.ic-down::after {
  content: '\f078';
}

.icon-button::after {
  font-weight: 900;
  font-family: "Font Awesome 5 Free";
  color: var(--foreground);
  display: block;
}
</style>
