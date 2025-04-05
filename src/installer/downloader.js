export async function downloadBin (name, model, channel, theme, lang, t) {
  const mirror =
        'https://firebasestorage.googleapis.com/v0/b/upsilon-binfiles.appspot.com/o/'

  let fwname = ''
  if (name === 'flasher') {
    fwname = 'flasher.verbose.bin'
  } else if (name === 'bootloader') {
    fwname = 'bootloader.bin'
  } else {
    fwname += 'epsilon.onboarding'
    if (name !== 'bootloader' || name !== 'A' || name !== 'B') {
      fwname += '.' + name
    }
    if (channel === 'beta' || channel === 'official') {
      fwname += '.' + theme
    }
    if (model.toLowerCase() === 'n0100' && lang !== 'en') {
      fwname += '.' + lang
    }
    fwname += '.' + name + '.bin'
  }

  const jsonUrl = `${mirror}${channel}%2F${model.toLowerCase() === 'n0100' ? 'n100' : 'n110'
        }%2F${fwname}`
  console.log('Downloading ' + fwname)
  const binUrl = await getDownloadURL(jsonUrl, t)
  const shaUrl = await getDownloadURL(jsonUrl + '.sha256', t)

  const bin = await downloadAsync('GET', binUrl, t, 'blob')
  const checksum = await downloadAsync('GET', shaUrl, t, 'text')
  if (checksum.substring(0, 64) === (await hash(bin))) {
    console.log('Bin file downloaded successfully')
    return bin.arrayBuffer()
  } else {
    throw new Error('Failed to verify file integrity')
  }
}
export async function getDownloadURL (jsonUrl, t) {
  return fetch(jsonUrl).then(async (response) => {
    if (response.status === 404) {
      const err = new Error()
      err.message = t('installer.download404')
      throw err
    }
    const json = await response.json()
    return jsonUrl + '?alt=media&token=' + json.downloadTokens
  })
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
