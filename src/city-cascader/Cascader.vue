

<template>
  <div>
    <template v-for="(t, n) in regionList">
      <Countries
        :key="t.part"
        v-if="t.countries.length"
        :part="t"
        @onChange="(val) => handleChange(n)(val)"
      ></Countries>
      <Region
        :key="t.part"
        v-else
        :part="t"
        @onChange="(val) => handleChange(n)(val)"
      ></Region>
    </template>
    <div class="region-dialog__footer">
      <el-checkbox
        :checked="checked"
        :value="checked"
        :indeterminate="indeterminate"
        @change="selectAll"
        >全选</el-checkbox
      >
      <div class="region-dialog__submit">
        <p v-if="regionNum">已选择{{ regionNum }}个区域</p>
        <el-button
          type="primary"
          @click="handleSubmit"
          :disabled="!checked && !indeterminate"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Countries from "./Countries.vue";
import Region from "./Region.vue";
const defaultOptions = {
  showOversea: false,
  isShowThreeLevel: false,
  regions: [],
};
import regions from "./const/region";
import { getCodes, directCity } from "./../utils";

function fetchRegionData() {
  return new Promise((resolve) => {
    resolve(regions);
  });
}
export default {
  components: {
    Countries,
    Region,
  },
  props: {
    showOversea: Boolean,
    isShowThreeLevel: Boolean,
    value: {
      type: Array,
      default: () => [],
    },
    ignore: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      regionList: [],
      regionNum: 0,
      loading: true,
    };
  },
  computed: {
    checked: {
      get() {
        return (
          !!this.regionList.length &&
          this.regionList.every((e) => {
            return e.selected;
          })
        );
      },
    },
    indeterminate() {
      return (
        !this.checked &&
        this.regionList.some((e) => {
          return e.selected || e.indeterminate;
        })
      );
    },
  },
  watch: {
    value: {
      handler: function () {
        this.getData();
      },
      deep: true,
    },
  },
  created() {
    this.getData();
  },
  methods: {
    handleChange(index) {
      return (newVal) => {
        let regionList = this.regionList,
          selectNum = 0;
        regionList.splice(index, 1, newVal);
        regionList.forEach((region) => {
          let _provinces = region.provinces,
            provinces = _provinces || [];
          let countries = region.countries || [];
          provinces.forEach((province) => {
            selectNum += province.selectNum || 0;
          });
          countries.forEach((_city) => {
            selectNum += _city.selectNum || 0;
          });
        });
        this.regionList = regionList;
        this.regionNum = selectNum;
      };
    },
    selectAll(checked) {
      const regionList = this.regionList || [];
      let regionNum = 0;
      regionList.forEach((region) => {
        let provinces = region.provinces || [];
        let countries = region.countries || [];
        region.selected = checked;
        region.indeterminate = false;
        provinces.forEach((province) => {
          let selectNum = 0,
            cities = province.cities;
          province.selected = checked;
          province.indeterminate = false;
          cities.forEach((city) => {
            city.selected = checked;
            city.indeterminate = false;
            let counties = city.counties || [];
            city.selectNum = checked ? counties.length || 1 : 0;
            selectNum += city.selectNum;
            counties.forEach((county) => {
              return (county.selected = checked);
            });
          });
          province.selectNum = selectNum;
          regionNum += province.selectNum;
        });
        countries.forEach((country) => {
          let provinces = country.provinces || [];
          country.selected = checked;
          country.indeterminate = false;
          let i =
            country.provinces && country.provinces.length
              ? country.provinces.length
              : 1;
          country.selectNum = checked ? i : 0;
          provinces.forEach((_province) => {
            return (_province.selected = checked);
          });
          regionNum += country.selectNum;
        });
      });
      this.$set(this, "regionList", regionList);
      this.regionNum = regionNum;
    },
    getData() {
      const showOversea = this.showOversea;
      const isShowThreeLevel = this.isShowThreeLevel;
      if (
        defaultOptions.regions.length > 0 &&
        defaultOptions.showOversea === showOversea &&
        defaultOptions.isShowThreeLevel === isShowThreeLevel
      ) {
        this.initData(defaultOptions.regions);
      } else {
        fetchRegionData({
          showOversea: showOversea,
          isShowThreeLevel: isShowThreeLevel,
        }).then((regions) => {
          this.initData(regions);
          defaultOptions.regions = regions;
          defaultOptions.isShowThreeLevel = isShowThreeLevel;
          defaultOptions.showOversea = showOversea;
        });
      }
    },

    initData(regions) {
      let ignore = this.ignore;
      let regionNum = 0;
      regions = JSON.parse(JSON.stringify(regions));
      regions = regions.filter((e) => {
        let provinces = e.provinces || [];
        let countries = e.countries || [];
        return (
          (e.provinces = provinces
            .filter((e) => {
              return -1 === ignore.indexOf(e.regionId);
            })
            .map((province) => {
              province.selected = false;
              province.selectNum = 0;
              let _selectNum = 0,
                regionId = province.regionId,
                cities = province.cities || [];
              return (
                -1 !== this.value.indexOf(regionId) &&
                  (province.selected = true),
                cities.length &&
                  ((province.cities = cities.filter((city) => {
                    var counties = city.counties || [],
                      noIgnore = -1 === ignore.indexOf(city.regionId);

                    return (
                      noIgnore
                        ? (city.selected ||
                            -1 !== this.value.indexOf(city.regionId)) &&
                          (city.selected = true)
                        : (city.hasIgnore = true),
                      (city.counties = counties.filter((county) => {
                        (city.selected ||
                          -1 !== this.value.indexOf(county.regionId)) &&
                          (county.selected = true);
                        var r = -1 === ignore.indexOf(county.regionId);
                        return (
                          r ||
                            ((city.hasIgnore = true), (city.hasIgnore = true)),
                          r
                        );
                      })),
                      (city.selected = city.counties.length
                        ? city.counties.every((e) => {
                            return e.selected;
                          })
                        : city.selected),
                      (city.indeterminate =
                        !city.selected &&
                        city.counties.some((e) => {
                          return e.selected;
                        })),
                      (city.selectNum = city.counties.filter((e) => {
                        return e.selected;
                      }).length),
                      (_selectNum += city.selectNum),
                      (!city.hasIgnore || 0 !== city.counties.length) &&
                        noIgnore
                    );
                  })),
                  (province.selectNum = _selectNum)),
                (regionNum += province.selectNum),
                !province.selected &&
                  province.cities.length &&
                  ((province.selected = province.cities.every((_city) => {
                    return _city.selected;
                  })),
                  (province.indeterminate =
                    !province.selected &&
                    province.cities.some((e) => {
                      return e.selected || e.indeterminate;
                    }))),
                province
              );
            })
            .filter((_provinces) => {
              return (
                !_provinces.hasIgnore ||
                (_provinces.cities && _provinces.cities.length)
              );
            })),
          (e.countries = countries
            .filter((e) => {
              return -1 === ignore.indexOf(e.regionId);
            })
            .map((__city) => {
              var regionId = __city.regionId,
                n = __city.provinces,
                provinces = void 0 === n ? [] : n;
              if (
                (-1 !== this.value.indexOf(regionId) &&
                  ((__city.selected = true),
                  (__city.selectNum = provinces.length ? provinces.length : 1)),
                provinces.length)
              ) {
                var i = 0;
                (__city.provinces = provinces.filter((t) => {
                  var n = -1 === ignore.indexOf(t.regionId);
                  return (
                    n
                      ? __city.selected
                        ? (t.selected = true)
                        : -1 !== this.value.indexOf(t.regionId) &&
                          ((t.selected = true), i++)
                      : (__city.hasIgnore = true),
                    n
                  );
                })),
                  (__city.selectNum = i);
              }
              return (
                (regionNum += __city.selectNum || 0),
                !__city.selected &&
                  __city.provinces.length &&
                  ((__city.selected = __city.provinces.every((e) => {
                    return e.selected;
                  })),
                  (__city.indeterminate =
                    !__city.selected &&
                    __city.provinces.some((e) => {
                      return e.selected;
                    }))),
                __city
              );
            })
            .filter((e) => {
              return !e.hasIgnore || (e.provinces && e.provinces.length);
            })),
          (e.selected =
            (e.countries.length > 0 &&
              e.countries.every((e) => {
                return e.selected;
              })) ||
            (e.provinces.length > 0 &&
              e.provinces.every((e) => {
                return e.selected;
              }))),
          (e.indeterminate =
            !e.selected &&
            ((!!e.countries.length &&
              e.countries.some((e) => {
                return e.selected || e.indeterminate;
              })) ||
              (!!e.provinces.length &&
                e.provinces.some((e) => {
                  return e.selected || e.indeterminate;
                })))),
          (e.provinces && e.provinces.length) ||
            (e.countries && e.countries.length)
        );
      });
      this.$set(this, "regionList", regions);
      this.regionNum = regionNum;
      this.loading = false;
    },

    handleSubmit: function () {
      var selectedList = this.regionList.reduce(function (total, part) {
        var _provinces = part.provinces;
        return total.concat(
          _provinces.map(function (province) {
            var cities = province.cities;
            // 直辖市，并且cities为空
            if (
              directCity.indexOf(province.regionId) > -1 &&
              !province.cities.length
            ) {
              cities = [
                {
                  regionId: province.regionId,
                  name: province.name,
                  selected: province.selected,
                },
              ];
            }
            return Object.assign(province, {
              cities: cities,
            });
          })
        );
      }, new Array());
      let value = getCodes(selectedList);

      this.$emit("input", value);
      this.$emit("on-submit", value, selectedList);
      this.$emit("on-close");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>