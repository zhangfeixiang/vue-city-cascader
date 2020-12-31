<template>
  <el-checkbox-group
    class="region-province__cities"
    @change="selectCity"
    v-model="selectedCitiesRegionIds"
  >
    <el-checkbox
      class="checkbox-wrap"
      v-for="(_city, _index) in province.cities"
      :key="_city.regionId"
      :label="_city.regionId"
      :indeterminate="_city.indeterminate"
    >
      <!-- 市区有县级 -不走这里-->
      <el-popover
        v-if="_city.counties && _city.counties.length"
        trigger="hover"
        placement="right"
      >
        <County :city="_city" @onChange="selectCounty(_index)" />
        <span slot="reference">
          {{ _city.name }}
          <span v-if="_city.selectNum" class="region-part__num"
            >({{ _city.selectNum }})</span
          >
          <i class="region-province__more"></i>
        </span>
      </el-popover>
      <template>
        {{ _city.name }}
        <span v-if="_city.selectNum" class="region-part__num"
          >({{ _city.selectNum }})</span
        >
      </template>
    </el-checkbox>
  </el-checkbox-group>
</template>

<script>
import County from "./County.vue";
export default {
  components: {
    County,
  },
  props: {
    province: Object,
    onChange: Function,
  },
  computed: {
    selectedCitiesRegionIds: {
      get() {
        return this.province.cities
          .filter((e) => {
            return e.selected;
          })
          .map((e) => {
            return e.regionId;
          });
      },
      set(val) {
        for (let i = 0; i < this.province.cities.length; i++) {
          const item = this.province.cities[i];
          if (val.includes(item.regionId)) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        }

        this.$emit("input", val);
      },
    },
  },
  methods: {
    selectCounty(index) {
      return (newVal) => {
        var province = this.province;
        province.cities.splice(index, 1, newVal);
        var cities = province.cities;
        var citySelectNum = 0;

        cities.forEach((_city) => {
          return (citySelectNum += _city.selectNum);
        });

        province.selected = cities.every((_city) => {
          return _city.selected;
        });
        province.selectNum = citySelectNum;
        province.indeterminate =
          !province.selected &&
          cities.some((_city) => {
            return _city.selected || _city.indeterminate;
          });

        this.$emit("onChange", province);
      };
    },

    selectCity(currentCity) {
      var province = this.province,
        cities = province.cities,
        citySelectNum = 0;
      cities.forEach((_city) => {
        if (-1 !== currentCity.indexOf(_city.regionId)) {
          let counties = _city.counties || [];
          _city.selected = !0;
          _city.indeterminate = !1;
          _city.selectNum = counties.length;
          citySelectNum += _city.selectNum;
          counties.forEach((county) => {
            county.selected = !0;
          });
        } else {
          if (_city.indeterminate) return;
          let counties = _city.counties || [];
          _city.selected = !1;
          _city.selectNum = 0;
          counties.forEach((county) => {
            county.selected = !1;
          });
        }
      });
      province.indeterminate =
        currentCity.length > 0 && currentCity.length < cities.length;
      province.selected = currentCity.length === cities.length;
      province.selectNum = citySelectNum;
      this.$emit("onChange", province);
    },
  },
};
</script>

<style lang="scss" scoped>
.region-province__cities {
  max-height: 300px;
  overflow-y: auto;
  .checkbox-wrap {
    display: flex;
    align-items: center;
    font-size: 0;
    margin-top: 10px;
    .pop-wrapper {
      font-size: 0;
    }
  }
}
</style>