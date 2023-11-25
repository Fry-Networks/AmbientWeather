export interface EcoWittDevice {
  id: number;
  name: string;
  mac: string;
  imei: string;
  type: number;
  data_zone_id: string;
  createtime: number;
  longitude: number;
  latitude: number;
  stationtype: string;
}

export interface EcoWittDevicesResponse {
  code: 0;
  msg: string;
  time: string;
  data: {
    total: number;
    totalPage: number;
    list: EcoWittDevice[];
  };
}

export interface EcoWittDeviceData {
  code: 0;
  msg: string;
  time: string;
  data: Data;
}

export interface Data {
  code: 0;
  msg: string;
  time: string;
  outdoor: Outdoor;
  indoor: Indoor;
  solar_and_uvi: SolarAndUvi;
  rainfall: Rainfall;
  rainfall_piezo: RainfallPiezo;
  wind: Wind;
  pressure: Pressure;
  lightning: Lightning;
  indoor_co2: IndoorCo2;
  co2_aqi_combo: Co2AqiCombo;
  pm25_aqi_combo: Pm25AqiCombo;
  pm10_aqi_combo: Pm10AqiCombo;
  pm1_aqi_combo: Pm1AqiCombo;
  pm4_aqi_combo: Pm4AqiCombo;
  t_rh_aqi_combo: TRhAqiCombo;
  water_leak: WaterLeak;
  pm25_ch1: Pm25Ch1;
  pm25_ch2: Pm25Ch2;
  pm25_ch3: Pm25Ch3;
  pm25_ch4: Pm25Ch4;
  temp_and_humidity_ch1: TempAndHumidityCh1;
  temp_and_humidity_ch2: TempAndHumidityCh2;
  temp_and_humidity_ch3: TempAndHumidityCh3;
  temp_and_humidity_ch4: TempAndHumidityCh4;
  temp_and_humidity_ch5: TempAndHumidityCh5;
  temp_and_humidity_ch6: TempAndHumidityCh6;
  temp_and_humidity_ch7: TempAndHumidityCh7;
  temp_and_humidity_ch8: TempAndHumidityCh8;
  soil_ch1: SoilCh1;
  soil_ch2: SoilCh2;
  soil_ch3: SoilCh3;
  soil_ch4: SoilCh4;
  soil_ch5: SoilCh5;
  soil_ch6: SoilCh6;
  soil_ch7: SoilCh7;
  soil_ch8: SoilCh8;
  temp_ch1: TempCh1;
  temp_ch2: TempCh2;
  temp_ch3: TempCh3;
  temp_ch4: TempCh4;
  temp_ch5: TempCh5;
  temp_ch6: TempCh6;
  temp_ch7: TempCh7;
  temp_ch8: TempCh8;
  leaf_ch1: LeafCh1;
  leaf_ch2: LeafCh2;
  leaf_ch3: LeafCh3;
  leaf_ch4: LeafCh4;
  leaf_ch5: LeafCh5;
  leaf_ch6: LeafCh6;
  leaf_ch7: LeafCh7;
  leaf_ch8: LeafCh8;
  battery: Battery;
  camera: Camera;
}

export interface Outdoor {
  temperature: Temperature;
  feels_like: FeelsLike;
  app_temp: AppTemp;
  dew_point: DewPoint;
  humidity: Humidity;
}

export interface Temperature {
  time: string;
  unit: string;
  value: string;
}

export interface FeelsLike {
  time: string;
  unit: string;
  value: string;
}

export interface AppTemp {
  time: string;
  unit: string;
  value: string;
}

export interface DewPoint {
  time: string;
  unit: string;
  value: string;
}

export interface Humidity {
  time: string;
  unit: string;
  value: string;
}

export interface Indoor {
  temperature: Temperature2;
  humidity: Humidity2;
}

export interface Temperature2 {
  time: string;
  unit: string;
  value: string;
}

export interface Humidity2 {
  time: string;
  unit: string;
  value: string;
}

export interface SolarAndUvi {
  solar: Solar;
  uvi: Uvi;
}

export interface Solar {
  time: string;
  unit: string;
  value: string;
}

export interface Uvi {
  time: string;
  unit: string;
  value: string;
}

export interface Rainfall {
  rain_rate: RainRate;
  daily: Daily;
  event: Event;
  hourly: Hourly;
  weekly: Weekly;
  monthly: Monthly;
  yearly: Yearly;
}

export interface RainRate {
  time: string;
  unit: string;
  value: string;
}

export interface Daily {
  time: string;
  unit: string;
  value: string;
}

export interface Event {
  time: string;
  unit: string;
  value: string;
}

export interface Hourly {
  time: string;
  unit: string;
  value: string;
}

export interface Weekly {
  time: string;
  unit: string;
  value: string;
}

export interface Monthly {
  time: string;
  unit: string;
  value: string;
}

export interface Yearly {
  time: string;
  unit: string;
  value: string;
}

export interface RainfallPiezo {
  rain_rate: RainRate2;
  daily: Daily2;
  event: Event2;
  hourly: Hourly2;
  weekly: Weekly2;
  monthly: Monthly2;
  yearly: Yearly2;
}

export interface RainRate2 {
  time: string;
  unit: string;
  value: string;
}

export interface Daily2 {
  time: string;
  unit: string;
  value: string;
}

export interface Event2 {
  time: string;
  unit: string;
  value: string;
}

export interface Hourly2 {
  time: string;
  unit: string;
  value: string;
}

export interface Weekly2 {
  time: string;
  unit: string;
  value: string;
}

export interface Monthly2 {
  time: string;
  unit: string;
  value: string;
}

export interface Yearly2 {
  time: string;
  unit: string;
  value: string;
}

export interface Wind {
  wind_speed: WindSpeed;
  wind_gust: WindGust;
  wind_direction: WindDirection;
}

export interface WindSpeed {
  time: string;
  unit: string;
  value: string;
}

export interface WindGust {
  time: string;
  unit: string;
  value: string;
}

export interface WindDirection {
  time: string;
  unit: string;
  value: string;
}

export interface Pressure {
  relative: Relative;
  absolute: Absolute;
}

export interface Relative {
  time: string;
  unit: string;
  value: string;
}

export interface Absolute {
  time: string;
  unit: string;
  value: string;
}

export interface Lightning {
  distance: Distance;
  count: Count;
}

export interface Distance {
  time: string;
  unit: string;
  value: string;
}

export interface Count {
  time: string;
  unit: string;
  value: string;
}

export interface IndoorCo2 {
  co2: Co2;
  "24_hours_average": N24HoursAverage;
}

export interface Co2 {
  time: string;
  unit: string;
  value: string;
}

export interface N24HoursAverage {
  time: string;
  unit: string;
  value: string;
}

export interface Co2AqiCombo {
  co2: Co22;
  "24_hours_average": N24HoursAverage2;
}

export interface Co22 {
  time: string;
  unit: string;
  value: string;
}

export interface N24HoursAverage2 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm25AqiCombo {
  real_time_aqi: RealTimeAqi;
  pm25: Pm25;
  "24_hours_aqi": N24HoursAqi;
}

export interface RealTimeAqi {
  time: string;
  unit: string;
  value: string;
}

export interface Pm25 {
  time: string;
  unit: string;
  value: string;
}

export interface N24HoursAqi {
  time: string;
  unit: string;
  value: string;
}

export interface Pm10AqiCombo {
  real_time_aqi: RealTimeAqi2;
  pm10: Pm10;
  "24_hours_aqi": N24HoursAqi2;
}

export interface RealTimeAqi2 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm10 {
  time: string;
  unit: string;
  value: string;
}

export interface N24HoursAqi2 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm1AqiCombo {
  real_time_aqi: RealTimeAqi3;
  pm1: Pm1;
  "24_hours_aqi": N24HoursAqi3;
}

export interface RealTimeAqi3 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm1 {
  time: string;
  unit: string;
  value: string;
}

export interface N24HoursAqi3 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm4AqiCombo {
  real_time_aqi: RealTimeAqi4;
  pm4: Pm4;
  "24_hours_aqi": N24HoursAqi4;
}

export interface RealTimeAqi4 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm4 {
  time: string;
  unit: string;
  value: string;
}

export interface N24HoursAqi4 {
  time: string;
  unit: string;
  value: string;
}

export interface TRhAqiCombo {
  temperature: Temperature3;
  humidity: Humidity3;
}

export interface Temperature3 {
  time: string;
  unit: string;
  value: string;
}

export interface Humidity3 {
  time: string;
  unit: string;
  value: string;
}

export interface WaterLeak {
  leak_ch1: LeakCh1;
  leak_ch2: LeakCh2;
  leak_ch3: LeakCh3;
  leak_ch4: LeakCh4;
}

export interface LeakCh1 {
  time: string;
  unit: string;
  value: string;
}

export interface LeakCh2 {
  time: string;
  unit: string;
  value: string;
}

export interface LeakCh3 {
  time: string;
  unit: string;
  value: string;
}

export interface LeakCh4 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm25Ch1 {
  real_time_aqi: RealTimeAqi5;
  pm25: Pm252;
  "24_hours_aqi": N24HoursAqi5;
}

export interface RealTimeAqi5 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm252 {
  time: string;
  unit: string;
  value: string;
}

export interface N24HoursAqi5 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm25Ch2 {
  real_time_aqi: RealTimeAqi6;
  pm25: Pm253;
  "24_hours_aqi": N24HoursAqi6;
}

export interface RealTimeAqi6 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm253 {
  time: string;
  unit: string;
  value: string;
}

export interface N24HoursAqi6 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm25Ch3 {
  real_time_aqi: RealTimeAqi7;
  pm25: Pm254;
  "24_hours_aqi": N24HoursAqi7;
}

export interface RealTimeAqi7 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm254 {
  time: string;
  unit: string;
  value: string;
}

export interface N24HoursAqi7 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm25Ch4 {
  real_time_aqi: RealTimeAqi8;
  pm25: Pm255;
  "24_hours_aqi": N24HoursAqi8;
}

export interface RealTimeAqi8 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm255 {
  time: string;
  unit: string;
  value: string;
}

export interface N24HoursAqi8 {
  time: string;
  unit: string;
  value: string;
}

export interface TempAndHumidityCh1 {
  temperature: Temperature4;
  humidity: Humidity4;
}

export interface Temperature4 {
  time: string;
  unit: string;
  value: string;
}

export interface Humidity4 {
  time: string;
  unit: string;
  value: string;
}

export interface TempAndHumidityCh2 {
  temperature: Temperature5;
  humidity: Humidity5;
}

export interface Temperature5 {
  time: string;
  unit: string;
  value: string;
}

export interface Humidity5 {
  time: string;
  unit: string;
  value: string;
}

export interface TempAndHumidityCh3 {
  temperature: Temperature6;
  humidity: Humidity6;
}

export interface Temperature6 {
  time: string;
  unit: string;
  value: string;
}

export interface Humidity6 {
  time: string;
  unit: string;
  value: string;
}

export interface TempAndHumidityCh4 {
  temperature: Temperature7;
  humidity: Humidity7;
}

export interface Temperature7 {
  time: string;
  unit: string;
  value: string;
}

export interface Humidity7 {
  time: string;
  unit: string;
  value: string;
}

export interface TempAndHumidityCh5 {
  temperature: Temperature8;
  humidity: Humidity8;
}

export interface Temperature8 {
  time: string;
  unit: string;
  value: string;
}

export interface Humidity8 {
  time: string;
  unit: string;
  value: string;
}

export interface TempAndHumidityCh6 {
  temperature: Temperature9;
  humidity: Humidity9;
}

export interface Temperature9 {
  time: string;
  unit: string;
  value: string;
}

export interface Humidity9 {
  time: string;
  unit: string;
  value: string;
}

export interface TempAndHumidityCh7 {
  temperature: Temperature10;
  humidity: Humidity10;
}

export interface Temperature10 {
  time: string;
  unit: string;
  value: string;
}

export interface Humidity10 {
  time: string;
  unit: string;
  value: string;
}

export interface TempAndHumidityCh8 {
  temperature: Temperature11;
  humidity: Humidity11;
}

export interface Temperature11 {
  time: string;
  unit: string;
  value: string;
}

export interface Humidity11 {
  time: string;
  unit: string;
  value: string;
}

export interface SoilCh1 {
  soilmoisture: Soilmoisture;
}

export interface Soilmoisture {
  time: string;
  unit: string;
  value: string;
}

export interface SoilCh2 {
  soilmoisture: Soilmoisture2;
}

export interface Soilmoisture2 {
  time: string;
  unit: string;
  value: string;
}

export interface SoilCh3 {
  soilmoisture: Soilmoisture3;
}

export interface Soilmoisture3 {
  time: string;
  unit: string;
  value: string;
}

export interface SoilCh4 {
  soilmoisture: Soilmoisture4;
}

export interface Soilmoisture4 {
  time: string;
  unit: string;
  value: string;
}

export interface SoilCh5 {
  soilmoisture: Soilmoisture5;
}

export interface Soilmoisture5 {
  time: string;
  unit: string;
  value: string;
}

export interface SoilCh6 {
  soilmoisture: Soilmoisture6;
}

export interface Soilmoisture6 {
  time: string;
  unit: string;
  value: string;
}

export interface SoilCh7 {
  soilmoisture: Soilmoisture7;
}

export interface Soilmoisture7 {
  time: string;
  unit: string;
  value: string;
}

export interface SoilCh8 {
  soilmoisture: Soilmoisture8;
}

export interface Soilmoisture8 {
  time: string;
  unit: string;
  value: string;
}

export interface TempCh1 {
  temperature: Temperature12;
}

export interface Temperature12 {
  time: string;
  unit: string;
  value: string;
}

export interface TempCh2 {
  temperature: Temperature13;
}

export interface Temperature13 {
  time: string;
  unit: string;
  value: string;
}

export interface TempCh3 {
  temperature: Temperature14;
}

export interface Temperature14 {
  time: string;
  unit: string;
  value: string;
}

export interface TempCh4 {
  temperature: Temperature15;
}

export interface Temperature15 {
  time: string;
  unit: string;
  value: string;
}

export interface TempCh5 {
  temperature: Temperature16;
}

export interface Temperature16 {
  time: string;
  unit: string;
  value: string;
}

export interface TempCh6 {
  temperature: Temperature17;
}

export interface Temperature17 {
  time: string;
  unit: string;
  value: string;
}

export interface TempCh7 {
  temperature: Temperature18;
}

export interface Temperature18 {
  time: string;
  unit: string;
  value: string;
}

export interface TempCh8 {
  temperature: Temperature19;
}

export interface Temperature19 {
  time: string;
  unit: string;
  value: string;
}

export interface LeafCh1 {
  leaf_wetness: LeafWetness;
}

export interface LeafWetness {
  time: string;
  unit: string;
  value: string;
}

export interface LeafCh2 {
  leaf_wetness: LeafWetness2;
}

export interface LeafWetness2 {
  time: string;
  unit: string;
  value: string;
}

export interface LeafCh3 {
  leaf_wetness: LeafWetness3;
}

export interface LeafWetness3 {
  time: string;
  unit: string;
  value: string;
}

export interface LeafCh4 {
  leaf_wetness: LeafWetness4;
}

export interface LeafWetness4 {
  time: string;
  unit: string;
  value: string;
}

export interface LeafCh5 {
  leaf_wetness: LeafWetness5;
}

export interface LeafWetness5 {
  time: string;
  unit: string;
  value: string;
}

export interface LeafCh6 {
  leaf_wetness: LeafWetness6;
}

export interface LeafWetness6 {
  time: string;
  unit: string;
  value: string;
}

export interface LeafCh7 {
  leaf_wetness: LeafWetness7;
}

export interface LeafWetness7 {
  time: string;
  unit: string;
  value: string;
}

export interface LeafCh8 {
  leaf_wetness: LeafWetness8;
}

export interface LeafWetness8 {
  time: string;
  unit: string;
  value: string;
}

export interface Battery {
  t_rh_p_sensor: TRhPSensor;
  ws1900_console: Ws1900Console;
  ws1800_console: Ws1800Console;
  ws6006_console: Ws6006Console;
  console: Console;
  outdoor_t_rh_sensor: OutdoorTRhSensor;
  wind_sensor: WindSensor;
  haptic_array_battery: HapticArrayBattery;
  haptic_array_capacitor: HapticArrayCapacitor;
  sonic_array: SonicArray;
  rainfall_sensor: RainfallSensor;
  sensor_array: SensorArray;
  lightning_sensor: LightningSensor;
  aqi_combo_sensor: AqiComboSensor;
  water_leak_sensor_ch1: WaterLeakSensorCh1;
  water_leak_sensor_ch2: WaterLeakSensorCh2;
  water_leak_sensor_ch3: WaterLeakSensorCh3;
  water_leak_sensor_ch4: WaterLeakSensorCh4;
  pm25_sensor_ch1: Pm25SensorCh1;
  pm25_sensor_ch2: Pm25SensorCh2;
  pm25_sensor_ch3: Pm25SensorCh3;
  pm25_sensor_ch4: Pm25SensorCh4;
  temp_humidity_sensor_ch1: TempHumiditySensorCh1;
  temp_humidity_sensor_ch2: TempHumiditySensorCh2;
  temp_humidity_sensor_ch3: TempHumiditySensorCh3;
  temp_humidity_sensor_ch4: TempHumiditySensorCh4;
  temp_humidity_sensor_ch5: TempHumiditySensorCh5;
  temp_humidity_sensor_ch6: TempHumiditySensorCh6;
  temp_humidity_sensor_ch7: TempHumiditySensorCh7;
  temp_humidity_sensor_ch8: TempHumiditySensorCh8;
  soilmoisture_sensor_ch1: SoilmoistureSensorCh1;
  soilmoisture_sensor_ch2: SoilmoistureSensorCh2;
  soilmoisture_sensor_ch3: SoilmoistureSensorCh3;
  soilmoisture_sensor_ch4: SoilmoistureSensorCh4;
  soilmoisture_sensor_ch5: SoilmoistureSensorCh5;
  soilmoisture_sensor_ch6: SoilmoistureSensorCh6;
  soilmoisture_sensor_ch7: SoilmoistureSensorCh7;
  soilmoisture_sensor_ch8: SoilmoistureSensorCh8;
  temperature_sensor_ch1: TemperatureSensorCh1;
  temperature_sensor_ch2: TemperatureSensorCh2;
  temperature_sensor_ch3: TemperatureSensorCh3;
  temperature_sensor_ch4: TemperatureSensorCh4;
  temperature_sensor_ch5: TemperatureSensorCh5;
  temperature_sensor_ch6: TemperatureSensorCh6;
  temperature_sensor_ch7: TemperatureSensorCh7;
  temperature_sensor_ch8: TemperatureSensorCh8;
  leaf_wetness_sensor_ch1: LeafWetnessSensorCh1;
  leaf_wetness_sensor_ch2: LeafWetnessSensorCh2;
  leaf_wetness_sensor_ch3: LeafWetnessSensorCh3;
  leaf_wetness_sensor_ch4: LeafWetnessSensorCh4;
  leaf_wetness_sensor_ch5: LeafWetnessSensorCh5;
  leaf_wetness_sensor_ch6: LeafWetnessSensorCh6;
  leaf_wetness_sensor_ch7: LeafWetnessSensorCh7;
  leaf_wetness_sensor_ch8: LeafWetnessSensorCh8;
}

export interface TRhPSensor {
  time: string;
  unit: string;
  value: string;
}

export interface Ws1900Console {
  time: string;
  unit: string;
  value: string;
}

export interface Ws1800Console {
  time: string;
  unit: string;
  value: string;
}

export interface Ws6006Console {
  time: string;
  unit: string;
  value: string;
}

export interface Console {
  time: string;
  unit: string;
  value: string;
}

export interface OutdoorTRhSensor {
  time: string;
  unit: string;
  value: string;
}

export interface WindSensor {
  time: string;
  unit: string;
  value: string;
}

export interface HapticArrayBattery {
  time: string;
  unit: string;
  value: string;
}

export interface HapticArrayCapacitor {
  time: string;
  unit: string;
  value: string;
}

export interface SonicArray {
  time: string;
  unit: string;
  value: string;
}

export interface RainfallSensor {
  time: string;
  unit: string;
  value: string;
}

export interface SensorArray {
  time: string;
  unit: string;
  value: string;
}

export interface LightningSensor {
  time: string;
  unit: string;
  value: string;
}

export interface AqiComboSensor {
  time: string;
  unit: string;
  value: string;
}

export interface WaterLeakSensorCh1 {
  time: string;
  unit: string;
  value: string;
}

export interface WaterLeakSensorCh2 {
  time: string;
  unit: string;
  value: string;
}

export interface WaterLeakSensorCh3 {
  time: string;
  unit: string;
  value: string;
}

export interface WaterLeakSensorCh4 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm25SensorCh1 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm25SensorCh2 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm25SensorCh3 {
  time: string;
  unit: string;
  value: string;
}

export interface Pm25SensorCh4 {
  time: string;
  unit: string;
  value: string;
}

export interface TempHumiditySensorCh1 {
  time: string;
  unit: string;
  value: string;
}

export interface TempHumiditySensorCh2 {
  time: string;
  unit: string;
  value: string;
}

export interface TempHumiditySensorCh3 {
  time: string;
  unit: string;
  value: string;
}

export interface TempHumiditySensorCh4 {
  time: string;
  unit: string;
  value: string;
}

export interface TempHumiditySensorCh5 {
  time: string;
  unit: string;
  value: string;
}

export interface TempHumiditySensorCh6 {
  time: string;
  unit: string;
  value: string;
}

export interface TempHumiditySensorCh7 {
  time: string;
  unit: string;
  value: string;
}

export interface TempHumiditySensorCh8 {
  time: string;
  unit: string;
  value: string;
}

export interface SoilmoistureSensorCh1 {
  time: string;
  unit: string;
  value: string;
}

export interface SoilmoistureSensorCh2 {
  time: string;
  unit: string;
  value: string;
}

export interface SoilmoistureSensorCh3 {
  time: string;
  unit: string;
  value: string;
}

export interface SoilmoistureSensorCh4 {
  time: string;
  unit: string;
  value: string;
}

export interface SoilmoistureSensorCh5 {
  time: string;
  unit: string;
  value: string;
}

export interface SoilmoistureSensorCh6 {
  time: string;
  unit: string;
  value: string;
}

export interface SoilmoistureSensorCh7 {
  time: string;
  unit: string;
  value: string;
}

export interface SoilmoistureSensorCh8 {
  time: string;
  unit: string;
  value: string;
}

export interface TemperatureSensorCh1 {
  time: string;
  unit: string;
  value: string;
}

export interface TemperatureSensorCh2 {
  time: string;
  unit: string;
  value: string;
}

export interface TemperatureSensorCh3 {
  time: string;
  unit: string;
  value: string;
}

export interface TemperatureSensorCh4 {
  time: string;
  unit: string;
  value: string;
}

export interface TemperatureSensorCh5 {
  time: string;
  unit: string;
  value: string;
}

export interface TemperatureSensorCh6 {
  time: string;
  unit: string;
  value: string;
}

export interface TemperatureSensorCh7 {
  time: string;
  unit: string;
  value: string;
}

export interface TemperatureSensorCh8 {
  time: string;
  unit: string;
  value: string;
}

export interface LeafWetnessSensorCh1 {
  time: string;
  unit: string;
  value: string;
}

export interface LeafWetnessSensorCh2 {
  time: string;
  unit: string;
  value: string;
}

export interface LeafWetnessSensorCh3 {
  time: string;
  unit: string;
  value: string;
}

export interface LeafWetnessSensorCh4 {
  time: string;
  unit: string;
  value: string;
}

export interface LeafWetnessSensorCh5 {
  time: string;
  unit: string;
  value: string;
}

export interface LeafWetnessSensorCh6 {
  time: string;
  unit: string;
  value: string;
}

export interface LeafWetnessSensorCh7 {
  time: string;
  unit: string;
  value: string;
}

export interface LeafWetnessSensorCh8 {
  time: string;
  unit: string;
  value: string;
}

export interface Camera {
  photo: Photo;
}

export interface Photo {
  time: string;
  url: string;
}
