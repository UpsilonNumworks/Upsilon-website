export async function downloadBin (name, model, channel, theme, lang, t) {
  const mirror =
        'https://yaya-cout.github.io/Upsilon-binfiles/binaries/'

  let fwname = ''
  if (name === 'flasher') {
    fwname = 'flasher.verbose.bin'
  } else if (name === 'bootloader') {
    fwname = 'bootloader.bin'
  } else {
    fwname += 'epsilon.onboarding'
    if (channel === 'beta' || channel === 'official') {
      fwname += '.' + theme
    }
    if (model.toLowerCase() === 'n0100') {
      fwname += '.' + lang
    }
    fwname += '.' + name
    fwname += '.bin'
  }

  const jsonUrl = `${mirror}${channel}/${model.toLowerCase() === 'n0100' ? 'n100' : 'n110'
        }%2F${fwname}`
  console.log('Downloading ' + fwname)
  const binUrl = jsonUrl
  const shaUrl = jsonUrl + '.sha256'

  const bin = await downloadAsync('GET', binUrl, t, 'blob')
  const checksum = await downloadAsync('GET', shaUrl, t, 'text')
  if (checksum.substring(0, 64) === (await hash(bin))) {
    console.log('Bin file downloaded successfully')
    return bin.arrayBuffer()
  } else {
    throw new Error('Failed to verify file integrity')
  }
}

export async function downloadAsync (method, url, t, responseType = 'blob') {
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

export async function hash (blob) {
  const msgUint8 = await blob.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
