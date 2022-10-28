export function unpack (buffer) {
  const internalSize = 64 * 1024
  const internalAddress = 0x8000000
  const internal = new Uint8Array(new ArrayBuffer(internalSize)).fill(255, 0, internalSize)
  const externalSize = 8 * 1024 * 1024
  const externalAddress = 0x90000000
  const external = new Uint8Array(new ArrayBuffer(externalSize)).fill(255, 0, externalSize)

  const fw = new Struct(buffer)
  const prefix = '[dfu-unpack]'
  // Read header
  let magik = fw.string(5)
  if (magik !== 'DfuSe') { throw Error('Invalid magik number ' + magik) }
  if (fw.byte(buffer) !== 1) { throw Error('Unsupported file version') }
  const totalSize = fw.uint32LE()
  const imgCount = fw.byte()
  console.log('Found', imgCount, 'image(s), total size:', totalSize)
  for (let i = 0; i < imgCount; i++) {
    magik = fw.string(6)
    if (magik !== 'Target') { throw Error('Invalid magik number ' + magik) }
    const alternate = fw.byte()
    const named = fw.uint32LE()
    const name = fw.string(255).split('\0')[0]

    const imageSize = fw.uint32LE()
    const elements = fw.uint32LE()
    console.table({ alternate, named, name, imageSize, elements })
    for (let j = 0; j < elements; j++) {
      const address = fw.uint32LE()
      const elementSize = fw.uint32LE()
      const data = new Uint8Array(fw.arrayBuffer(elementSize))
      if (address >= internalAddress && address + elementSize <= internalAddress + internalSize) {
        console.log(prefix, 'Element', j, ': Address:', address, 'elementSize:', elementSize, '<internal>')
        for (let k = 0; k < elementSize; k++) {
          internal[k + address - internalAddress] = data[k]
        }
      } else if (address >= externalAddress && address + elementSize <= externalAddress + externalSize) {
        console.log(prefix, 'Element', j, ': Address:', address, 'elementSize:', elementSize, '<external>')
        for (let k = 0; k < elementSize; k++) {
          external[k + address - externalAddress] = data[k]
        }
      } else {
        console.log(prefix, 'Element', j, ': Address:', address, 'elementSize:', elementSize, '<unknown>')
      }
    }
  }
  const r = []
  if (internal.filter((value) => value !== 255).length !== 0) {
    r.push(new File([internal], 'dfu-internal.bin'))
  }
  r.push(new File([external], 'dfu-external.bin'))
  return r
}

class Struct {
  constructor (buffer) {
    this.buffer = buffer
    this.index = 0
  }

  byte () {
    this.index += 1
    return new Uint8Array(this.buffer)[parseInt(this.index - 1)]
  }

  string (length) {
    this.index += length
    return new TextDecoder().decode(this.buffer.slice(this.index - length, parseInt(this.index)))
  }

  arrayBuffer (length) {
    this.index += length
    return this.buffer.slice(this.index - length, parseInt(this.index))
  }

  uint32LE () {
    this.index += 4
    return new Uint32Array(this.buffer.slice(this.index - 4, this.index))[0]
  }
}
