import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Http } from '@angular/http';

@Injectable()
export class AddressparseService {
  addressList: any[] = []; // 地址列表
  zipCodeList: any[] = []; // 邮编列表
  smartObj: any = {};
  constructor(private storage: StorageService, private http: Http) {
    console.log('正在加载省市区数据...');
    this.getData();
  }
   /**获取省市县 */
  getpccdata(): Promise<any> {
    return this.http.get(`store/api/projectcrm/province`).toPromise().then((res) => {
      return res.json() as any[];
    });
  }
   /**
   * 根据ng.ant.design省市县级联格式转换
   */
  cascaderAddressOptions() {
    return new Promise((resolve: (data) => void) => {
      this.getpccdata().then((response: any[]) => {
        const provinces = response[0]['options'];
        const cities = response[1]['options'];
        const areas = response[2]['options'];
        areas.forEach((area) => {
          const matchCity = cities.filter(city => city.value === area.parentVal)[0];
          if (matchCity) {
            matchCity.children = matchCity.children || [];
            matchCity.children.push({
              name: area.text,
              value: area.value + '',
              code: area.kid + '',
              isLeaf: true
            });
          }
        });
        cities.forEach((city) => {
          const matchProvince = provinces.filter(province => province.value === city.parentVal)[0];
          if (matchProvince) {
            matchProvince.children = matchProvince.children || [];
            matchProvince.children.push({
              name: city.text,
              value: city.value + '',
              code: city.kid + '',
              children: city.children ? city.children : [],
            });
          }
        });
        const options = provinces.map(province => ({
          name: (province.text === '北京' || province.text === '天津' ||
                 province.text === '上海' || province.text === '重庆') ? province.text + '市' : province.text,
          value: province.value + '',
          code: province.kid + '',
          children: province.children ? province.children : [],
          isLeaf: province.children ? false : true,
        }));
        resolve(options);
      });
    });
  }
  /**
   * 初次加载会调用接口请求数据，后续会从缓存中读取
   */
  wx_getaddress = () => {
    return new Promise((resolve, reject) => {
      let array: any[] = [];
      let index = 0;
      const length = 1;
      // const length = 7;
      // console.log('共计' + length + '条数据')
      for (let i = 0; i < length; i++) {
        if (this.storage.getObject(i + '')) {
          index++;
          // console.log('第' + index + '条数据在缓存中读取完毕')
          array = [...array, ...JSON.parse(this.storage.getObject(i + ''))];
          if (index === length) {
            resolve(array);
          }
        } else {
          setTimeout(() => {
            this.http.get('assets/server/address/database_export-sw0HKSJkxA1j.json').toPromise().then((res: any) => {
            // this.http.get(`ssx/${i}`).toPromise().then((res: any) => {
              const params = res['data'].json() as any[];
              index++;
              this.storage.setObject(i + '', params);
              //  console.log('第' + index + '条数据加载完毕')
              array = [...array, ...res.data];
              if (index === length) {
                resolve(array);
              }
            });
          }, 2000 * i);
        }
      }
    });
  }
  /**
   * 获取省市县数据
   */
  getData() {
    if (this.storage.getObject('pcc')) {
      this.addressList = this.storage.getObject('pcc');
    } else {
      this.cascaderAddressOptions().then((res: any[]) => {
        if (this.storage.getObject('pcc')) {
          return;
        }
        this.addressList = res;
        this.addressList.forEach(item => {
          this.formatAddresList(item, 1, '');
        });
        this.storage.setObject('pcc', this.addressList);
        console.log('省市区数据挂载完毕！！');
      });
    }
  }
  /**
   * 地址数据处理
   * @param addressList-各级数据对象
   * @param index-对应的省/市/县区/街道
   * @param province-只有直辖市会处理为  北京市北京市
   * @returns <array>
   */
  formatAddresList(addressList, index, province) {
    if (index === 1) {
      // 省
      addressList.province = addressList.name;
    }
    if (index === 2) {
      // 市
      if (addressList.name === '市辖区') {
        addressList.name = province.name;
      }
      addressList.city = addressList.name;
    }
    if (index === 3) {
      // 区或者县
      addressList.county = addressList.name;
    }
    if (index === 4) {
      // 街道
      addressList.street = addressList.name;
    }
    if (addressList.children) {
      index++;
      addressList.children.forEach(res => {
        this.formatAddresList(res, index, addressList);
      });
    }
  }

  /**
   * 解析地址
   * @param event识别的地址
   * @returns <obj>
   */
  parsingAddress(event) {
    event = this.stripscript(event); // 过滤特殊字符
    let obj = {};
    let copyaddress = JSON.parse(JSON.stringify(event));
    copyaddress = copyaddress.split(' ');
    copyaddress.forEach((res, index) => {
      if (res) {
        if (res.length === 1) {
          res += 'XX'; // 过滤掉一位的名字或者地址
        }
        const addressObj = this.smatrAddress(res);
        obj = Object.assign(obj, addressObj);
        if (JSON.stringify(addressObj) === '{}') {
          obj['name'] = res.replace('XX', '');
        }
      }
    });
    return obj;
  }
  smatrAddress(event) {
    this.smartObj = {};
    let address = event;
    // address=  event.replace(/\s/g, ''); //去除空格
    address = this.stripscript(address); // 过滤特殊字符
    // 身份证号匹配
    if (this.IdentityCodeValid(address)) {
      this.smartObj.idCard = address;
      address = address.replace(address, '');
    }
    // 电话匹配
    const phone = address.match(
      /(86-[1][0-9]{10}) | (86[1][0-9]{10})|([1][0-9]{10})/g
    );
    if (phone) {
      this.smartObj.phone = phone[0];
      address = address.replace(phone[0], '');
    }
    // 邮编匹配 已删掉
    let matchAddress = '';
    // 省匹配 比如输入北京市朝阳区，会用北  北京  北京市 北京市朝 以此类推在addressList里的province中做匹配，会得到北京市  河北省 天津市等等；
    const matchProvince = []; // 粗略匹配上的省份
    matchAddress = '';
    for (let endIndex = 0; endIndex < address.length; endIndex++) {
      matchAddress = address.slice(0, endIndex + 2);
      this.addressList.forEach(res => {
        if (res['province'].indexOf(matchAddress) !== -1) {
          let city = '', citycode = '', cityvalue = '';
          if (
            res.province === '北京市' ||
            res.province === '天津市' ||
            res.province === '上海市' ||
            res.province === '重庆市'
          ) {
            if (res.children.length) {
              const childrenobj = res.children[0];
              city = childrenobj['name'];
              citycode = childrenobj['code'];
              cityvalue = childrenobj['value'];
            }
          }
          matchProvince.push({
            province: res.province,
            provinceCode: res.code,
            provinceValue: res.value,
            city: city,
            cityCode: citycode,
            cityValue: cityvalue,
            matchValue: matchAddress
          });
        }
      });
    }
    // 统计筛选初略统计出的省份
    matchProvince.forEach(res => {
      res.index = 0;
      matchProvince.forEach(el => {
        if (res.province === el.province) {
          el.index++;
          if (res.matchValue.length > el.matchValue.length) {
            el.matchValue = res.matchValue;
          }
        }
      });
    });
    if (matchProvince.length !== 0) {
      const province = matchProvince.reduce((p, v) => (p.index < v.index ? v : p));
      this.smartObj.province = province.province;
      this.smartObj.provinceCode = province.provinceCode;
      this.smartObj.provinceValue = province.provinceValue;
      if (province['city'] && province['cityCode'] && province['cityValue']) {
        this.smartObj.city = province.city;
        this.smartObj.cityCode = province.cityCode;
        this.smartObj.cityValue = province.cityValue;
      }
      address = address.replace(province.matchValue, '');
    }
    // 市查找
    const matchCity = []; // 粗略匹配上的市
    matchAddress = '';
    for (let endIndex = 0; endIndex < address.length; endIndex++) {
      matchAddress = address.slice(0, endIndex + 2);
      this.addressList.forEach(el => {
        //  if (el.name == smartObj.province) {
        if (el.code === this.smartObj.provinceCode || !this.smartObj.provinceCode) {
          if (
            this.smartObj.province === '北京市' ||
            this.smartObj.province === '天津市' ||
            this.smartObj.province === '上海市' ||
            this.smartObj.province === '重庆市'
          ) {
            if (!el.children) {
              return;
            }
            el.children.forEach(item => {
              if (!item.children) {
                return;
              }
              item.children.forEach(res => {
                if (res['county'].indexOf(matchAddress) !== -1) {
                  matchCity.push({
                    county: res.county,
                    countyCode: res.code,
                    countyValue: res.value,
                    city: item.city,
                    cityCode: item.code,
                    cityValue: item.value,
                    matchValue: matchAddress,
                    province: el.province,
                    provinceCode: el.code,
                    provinceValue: el.value
                  });
                }
              });
            });
          } else {
            if (!el.children) {
              return;
            }
            el.children.forEach(res => {
              if (res['city'].indexOf(matchAddress) !== -1) {
                matchCity.push({
                  city: res.city,
                  cityCode: res.code,
                  cityValue: res.value,
                  matchValue: matchAddress,
                  province: el.province,
                  provinceCode: el.code,
                  provinceValue: el.value
                });
              }
            });
          }
        }
        // }
      });
    }

    // 统计筛选初略统计出的市
    matchCity.forEach(res => {
      res.index = 0;
      matchCity.forEach(el => {
        if (res.city === el.city) {
          el.index++;
          if (res.matchValue.length > el.matchValue.length) {
            el.matchValue = res.matchValue;
          }
        }
      });
    });
    if (matchCity.length !== 0) {
      const city = matchCity.reduce((p, v) => (p.index < v.index ? v : p));
      this.smartObj.city = city.city;
      this.smartObj.cityCode = city.cityCode;
      this.smartObj.cityValue = city.cityValue;
      this.smartObj.county = city.county;
      this.smartObj.countyCode = city.countyCode;
      this.smartObj.countyValue = city.countyValue;
      if (!this.smartObj.province) {
        this.smartObj.province = city.province;
        this.smartObj.provinceCode = city.provinceCode;
        this.smartObj.provinceValue = city.provinceValue;
      }
      address = address.replace(city.matchValue, '');
    }

    // 区县查找
    const matchCounty = []; // 粗略匹配上的区县
    matchAddress = '';
    for (let endIndex = 0; endIndex < address.length; endIndex++) {
      matchAddress = address.slice(0, endIndex + 2);
      this.addressList.forEach(el => {
        //  if (el.name == smartObj.province) {
        if (
          this.smartObj.province === '北京市' ||
          this.smartObj.province === '天津市' ||
          this.smartObj.province === '上海市' ||
          this.smartObj.province === '重庆市'
        ) {
          // nothing
        } else {
          if (!el.children) {
            return;
          }
          el.children.forEach(item => {
            //  if (item.name == smartObj.city) {
            if (!item.children) {
              return;
            }
            item.children.forEach(res => {
              if (res['county'].indexOf(matchAddress) !== -1) {
                // 省/市  || 省
                if (this.smartObj.province && this.smartObj.city) {
                  if (res.code.slice(0, 2) === this.smartObj.provinceCode.slice(0, 2) &&
                    res.code.slice(0, 4) === this.smartObj.cityCode.slice(0, 4)) {
                    matchCounty.push({
                      county: res.county,
                      countyCode: res.code,
                      countyValue: res.value,
                      city: item.city,
                      cityCode: item.code,
                      cityValue: item.value,
                      matchValue: matchAddress,
                      province: el.province,
                      provinceCode: el.code,
                      provinceValue: el.value
                    });
                  }
                } else if (this.smartObj.province) {
                  if (res.code.slice(0, 2) === this.smartObj.provinceCode.slice(0, 2)) {
                    matchCounty.push({
                      county: res.county,
                      countyCode: res.code,
                      countyValue: res.value,
                      city: item.city,
                      cityCode: item.code,
                      cityValue: item.value,
                      matchValue: matchAddress,
                      province: el.province,
                      provinceCode: el.code,
                      provinceValue: el.value
                    });
                  }
                } else if (!this.smartObj.province && !this.smartObj.city) {
                  matchCounty.push({
                    county: res.county,
                    countyCode: res.code,
                    countyValue: res.value,
                    city: item.city,
                    cityCode: item.code,
                    cityValue: item.value,
                    matchValue: matchAddress,
                    province: el.province,
                    provinceCode: el.code,
                    provinceValue: el.value
                  });
                }
              }
            });
            //  }
          });
        }
        //  }
      });
    }
    // 统计筛选初略统计出的区县
    matchCounty.forEach(res => {
      res.index = 0;
      matchCounty.forEach(el => {
        if (res.city === el.city) {
          el.index++;
          if (res.matchValue.length > el.matchValue.length) {
            el.matchValue = res.matchValue;
          }
        }
      });
    });
    if (matchCounty.length !== 0) {
      const city = matchCounty.reduce((p, v) => (p.index < v.index ? v : p));
      this.smartObj.county = city.county;
      this.smartObj.countyCode = city.countyCode;
      this.smartObj.countyValue = city.countyValue;
      if (!this.smartObj.province) {
        this.smartObj.province = city.province;
        this.smartObj.provinceCode = city.provinceCode;
        this.smartObj.provinceValue = city.provinceValue;
      }
      if (!this.smartObj.city) {
        this.smartObj.city = city.city;
        this.smartObj.cityCode = city.cityCode;
        this.smartObj.cityValue = city.cityValue;
      }
      address = address.replace(city.matchValue, '');
    }

    // 街道查找
    const matchStreet = []; // 粗略匹配上的街道查
    matchAddress = '';
    for (let endIndex = 0; endIndex < address.length; endIndex++) {
      matchAddress = address.slice(0, endIndex + 3);
      this.addressList.forEach(el => {
        if (el.name === this.smartObj.province) {
          if (
            this.smartObj.province === '北京市' ||
            this.smartObj.province === '天津市' ||
            this.smartObj.province === '上海市' ||
            this.smartObj.province === '重庆市'
          ) {
            // nothing
          } else {
            if (!el.children) {
              return;
            }
            el.children.forEach(element => {
              if (element.name === this.smartObj.city) {
                if (!element.children) {
                  return;
                }
                element.children.forEach(item => {
                  if (item.name === this.smartObj.county) {
                    if (!item.children) {
                      return;
                    }
                    item.children.forEach(res => {
                      if (res['street'].indexOf(matchAddress) !== -1) {
                        matchStreet.push({
                          street: res.street,
                          streetCode: res.value,
                          matchValue: matchAddress
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        }
      });
    }

    // 统计筛选初略统计出的区县
    matchStreet.forEach(res => {
      res.index = 0;
      matchStreet.forEach(el => {
        if (res.city === el.city) {
          el.index++;
          if (res.matchValue.length > el.matchValue.length) {
            el.matchValue = res.matchValue;
          }
        }
      });
    });

    if (matchStreet.length !== 0) {
      const city = matchStreet.reduce((p, v) => (p.index < v.index ? v : p));
      this.smartObj.street = city.street;
      this.smartObj.streetCode = city.streetCode;
      address = address.replace(city.matchValue, '');
    }
    // 姓名查找
    if (this.smartObj.province) {
      this.smartObj.address = address;
    }

    return this.smartObj;
  }
  /**
   * 过滤特殊字符
   * @param s 字符
   */
  stripscript(s) {
    s = s.replace(/(\d{3})-(\d{4})-(\d{4})/g, '$1$2$3');
    s = s.replace(/(\d{3}) (\d{4}) (\d{4})/g, '$1$2$3');
    const pattern = new RegExp(
      "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“’。，、？-]"
    );
    let rs = '';
    for (let i = 0; i < s.length; i++) {
      rs = rs + s.substr(i, 1).replace(pattern, ' ');
    }
    rs = rs.replace(/[\r\n]/g, '');
    return rs;
  }
  /**
   * 身份证号码识别
   * @param code 身份证
   */
  IdentityCodeValid(code) {
    let pass;
    const city = {
      11: '北京',
      12: '天津',
      13: '河北',
      14: '山西',
      15: '内蒙古',
      21: '辽宁',
      22: '吉林',
      23: '黑龙江 ',
      31: '上海',
      32: '江苏',
      33: '浙江',
      34: '安徽',
      35: '福建',
      36: '江西',
      37: '山东',
      41: '河南',
      42: '湖北 ',
      43: '湖南',
      44: '广东',
      45: '广西',
      46: '海南',
      50: '重庆',
      51: '四川',
      52: '贵州',
      53: '云南',
      54: '西藏 ',
      61: '陕西',
      62: '甘肃',
      63: '青海',
      64: '宁夏',
      65: '新疆',
      71: '台湾',
      81: '香港',
      82: '澳门',
      91: '国外 '
    };
    let tip = '';
    pass = true;

    if (!code || !/^\d{17}(\d|X)$/i.test(code)) {
      tip = '身份证号格式错误';
      pass = false;
    } else if (!city[code.substr(0, 2)]) {
      tip = '地址编码错误';
      pass = false;
    } else {
      // 18位身份证需要验证最后一位校验位
      if (code.length === 18) {
        code = code.split('');
        // ∑(ai×Wi)(mod 11)
        // 加权因子
        const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        // 校验位
        const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        let sum = 0;
        let ai = 0;
        let wi = 0;
        for (let i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        if (parity[sum % 11] !== code[17]) {
          tip = '校验位错误';
          pass = false;
        }
      }
    }
    return pass;
  }

}
