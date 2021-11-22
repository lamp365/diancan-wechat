class Config{
  constructor(){}
}

Config.debug = false;
Config.restUrl = Config.debug ? 'http://diancan.com/api/v1/' : "http://diancan.com/api/v1/";
Config.getSystem = Config.restUrl+'getSystem';


export {Config};