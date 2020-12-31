<template>
  <el-checkbox-group
    class="region-province__cities"
    @change="selectProvince"
    v-model="selectedProvincesRegionId"
  >
    <el-checkbox
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
    onChange: Function,
  },
  computed: {
    selectedProvincesRegionId() {
      return this.country.provinces
        .filter(function (e) {
          return e.selected;
        })
        .map(function (e) {
          return e.regionId;
        });
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
      this.$emit("onChange", country);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>