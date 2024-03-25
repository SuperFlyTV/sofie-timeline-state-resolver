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
	ARTNET = 'artnet',
}

export interface TimelineContentArtNet {
	deviceType: DeviceType.ARTNET
	type: TimelineContentTypeArtNet
    channel: number
    value: number
    trasition?: {
        duration: number,
        type: ArtNetEasingType,
        direction: 'In' | 'Out' | 'InOut' | 'None'
    }
}

export type TimelineContentArtNetAny = TimelineContentArtNet




