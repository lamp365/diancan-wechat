class Config{
  constructor(){}
}

Config.debug = true;
Config.restUrl = Config.debug ? 'http://diancan.com/api/v1/' : "http://d.gxqczy.cn/api/v1/";



export {Config};