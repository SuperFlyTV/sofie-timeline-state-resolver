import { TSRInput } from '../src'
import { DeviceType } from 'timeline-state-resolver'

export const input: TSRInput = {
	devices: {
		universe0: {
			type: DeviceType.ARTNET,
			options: {
				host: '127.0.0.1',
				mode: 'full',
				fps: 44,

				profileBehaviours: {
					
					// By default, the priority mode for all channels are "highest value takes precedence"
					'strobe' : 'invert'

					// '0:145': 'last' 
					// 'last' 
					// 'highest' 
					// 'lowest' 
					// 'invert' 

				}
			},
		},
	},
}
