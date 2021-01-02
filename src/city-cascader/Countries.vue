<template>
  <!-- 海外-国家有下级：demo里未展示这部分provinces:[] -->
  <el-checkbox-group
    class="region-province__cities"
    @change="selectProvince"
    v-model="selectedProvincesRegionIds"
  >
    <el-checkbox
      class="checkbox-wrap"
      v-for="province in country.provinces"
      :key="province.regionId"
      :label="province.regionId"
      >{{ province.name }}</el-checkbox
    >
  </el-checkbox-group>
</template>

<script>
export default {
  props: {
    country: Object,
    change: Function,
  },
  computed: {
    selectedProvincesRegionIds: {
      get() {
        return this.country.provinces
          .filter(function (e) {
            return e.selected;
          })
          .map(function (e) {
            return e.regionId;
          });
      },
      set(val) {
        for (let i = 0; i < this.country.provinces.length; i++) {
          const item = this.country.provinces[i];
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
    selectProvince(currentProvince) {
      var country = this.country,
        provinces = country.provinces;
      provinces.forEach(function (_province) {
        -1 !== currentProvince.indexOf(_province.regionId)
          ? (_province.selected = !0)
          : (_province.selected = !1);
      });
      country.indeterminate =
        currentProvince.length > 0 &&
        currentProvince.length <
          provinces.length(
            (country.selected = currentProvince.length === provinces.length)
          );
      country.selectNum = currentProvince.length;
      this.$emit("change", country);
    },
  },
};
</script>
