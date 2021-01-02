<template>
  <div class="region-part__block">
    <!-- 地区 -->
    <el-checkbox
      class="checkbox-wrap"
      :indeterminate="part.indeterminate"
      :checked="part.selected"
      v-model="part.selected"
      @change="selectPart"
      >{{ part.part }}
    </el-checkbox>
    <el-checkbox-group
      class="region-part__province"
      v-model="selectedProvinces"
      @change="selectProvince"
    >
      <!-- 省份-前的选择框 -->
      <el-checkbox
        class="checkbox-wrap"
        v-for="(_province, index) in part.provinces"
        :key="_province.regionId"
        :label="_province.regionId"
        v-model="_province.selected"
        :indeterminate="_province.indeterminate"
      >
        <!-- 省份有下级 -->
        <el-popover
          v-if="_province.cities && _province.cities.length"
          trigger="hover"
          :placement="position"
        >
          <Provinces
            :province="_province"
            :index="index"
            @change="(val) => selectCity(index)(val)"
          />
          <span slot="reference">
            {{ _province.name }}
            <span v-if="_province.selectNum" class="region-part__num"
              >({{ _province.selectNum }})</span
            >
            <i class="region-province__more"></i>
          </span>
        </el-popover>
        <!-- 直辖市 -->
        <template v-else>
          {{ _province.name }}
          <span v-if="_province.selectNum" class="region-part__num"
            >({{ _province.selectNum }})</span
          >
        </template>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import Provinces from "./Provinces.vue";
export default {
  components: {
    Provinces,
  },
  props: {
    change: Function,
    part: Object, // 其实是region
  },
  computed: {
    selectedProvinces: {
      get() {
        return this.part.provinces
          .filter((e) => {
            return e.selected;
          })
          .map((_city) => {
            return _city.regionId;
          });
      },
      set(val) {
        for (let i = 0; i < this.part.provinces.length; i++) {
          const item = this.part.provinces[i];
          if (val.includes(item.regionId)) {
            this.$set(item, "selected", true);
          } else {
            this.$set(item, "selected", false);
          }
        }
      },
    },
    position() {
      return -1 !== ["西北", "西南", "港澳台"].indexOf(this.part.part)
        ? "top"
        : "bottom";
    },
  },
  methods: {
    selectCity(index) {
      return (newVal) => {
        var part = this.part,
          provinces = part.provinces || [];
        provinces.splice(index, 1, newVal);
        part.selected = provinces.every((country) => {
          return country.selected;
        });
        part.indeterminate =
          !part.selected &&
          provinces.some((e) => {
            return e.selected || e.indeterminate;
          });
        this.$emit("change", part);
      };
    },
    selectProvince(e) {
      var part = this.part,
        provinces = part.provinces || [];
      provinces.forEach((province) => {
        var n = 0;
        var regionId = province.regionId,
          cities = province.cities || [];
        if (-1 !== e.indexOf(regionId)) {
          province.selected = true;
          province.indeterminate = false;
          cities.forEach((_city) => {
            var t = _city.counties,
              _counties = void 0 === t ? [] : t;
            _city.selected = true;
            _city.indeterminate = false;
            _counties.forEach((_county) => {
              _county.selected = true;
            });
            _city.selectNum = _counties.length || 1;
            n += _city.selectNum;
          }),
            (province.selectNum = n);
        } else {
          if (province.indeterminate) return;
          province.selected = false;
          province.selectNum = 0;
          cities.forEach((e) => {
            var t = e.counties,
              _counties = void 0 === t ? [] : t;
            e.selected = false;
            e.selectNum = 0;
            _counties.forEach((_county) => {
              _county.selected = false;
            });
          });
        }
      });
      part.selected = e.length === provinces.length;
      part.indeterminate =
        !part.selected &&
        provinces.some((e) => {
          return e.selected || e.indeterminate;
        });
      this.$emit("change", part);
    },
    selectPart(checked) {
      var part = this.part;
      part.selected = checked;
      part.indeterminate = false;
      part.provinces.forEach((_province) => {
        var _cities = _province.cities || [];
        _province.selected = checked;
        _province.indeterminate = false;
        var provinceSelectNum = 0;
        _cities.forEach((t) => {
          var counties = t.counties || [];
          t.selected = checked;
          t.selectNum = checked ? counties.length || 1 : 0;
          provinceSelectNum += t.selectNum;
          t.indeterminate = false;
          counties.forEach((_county) => {
            _county.selected = checked;
          });
        });
        _province.selectNum = provinceSelectNum;
      });
      this.$emit("change", part);
    },
  },
};
</script>
