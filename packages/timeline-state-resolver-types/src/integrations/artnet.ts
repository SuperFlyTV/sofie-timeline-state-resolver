import { DeviceType } from '..'

// Note: This type is a loose referral to (a copy of) keyof typeof Easing in '../../easings', so that Easing structure won't be included in the types package
export type ArtNetEasingType =
	| 'Linear'
	| 'Quadratic'
	| 'Cubic'
	| 'Quartic'
	| 'Quintic'
	| 'Sinusoidal'
	| 'Exponential'
	| 'Circular'
	| 'Elastic'
	| 'Back'
	| 'Bounce'

export enum TimelineContentTypeArtNet {
	VALUES = 'values',
}

export interface TimelineContentArtNetBase {
	deviceType: DeviceType.ARTNET
	type: TimelineContentTypeArtNet
}
export interface TimelineContentArtNet extends TimelineContentArtNetBase {
	type: TimelineContentTypeArtNet.VALUES	
	values: {
		[feature: string]: number | number[]
	}
	
	// TODO:
	// transition?: {
	// 	duration: number,
	// 	type: ArtNetEasingType,
	// 	direction: 'In' | 'Out' | 'InOut' | 'None'
	// }
}

export interface ArtNetDeviceCommand {
	channel: number
	value: number
}

export interface ArtNetCommandContent {
	ID: string
	values: number | Array<number>
}

export type TimelineContentArtNetAny = TimelineContentArtNet




