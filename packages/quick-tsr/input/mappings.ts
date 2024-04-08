import { DeviceType, Mapping, SomeMappingArtnet, MappingArtnetType } from 'timeline-state-resolver'
import { literal } from 'timeline-state-resolver/dist/lib'
import type { TSRInput } from '../src'

export const input: TSRInput = {
	mappings: {
		dimmer0: literal<Mapping<SomeMappingArtnet>>({
			device: DeviceType.ARTNET,
			deviceId: 'universe0',
			options: {
				mappingType: MappingArtnetType.Channels,
				universe: 0,
				featureChannels: {
					// Maps dimmer to channel 1:
					"dimmer": 1,
				}
			},
		}),
		rgb0: literal<Mapping<SomeMappingArtnet>>({
			device: DeviceType.ARTNET,
			deviceId: 'universe0',
			options: {
				mappingType: MappingArtnetType.Channels,
				universe: 0,
				featureChannels: {
					"dimmer": 6,
					"RGB": [7,8,9],
				}
			},
		}),
		rgb0_dimmer: literal<Mapping<SomeMappingArtnet>>({
			device: DeviceType.ARTNET,
			deviceId: 'universe0',
			options: {
				mappingType: MappingArtnetType.Channels,
				universe: 0,
				featureChannels: {
					"dimmer": 6,
				}
			},
		}),
		dimmerGroup0: literal<Mapping<SomeMappingArtnet>>({
			device: DeviceType.ARTNET,
			deviceId: 'universe0',
			options: {
				mappingType: MappingArtnetType.Channels,
				universe: 0,
				featureChannels: {
					// Maps dimmers to channel group:
					"dimmers": [11, 12, 13, 14, 15, 16, 17, 18],
				}
			},
		}),

		everything: literal<Mapping<SomeMappingArtnet>>({
			device: DeviceType.ARTNET,
			deviceId: 'universe0',
			options: {
				mappingType: MappingArtnetType.Channels,
				universe: 0,
				featureChannels: {
					// "everything": ['1-50', '100-512'],
					"everything": '1-512'
					
				}
			},
		}),
	},
}
