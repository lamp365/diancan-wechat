class Config{
  constructor(){}
}

Config.debug = false;
Config.restUrl = Config.debug ? 'http://diancan.com/api/v1/' : "https://diancan.coderyun.cn/api/v1/";


   
export {Config}; 