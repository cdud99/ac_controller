import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { ACControllerHomebridgePlatform } from './platform';

module.exports = (api) => {
  api.registerAccessory('ACControllerHomebridgePlugin', ThermostatAccessory);
};

class ACControllerThermostatAccessory {

  constructor(log, config, api) {
      this.log = log;
      this.config = config;
      this.api = api;

      this.Service = this.api.hap.Service;
      this.Characteristic = this.api.hap.Characteristic;

      // extract name from config
      this.name = config.name;

      // create a new Thermostat service
      this.service = new this.Service(this.Service.Thermostat);

      // create handlers for required characteristics
      this.service.getCharacteristic(this.Characteristic.CurrentHeatingCoolingState)
        .onGet(this.handleCurrentHeatingCoolingStateGet.bind(this));

      this.service.getCharacteristic(this.Characteristic.TargetHeatingCoolingState)
        .onGet(this.handleTargetHeatingCoolingStateGet.bind(this))
        .onSet(this.handleTargetHeatingCoolingStateSet.bind(this));

      this.service.getCharacteristic(this.Characteristic.CurrentTemperature)
        .onGet(this.handleCurrentTemperatureGet.bind(this));

      this.service.getCharacteristic(this.Characteristic.TargetTemperature)
        .onGet(this.handleTargetTemperatureGet.bind(this))
        .onSet(this.handleTargetTemperatureSet.bind(this));

      this.service.getCharacteristic(this.Characteristic.TemperatureDisplayUnits)
        .onGet(this.handleTemperatureDisplayUnitsGet.bind(this))
        .onSet(this.handleTemperatureDisplayUnitsSet.bind(this));

  }

  /**
   * Handle requests to get the current value of the "Current Heating Cooling State" characteristic
   */
  async handleCurrentHeatingCoolingStateGet() {
    this.log.debug('Triggered GET CurrentHeatingCoolingState');

    const discoveryURL = 'http://192.168.1.210/getState';
    const response = await fetch(discoveryURL, {
      method: 'GET',
    });

    if (!response.ok) {
      // this.log.error('response.statusText')
      this.log.error('Error fetching state');
    }

    const devices: { sku: string; device: string; deviceName: string }[] = [];
    if (response.body !== null) {
      if (response.body === "On") {
        return this.Characteristic.CurrentHeatingCoolingState.COOL;
      } else if (reesponse.body === "Off") {
        return = this.Characteristic.CurrentHeatingCoolingState.OFF;
      }
    }
  }


  /**
   * Handle requests to get the current value of the "Target Heating Cooling State" characteristic
   */
  handleTargetHeatingCoolingStateGet() {
    this.log.debug('Triggered GET TargetHeatingCoolingState');

    const discoveryURL = 'http://192.168.1.210/getState';
    const response = await fetch(discoveryURL, {
      method: 'GET',
    });

    if (!response.ok) {
      // this.log.error('response.statusText')
      this.log.error('Error fetching state');
    }

    const devices: { sku: string; device: string; deviceName: string }[] = [];
    if (response.body !== null) {
      if (response.body === "On") {
        return this.Characteristic.CurrentHeatingCoolingState.COOL;
      } else if (reesponse.body === "Off") {
        return = this.Characteristic.CurrentHeatingCoolingState.OFF;
      }
    }
  }

  /**
   * Handle requests to set the "Target Heating Cooling State" characteristic
   */
  handleTargetHeatingCoolingStateSet(value) {
    this.log.debug('Triggered SET TargetHeatingCoolingState:' value);

    if (value === this.Characteristic.CurrentHeatingCoolingState.COOL) {
      const discoveryURL = 'http://192.168.1.210/turnOn';
      const response = await fetch(discoveryURL, {
        method: 'GET',
      });

      if (!response.ok) {
        // this.log.error('response.statusText')
        this.log.error('Error turning on');
      }

      this.log.debug(response.body);
    } else {
      const discoveryURL = 'http://192.168.1.210/turnOff';
      const response = await fetch(discoveryURL, {
        method: 'GET',
      });

      if (!response.ok) {
        // this.log.error('response.statusText')
        this.log.error('Error turning off');
      }

      this.log.debug(response.body);
    }
  }

  /**
   * Handle requests to get the current value of the "Current Temperature" characteristic
   */
  handleCurrentTemperatureGet() {
    this.log.debug('Triggered GET CurrentTemperature');

    // set this to a valid value for CurrentTemperature
    const currentValue = -270;

    return currentValue;
  }


  /**
   * Handle requests to get the current value of the "Target Temperature" characteristic
   */
  handleTargetTemperatureGet() {
    this.log.debug('Triggered GET TargetTemperature');

    // set this to a valid value for TargetTemperature
    const currentValue = 10;

    return currentValue;
  }

  /**
   * Handle requests to set the "Target Temperature" characteristic
   */
  handleTargetTemperatureSet(value) {
    this.log.debug('Triggered SET TargetTemperature:' value);
  }

  /**
   * Handle requests to get the current value of the "Temperature Display Units" characteristic
   */
  handleTemperatureDisplayUnitsGet() {
    this.log.debug('Triggered GET TemperatureDisplayUnits');

    // set this to a valid value for TemperatureDisplayUnits
    const currentValue = this.Characteristic.TemperatureDisplayUnits.FARENHEIT;

    return currentValue;
  }

  /**
   * Handle requests to set the "Temperature Display Units" characteristic
   */
  handleTemperatureDisplayUnitsSet(value) {
    this.log.debug('Triggered SET TemperatureDisplayUnits:' value);
  }

  async discoverDevices() {
    const discoveryURL = 'https://openapi.api.govee.com/router/api/v1/user/devices';
    const response = await fetch(discoveryURL, {
      method: 'GET',
      headers: {
        'Govee-API-Key': this.config.key,
      }});

    if (!response.ok) {
      // this.log.error('response.statusText')
      this.log.error('Error fetching devices');
    }

    const devices: { sku: string; device: string; deviceName: string }[] = [];
    if (response.body !== null) {
      const responseJSON = await response.json();
      for (const device of responseJSON.data) {
        devices.push({
          'sku': device.sku,
          'device': device.device,
          'deviceName': device.deviceName,
        });
      }
    }

}
