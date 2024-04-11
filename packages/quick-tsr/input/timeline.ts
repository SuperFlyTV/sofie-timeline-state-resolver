import {
	DeviceType,
	// DeviceType,
	// TimelineContentTypeCasparCg,
	// TimelineContentCCGMedia,
	TimelineContentArtNetAny,
	TimelineContentTypeArtNet,
	TSRTimelineObj,
} from 'timeline-state-resolver'
import { TSRInput } from '../src'
import { literal } from 'timeline-state-resolver/dist/lib'

export const input: TSRInput = {
	timeline: [

		literal<TSRTimelineObj<TimelineContentArtNetAny>>({
			id: 'grey',
			enable: {
				start: Date.now(),
				duration: 20 * 1000
			},
			layer: 'dimmer0',
			content: {
				deviceType: DeviceType.ARTNET,
				type: TimelineContentTypeArtNet.VALUES,
				values: {
					dimmer: 42
				}
			}
		}),
		literal<TSRTimelineObj<TimelineContentArtNetAny>>({
			id: 'white',
			enable: {
				start: Date.now() + 1000,
				duration: 20 * 1000
			},
			layer: 'dimmer0',
			content: {
				deviceType: DeviceType.ARTNET,
				type: TimelineContentTypeArtNet.VALUES,
				values: {
					dimmer: 255
				}
			}
		}),
		literal<TSRTimelineObj<TimelineContentArtNetAny>>({
			id: 'colour',
			enable: {
				start: Date.now(),
				duration: 20 * 1000
			},
			layer: 'rgb0',
			content: {
				deviceType: DeviceType.ARTNET,
				type: TimelineContentTypeArtNet.VALUES,
				values: {
					dimmer: 127
				}
			}
		}),
		// literal<TSRTimelineObj<TimelineContentArtNetAny>>({
		// 	id: 'artnet11',
		// 	enable: {
		// 		start: Date.now(),
		// 		duration: 20 * 1000
		// 	},
		// 	layer: 'rgb0',
		// 	content: {
		// 		deviceType: DeviceType.ARTNET,
		// 		type: TimelineContentTypeArtNet.VALUES,
		// 		values: {
		// 			// Sets an RGB value:
		// 			rgb: [ 255, 127, 0 ]
					
		// 			// Defaults to [255, 255, 255] (special case: uses the value for all)
		// 			// rgb: 255
	
		// 			// Defaults to [ 127, 255, 0 ] (underfill: extend with zeros)
		// 			// rgb: [ 127, 255 ]
					
		// 			// Defaults to [ 127, 255, 209 ] (overfill: just cap and discard the unused values)
		// 			// rgb: [ 127, 255, 209, 52 ]
		// 		}
		// 	}
		// }),
		// literal<TSRTimelineObj<TimelineContentArtNetAny>>({
		// 	id: 'myRGBLight0',
		// 	enable: {
		// 		start: Date.now(),
		// 		duration: 20 * 1000
		// 	},
		// 	layer: 'rgb0',
		// 	content: {
		// 		deviceType: DeviceType.ARTNET,
		// 		type: TimelineContentTypeArtNet.VALUES,
		// 		values: {
		// 			dimmer: 255,
		// 			rgb: [ 255, 127, 0 ]
		// 		}
		// 	},
		// 	// keyframes: [
		// 	// 	{
		// 	// 		id: 'kf0',
		// 	// 		enable: {
						
		// 	// 			start: '#myRGBLight0.start + 10',
		// 	// 		},
		// 	// 		content: {
		// 	// 			values: {
		// 	// 				dimmer: 127
		// 	// 			}
		// 	// 		}
		// 	// 	}
		// 	// ]
		// }),
		// literal<TSRTimelineObj<TimelineContentArtNetAny>>({
		// 	id: 'artnet_dimmer',
		// 	enable: {
		// 		start: Date.now(),
		// 		duration: 20 * 1000
		// 	},
		// 	layer: 'rgb0',
		// 	content: {
		// 		deviceType: DeviceType.ARTNET,
		// 		type: TimelineContentTypeArtNet.VALUES,
		// 		values: {
		// 			dimmers: 255
		// 		}
				
		// 		// value: [255, 0, 0, 255]
		// 	}
		// }),

		// literal<TSRTimelineObj<TimelineContentArtNetAny>>({
		// 	id: 'whiteout',
		// 	enable: {
		// 		start: Date.now()
		// 	},
		// 	layer: 'everything',
		// 	content: {
		// 		deviceType: DeviceType.ARTNET,
		// 		type: TimelineContentTypeArtNet.VALUES,
		// 		values: {
		// 			everything: 255
		// 		}
		// 	}
		// }),
		
		// literal<TSRTimelineObj<TimelineContentCCGMedia>>({
		// 	id: 'video0',
		// 	enable: {
		// 		start: Date.now(),
		// 		duration: 20 * 1000,
		// 	},
		// 	layer: 'casparLayer0',
		// 	content: {
		// 		deviceType: DeviceType.CASPARCG,
		// 		type: TimelineContentTypeCasparCg.MEDIA,
		// 		file: 'amb.mp4',
		// 		mixer: {
		// 			rotation: 0,
		// 			// anchor: {
		// 			// 	x: 0.5,
		// 			// 	y: 0.5,
		// 			// },
		// 			fill: {
		// 				x: 0.5,
		// 				y: 0.5,
		// 				xScale: 0.7,
		// 				yScale: 1,
		// 			},
		// 		},

		// 		// $references: {
		// 		// 	'mixer.fill.xScale': {
		// 		// 		// Local path to overwrite
		// 		// 		datastoreKey: 'scale', // Reference key in datastore
		// 		// 		overwrite: false,
		// 		// 	},
		// 		// 	'mixer.fill.yScale': {
		// 		// 		// Local path to overwrite
		// 		// 		datastoreKey: 'scale', // Reference key in datastore
		// 		// 		overwrite: false,
		// 		// 	},
		// 		// },
		// 	},
		// 	keyframes: [
		// 		{
		// 			id: 'kf0',
		// 			enable: {
		// 				while: true,
		// 				// start: '#video0.start + 10',
		// 			},
		// 			content: {
		// 				mixer: {
		// 					rotation: 90
		// 				}
		// 			}
		// 		}
		// 	]
		// }),
	],
}
