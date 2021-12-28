class Config{
  constructor(){}
}

Config.debug = true;
Config.restUrl = Config.debug ? 'http://diancan.com/api/v1/' : "https://diancan.coderyun.cn/api/v1/";
Config.picUrl = Config.debug ? 'http://diancan.com' : "https://diancan.coderyun.cn";

 
    
export {Config}; 