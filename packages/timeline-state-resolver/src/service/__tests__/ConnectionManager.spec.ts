import { DeviceType, OSCDeviceType } from 'timeline-state-resolver-types'
import { ConstructedMockDevices, MockDeviceInstanceWrapper } from '../../__tests__/mockDeviceInstanceWrapper'
import { ConnectionManager } from '../ConnectionManager'

// Mock explicitly the 'dist' version, as that is what threadedClass is being told to load
jest.mock('../../../dist/service/DeviceInstance', () => ({
	DeviceInstanceWrapper: MockDeviceInstanceWrapper,
}))
jest.mock('../DeviceInstance', () => ({
	DeviceInstanceWrapper: MockDeviceInstanceWrapper,
}))

// add mocks for each of the integrations that hasn't been refactored to StateHandler structure
jest.mock('../../../dist/integrations/casparcg/index', () => ({
	CasparCGDevice: MockDeviceInstanceWrapper,
}))
jest.mock('../../../dist/integrations/sisyfos/index', () => ({
	SisyfosMessageDevice: MockDeviceInstanceWrapper,
}))
jest.mock('../../../dist/integrations/vizMSE/index', () => ({
	VizMSEDevice: MockDeviceInstanceWrapper,
}))
jest.mock('../../../dist/integrations/vmix/index', () => ({
	VMixDevice: MockDeviceInstanceWrapper,
}))

describe('ConnectionManager', () => {
	for (const deviceType of Object.values(DeviceType)) {
		const connManager = new ConnectionManager()

		test('adding/removing a device: ' + deviceType, async () => {
			let resolveAdded: undefined | (() => void) = undefined
			const psAdded = new Promise<void>((resolveCb) => (resolveAdded = resolveCb))
			connManager.on('connectionAdded', () => {
				if (resolveAdded) resolveAdded()
			})

			let resolveRemoved: undefined | (() => void) = undefined
			const psRemoved = new Promise<void>((resolveCb) => (resolveRemoved = resolveCb))
			connManager.on('connectionRemoved', () => {
				if (resolveRemoved) resolveRemoved()
			})

			connManager.setConnections({
				// @ts-expect-error: wrong device type for options
				device0: {
					type: deviceType,
					options: {
						host: '127.0.0.1',
						port: 5250,
						type: OSCDeviceType.UDP,
					},
				},
			})

			await psAdded

			expect(ConstructedMockDevices['device0']).toBeTruthy()

			connManager.setConnections({})

			await psRemoved

			expect(ConstructedMockDevices['device0']).toBeFalsy()
		})
	}
})
