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
	ArtNetDeviceCommand
} from 'timeline-state-resolver-types'
import { CommandWithContext, Device } from '../../service/device'
// import * as artnet from 'artnet'

// import Debug from 'debug'
// const debug = Debug('timeline-state-resolver:artnet')
// import _ = require('underscore')
// import { Easing } from '../../devices/transitions/easings'
// import { assertNever } from '../../lib'
// import { StateHandler } from 'src/service/stateHandler'

export interface ArtNetDeviceState {
	[address: string]: ArtNetDeviceStateContent
}

interface ArtNetDeviceStateContent extends ArtNetCommandContent {
	fromTLObject: string
}

export interface ArtNetCommandWithContext extends CommandWithContext{
	command: ArtNetDeviceCommand
	context: string 
	timelineObjId: string
}

// needs somthing to resolvew timeline names, this may not be the place
export interface TimelineContentArtNetValues extends ArtNetCommandContent {

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
	convertTimelineStateToDeviceState(state: Timeline.TimelineState<TSRTimelineContent>): ArtNetDeviceState {

		// TODO: Convert the timeline state into your own (internal) ArtNetState
		// Tip: This is where you put the logic for "highest takes precedence"
		const addrToArtNetMessage: ArtNetDeviceState = {}


		// const artNetGroup = state.id
		// console.log("layer:", artNetGroup)
		console.log(state)

		Object.values<Timeline.ResolvedTimelineObjectInstance<TSRTimelineContent>>(state.layers).forEach((layer) => {
			if (layer.content.deviceType === DeviceType.ARTNET) {
				
				console.log("yes")
				console.log("yay")
			}
		})

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
					console.log(commands)
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
	async sendCommand(/*cmd: ArtNetDeviceCommand*/): Promise<void> {

		// This is called when it's time to send the command
		// console.log(cmd)
		// Send the command
		console.log("something sent")
		// this.sendCommand(22)

	}

	// additonal methods for good implementation, currently unused

	// private async updateArtNet() {
	// 	// updates sendArtnet with new values only
	// }

	// private async sendArtNetUniverse() {
	// 	// sends entire artnet universe data with appropriate parameters
	// }

}

// unsure if useful

// interface ArtNetDeviceState {
// 	[universe: string]: {
// 		[channel: string]: {
// 			value: number
// 		}
// 	}
// }