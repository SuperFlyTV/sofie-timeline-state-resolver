import {
    ActionExecutionResult,
	DeviceStatus,
	DeviceType,
	Timeline,
	TSRTimelineContent,
	ArtNetCommandContent,
    ArtNetOptions,
} from 'timeline-state-resolver-types'
import { CommandWithContext, Device } from '../../service/device'
import * as artnet from 'artnet'

import Debug from 'debug'
import _ = require('underscore')
import { Easing } from '../../devices/transitions/easings'
import { assertNever } from '../../lib'
import { StatusCode } from 'timeline-state-resolver-types'
const debug = Debug('timeline-state-resolver:artnet')

export interface ArtNetDeviceState {
	[address: string]: ArtNetDeviceStateContent
}

interface ArtNetDeviceStateContent extends ArtNetCommandContent {
	fromTLObject: string
}

export interface ArtNetCommandWithContext {
	command: any // todo
	context: string
	timelineObjId: string
}


export class ArtNetDevice extends Device<ArtNetOptions, ArtNetDeviceState, ArtNetCommandWithContext>{

	// private _oscClient!: 
	// private _ArtNetClientStatus: 'connected' | 'disconnected' = 'disconnected'
	// private transitions: {
	// 	[value: number]: {
	// 		started: number
	// 	} & ArtNetDeviceStateContent

	// }

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

	convertTimelineStateToDeviceState(state: Timeline.TimelineState<TSRTimelineContent>): ArtNetDeviceState {

		// TODO: Convert the timeline state into your own (internal) ArtNetState
		// Tip: This is where you put the logic for "highest takes precedence"

		Object.values<Timeline.ResolvedTimelineObjectInstance<TSRTimelineContent>>(state.layer).forEach((layer) => {

		})

	}
	diffStates(oldState: ArtNetDeviceState | undefined, newState: ArtNetDeviceState): Array<ArtNetDeviceCommand> {
		const commands: Array<ArtNetDeviceCommand> = []

		// TODO: compare the new state with the old state, and then output the COMMANDS needed in order to acheive the new state.

		for (const [universeId, uniValues ] of Object.entries(newState)) {

			for (const [channel, channelValue ] of Object.entries(uniValues)) {

				const oldChannelValue = oldState?.[universeId]?.[channel]

				if (channelValue.value !== oldChannelValue?.value) {
					// Something has changed.

					// send channelValue.value
					// commands.push({ TODO: define command here  })
				}

			}

		}


		for (const [universeId, uniValues ] of Object.entries(oldState)) {
			for (const [channel, channelValue ] of Object.entries(uniValues)) {
				
				if (!newState[universeId][channel]) {
					// The channel value has been removed from the state
					// send 0
				}
			}
		}

		return commands

	}

	async sendCommand(cmd: ArtNetDeviceCommand): Promise<void> {

		// This is called when it's time to send the command
		
		// Send the command

	}

	private async updateArtNet() {
		// updates sendArtnet with new values only
		return 
	}

	private async sendArtNetUniverse() {
		// sends entire artnet universe data with appropriate parameters
	}

}

interface ArtNetDeviceState {
	[universe: string]: {
		[channel: string]: {
			value: number
		}
	}
}