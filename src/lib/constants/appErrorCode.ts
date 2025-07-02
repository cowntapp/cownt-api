const enum AppErrorCode {
  // Auth errors
  InvalidAccessToken = 'InvalidAccessToken',
  InvalidRefreshToken = 'InvalidRefreshToken',

  // Cow errors
  CowAlreadyExists = 'CowAlreadyExists',
  CowNotFound = 'CowNotFound',

  // Cow errors
  SheepAlreadyExists = 'SheepAlreadyExists',
  SheepNotFound = 'SheepNotFound',

  // Breed errors
  BreedAlreadyExists = 'BreedAlreadyExists',
  BreedNotFound = 'BreedNotFound',

  // Characteristic errors
  CharacteristicAlreadyExists = 'CharacteristicAlreadyExists',
  CharacteristicNotFound = 'CharacteristicNotFound',

  // Business logic errors
  MotherNotFound = 'MotherNotFound',
  InvalidOrigin = 'InvalidOrigin',
  InvalidBreedOrCharacteristic = 'InvalidBreedOrCharacteristic',
}

export default AppErrorCode;
