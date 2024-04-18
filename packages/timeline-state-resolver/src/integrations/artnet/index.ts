import {
	// ActionExecutionResult,
	DeviceStatus,
	DeviceType,
	Timeline,
	TSRTimelineContent,
	ArtNetCommandContent,
	ArtNetOptions,
	StatusCode,
	ActionExecutionResult,
	ArtNetDeviceCommand,
	Mappings,
	MappingArtnetChannels,
	Mapping
} from 'timeline-state-resolver-types'
import { CommandWithContext, Device } from '../../service/device'
// import * as artnet from 'artnet'

// import Debug from 'debug'
// const debug = Debug('timeline-state-resolver:artnet')
// import _ = require('underscore')
// import { Easing } from '../../devices/transitions/easings'
// import { assertNever } from '../../lib'
// import { StateHandler } from 'src/service/stateHandler'

export interface ArtNetDeviceStateNew {
	device: string
	data: channelData
}

enum channelBehaviour {
	HIGHEST = 'highest',
	LOWEST = 'lowest',
	LAST = 'last',
	INVERT = 'invert',
}

interface channelData {
	channel: number
	value: number
	behavious: channelBehaviour
}

export interface ArtNetDeviceState {
	[channel: string]: ArtNetDeviceStateContent
}

interface ArtNetDeviceStateContent {
	fromTLObject: string
	value: number
}

export interface ArtNetCommandWithContext extends CommandWithContext{
	command: ArtNetDeviceCommand
	context: string 
	timelineObjId: string
}

// needs somthing to resolvew timeline names, this may not be the place
// commented out
export interface TimelineContentArtNetValues extends ArtNetCommandContent {

}

interface ArtNetUniverse {

	host: string
	port: number
	refresh: number
	sendAll: boolean
	mode: string


	data: number[]
	interval: any[]
	sendThrottle: any[]
	sendDelayed: any[]
	dataChanged: any[]
}


export class ArtNetDevice extends Device<ArtNetOptions, ArtNetDeviceState, ArtNetCommandWithContext>{
	
	actions!: Record<string, (id: string, payload?: Record<string, any> | undefined) => Promise<ActionExecutionResult>>
	
	options!: ArtNetOptions
	
	deviceState!: ArtNetDeviceState 


	// private _ArtNetClient!: 
	private _ArtNetClientStatus: 'connected' | 'disconnected' = 'disconnected'
	// private transitions: {
	// 	[value: number]: {
	// 		started: number
	// 	} & ArtNetDeviceStateContent

	// }
	get status() {
		return this._ArtNetClientStatus
	}

	get DeviceType() {
		return DeviceType.ARTNET
	}

	async init(options: ArtNetOptions): Promise<boolean> {
		this.options = options
		return true
	}
	async terminate(): Promise<void> {
		// this._terminated = true
	}
	get connected(): boolean {
		return false
	}
	getStatus(): Omit<DeviceStatus, 'active'> {
		return {
			statusCode: StatusCode.GOOD,
			messages: [],
		}
	}

	// still under work
	convertTimelineStateToDeviceState(
			state: Timeline.TimelineState<TSRTimelineContent>,
			mappings: Mappings
		): ArtNetDeviceState {

		// TODO: Convert the timeline state into your own (internal) ArtNetState
		// Tip: This is where you put the logic for "highest takes precedence"

		const addrToArtNetMessage: ArtNetDeviceState = {
			
		}

		Object.values<Timeline.ResolvedTimelineObjectInstance<TSRTimelineContent>>(state.layers).forEach((layer) => {

			const map = mappings[layer.layer] as Mapping<MappingArtnetChannels> | undefined
			
			if (layer.content.deviceType === DeviceType.ARTNET && map) {

				let newValues = layer.content.values // { dimmer: 42 }
				let channelMapping = map.options.featureChannels // { dimmer: [1], RGB: [2,3,4], range: 12-24 }


				// has some issus with mapping channels and timeline values when arrays are of different length 
				Object.entries(channelMapping).forEach(([key, artnetChannels]) => {
					const channelValues = newValues[key] // 42
					if (channelValues == null) return // Skip if no values

					// single channel and single value
					// e.g. channel 2, value 255: 2:255
					if (typeof channelValues === "number" && typeof artnetChannels === "number") {
						addrToArtNetMessage[(map.options.universe).toString() + ":" + (artnetChannels).toString()] = {
							fromTLObject: layer.id,
							value: channelValues
						}
					}
					// single channel and array of values, use first value
					// e.g. channel 2, value [127, 255]: 2:127
					else if (Array.isArray(channelValues) && typeof artnetChannels === "number") {
						addrToArtNetMessage[(map.options.universe).toString() + ":" + (artnetChannels).toString()] = {
							fromTLObject: layer.id,
							value: channelValues[0]
						}
					}
					// array of channels and single value, all channels the same value
					// e.g. channel [2,3,4], value 255: 2:255, 3:255 etc.
					else if (typeof channelValues === "number" && Array.isArray(artnetChannels)) {
						addrToArtNetMessage[(map.options.universe).toString() + ":" + (artnetChannels).toString()] = {
							fromTLObject: layer.id,
							value: channelValues
						}
					}
					// array of channels and array of values
					// e.g. channel [2,3,4], values [255,255,255]
					// close but not quite right, needs to fill with 0 correctly
					else if (Array.isArray(channelValues) && Array.isArray(artnetChannels)) {
						for(let i=0; i<artnetChannels.length; i++) {
							addrToArtNetMessage[(map.options.universe).toString() + ":" + (artnetChannels[i]).toString()] = {
								fromTLObject: layer.id,
								value: channelValues[i]
							}
						}
					}
					// start and end channel and single value, all channels the same
					// e.g. channel 12-24, value 255: 12:255, 13:255 ... 23:255, 24:255
					else if (typeof channelValues === "number" && typeof artnetChannels === "string" && /^\d+\-\d+$/.test(artnetChannels)) {
						let channelRange = artnetChannels.split('-')
						for (let channel = parseInt(channelRange[0]); channel<= parseInt(channelRange[1]); channel++ ) {
							addrToArtNetMessage[(map.options.universe).toString() + ":" + channel.toString()] = {
								fromTLObject: layer.id,
								value: channelValues
							}
						}
					}

				})
			}
		})
		console.log(addrToArtNetMessage)
		return addrToArtNetMessage
	}

	// returns basic information for testing, doesn't currently compare
	diffStates(oldState: ArtNetDeviceState | undefined, newState: ArtNetDeviceState): Array<ArtNetCommandWithContext> {
		const commands: Array<ArtNetCommandWithContext> = []

		// TODO: compare the new state with the old state, and then output the COMMANDS needed in order to acheive the new state.

		for (const [universeId, uniValues ] of Object.entries(newState)) {

			for (const [channel, channelValue ] of Object.entries(uniValues)) {

				const oldChannelValue = oldState?.[universeId]?.[channel]

				if (channelValue.value !== oldChannelValue?.value) {
					// Something has changed.

					// send channelValue.value
					// console.log(commands)
					// let newCommands: ArtNetDeviceCommand = this.convertTimelineStateToDeviceState(newState)
					let newCommands: ArtNetDeviceCommand = ({channel: 12, value: 255})

					commands.push({
						timelineObjId: '',
						context: '',
						command: newCommands
					}) // TODO: define command here
				}
			}
		}

		oldState = newState

		for (const [universeId, uniValues ] of Object.entries(oldState)) {
			for (const [channel, channelValue ] of Object.entries(uniValues)) {
				
				if (!newState[universeId][channel]) {
					console.log("nope")
					console.log(channelValue)

					// The channel value has been removed from the state
					// send 0
					
				}
			}
		}

		
		return commands
	}

	// placeholder
	async sendCommand(cmd: any /*ArtNetDeviceCommand*/): Promise<void> {

		this.sendArtNetUniverse(cmd, this.options.host)

	}

	// additonal methods for good implementation, currently unused

	// private async updateArtNetUniverse() {
	// 	// updates sendArtnet with new values only
	// }

	private async sendArtNetUniverse(newValues: ArtNetDeviceCommand[], host: string, fps: number = 44, mode: string = 'full') {

		let newUniverse:ArtNetUniverse = {
			host: host,
			port: 6454,
			refresh: fps,
			sendAll: true,
			mode: mode,

			data: [],
			interval: [],
			sendThrottle: [],
			sendDelayed: [],
			dataChanged: []
		}

		// newUniverse.data.fill(0,0,512)

		newValues.forEach(element => {
			newUniverse.data[element.channel - 1] = element.value
		});

		console.log('newUniverse.data', newUniverse.data)
		// sends entire artnet universe data with appropriate parameters

	}

}