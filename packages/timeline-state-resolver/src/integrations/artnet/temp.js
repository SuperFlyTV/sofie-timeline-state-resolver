// code is taken from artnet nmp package artnet
// this is a temporary file to use appropriate code in artnet/index.ts
// source: https://www.npmjs.com/package/artnet?activeTab=code

let dgram = require('dgram')
let util = require('util')
let EventEmitter = require('events').EventEmitter

let Artnet = function (config) {
	if (!(this instanceof Artnet)) {
		return new Artnet(config)
	}

	let that = this

	config = config || {}

	/* eslint-disable no-multi-spaces */
	let host = config.host || '255.255.255.255'
	let port = parseInt(config.port, 10) || 6454
	let refresh = parseInt(config.refresh, 10) || 4000
	let sendAll = config.sendAll || false

	let socket = dgram.createSocket({ type: 'udp4', reuseAddr: true })

	socket.on('error', function (err) {
		that.emit('error', err)
	})

	if (config.iface && host === '255.255.255.255') {
		socket.bind(port, config.iface, function () {
			socket.setBroadcast(true)
		})
		// /* eslint-disable unicorn/prefer-starts-ends-with */
	} else if (host.match(/255$/)) {
		socket.bind(port, function () {
			socket.setBroadcast(true)
		})
	}

	// Index of the following arrays is the universe
	let data = [] // The 512 dmx channels
	let interval = [] // The intervals for the 4sec refresh
	let sendThrottle = [] // The timeouts
	let sendDelayed = [] // Boolean flag indicating if data should be sent after sendThrottle timeout
	let dataChanged = [] // The highest channel number that had a change. mind that channel counting starts at 1!

	this.data = data

	let startRefresh = function (universe) {
		interval[universe] = setInterval(function () {
			that.send(universe, 512)
		}, refresh)
	}

	// See http://www.artisticlicence.com/WebSiteMaster/User%20Guides/art-net.pdf page 40
	let triggerPackage = function (oem, key, subkey) {
		// /* eslint-disable unicorn/number-literal-case */
		let hOem = (oem >> 8) & 0xff
		let lOem = oem & 0xff

		let header = [65, 114, 116, 45, 78, 101, 116, 0, 0, 153, 0, 14, 0, 0, hOem, lOem, key, subkey]

		// Payload is manufacturer specific
		let payload = Array.apply(null, new Array(512)).map(function () {
			return null
		}, 0)
		// // eslint-disable-next-line unicorn/no-new-buffer
		return new Buffer.alloc(header.concat(payload))
	}

	// Triggers should always be sent, never throttled
	this.sendTrigger = function (oem, key, subkey, callback) {
		let buf = triggerPackage(oem, key, subkey)
		socket.send(buf, 0, buf.length, port, host, callback)
	}

	// See http://www.artisticlicence.com/WebSiteMaster/User%20Guides/art-net.pdf page 45
	let artdmxPackage = function (universe, length) {
		length = parseInt(length, 10) || 2
		if (length % 2) {
			length += 1
		}

		// /* eslint-disable unicorn/number-literal-case */
		let hUni = (universe >> 8) & 0xff
		let lUni = universe & 0xff

		let hLen = (length >> 8) & 0xff
		let lLen = length & 0xff

		let header = [65, 114, 116, 45, 78, 101, 116, 0, 0, 80, 0, 14, 0, 0, lUni, hUni, hLen, lLen]

		if (!data[universe]) {
			data[universe] = Array.apply(null, new Array(512)).map(function () {
				return null
			}, 0)
		}
		// // eslint-disable-next-line unicorn/no-new-buffer
		return new Buffer.alloc(header.concat(data[universe].slice(0, hLen * 256 + lLen)))
	}

	// If refresh is set to true all 512 channels will be sent, otherwise from channel 1 to the last changed channel
	this.send = function (universe, refresh, callback) {
		if (typeof refresh === 'function') {
			callback = refresh
			refresh = false
		}

		if (sendAll) {
			refresh = true
		}

		if (!interval[universe]) {
			startRefresh(universe)
		}

		if (sendThrottle[universe]) {
			sendDelayed[universe] = true
			return
		}

		clearTimeout(sendThrottle[universe])
		sendThrottle[universe] = setTimeout(function () {
			sendThrottle[universe] = null
			if (sendDelayed[universe]) {
				sendDelayed[universe] = false
				that.send(universe, callback)
			}
		}, 25)

		let buf = artdmxPackage(universe, refresh ? 512 : dataChanged[universe])
		dataChanged[universe] = 0
		socket.send(buf, 0, buf.length, port, host, callback)
	}

	/* [ [ uint15 universe, ] uint9 channel, ] uint8 value [, function callback ] */
	/* [ [ uint15 universe, ] uint9 channel, ] array[uint8] values [, function callback ] */
	this.set = function () {
		let universe
		let channel
		let value
		let callback

		if (arguments.length === 4) {
			universe = arguments[0]
			channel = arguments[1]
			value = arguments[2]
			callback = arguments[3]
		} else if (arguments.length === 3) {
			if (typeof arguments[2] === 'function') {
				channel = arguments[0]
				value = arguments[1]
				callback = arguments[2]
			} else {
				universe = arguments[0]
				channel = arguments[1]
				value = arguments[2]
			}
		} else if (arguments.length === 2) {
			if (typeof arguments[1] === 'function') {
				channel = 1
				value = arguments[0]
				callback = arguments[1]
			} else {
				channel = arguments[0]
				value = arguments[1]
			}
		} else if (arguments.length === 1) {
			channel = 1
			value = arguments[0]
		} else {
			return false
		}

		universe = parseInt(universe, 10) || 0

		if (!data[universe]) {
			data[universe] = Array.apply(null, new Array(512)).map(function () {
				return null
			}, 0)
		}

		dataChanged[universe] = dataChanged[universe] || 0

		let index
		if (typeof value === 'object' && value.length > 0) {
			for (let i = 0; i < value.length; i++) {
				index = channel + i - 1
				if (typeof value[i] === 'number' && data[universe][index] !== value[i]) {
					data[universe][index] = value[i]
					if (index + 1 > dataChanged[universe]) {
						dataChanged[universe] = index + 1
					}
				}
			}
		} else if (typeof value === 'number' && data[universe][channel - 1] !== value) {
			data[universe][channel - 1] = value
			if (channel > dataChanged[universe]) {
				dataChanged[universe] = channel
			}
		}

		if (dataChanged[universe]) {
			that.send(universe, callback)
		} else if (typeof callback === 'function') {
			callback(null, null)
		}

		return true
	}

	/* [ [ uint15 oem, ] uint9 subkey, ] uint8 key [, function callback ] */
	this.trigger = function () {
		let oem
		let subkey
		let key
		let callback

		if (arguments.length === 4) {
			oem = arguments[0]
			subkey = arguments[1]
			key = arguments[2]
			callback = arguments[3]
		} else if (arguments.length === 3) {
			if (typeof arguments[2] === 'function') {
				subkey = arguments[0]
				key = arguments[1]
				callback = arguments[2]
			} else {
				oem = arguments[0]
				subkey = arguments[1]
				key = arguments[2]
			}
		} else if (arguments.length === 2) {
			if (typeof arguments[1] === 'function') {
				subkey = 1
				key = arguments[0]
				callback = arguments[1]
			} else {
				subkey = arguments[0]
				key = arguments[1]
			}
		} else if (arguments.length === 1) {
			subkey = 0
			key = arguments[0]
		} else {
			return false
		}

		oem = parseInt(oem, 10) || 65535 // Most devices respond to "0xFFFF", which is considered a triggered broadcast.
		key = parseInt(key, 10) || 255

		that.sendTrigger(oem, key, subkey, callback)

		return true
	}

	this.close = function () {
		let i
		for (i = 0; i < interval.length; i++) {
			clearInterval(interval[i])
		}
		for (i = 0; i < sendThrottle.length; i++) {
			clearTimeout(sendThrottle[i])
		}
		socket.close()
	}

	this.setHost = function (h) {
		host = h
	}

	this.setPort = function (p) {
		if (host === '255.255.255.255') {
			throw new Error("Can't change port when using broadcast address 255.255.255.255")
		} else {
			port = p
		}
	}
}

util.inherits(Artnet, EventEmitter)

module.exports = Artnet
