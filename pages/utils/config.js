class Config{
  constructor(){}
}
//如果需要后端接口地址请联系 加V: 18850737047
Config.debug = false;
Config.restUrl = Config.debug ? 'http://diancan.com/api/v1/' : "https://api.coderyun.cn/api/v1/";
Config.picUrl = Config.debug ? 'http://diancan.com' : "https://api.coderyun.cn";

 
    
export {Config}; 