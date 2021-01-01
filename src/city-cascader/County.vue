
<template>
  <el-checkbox-group
    class="region-province__cities"
    @change="selectCounty"
    v-model="selectedCitiesRegionIds"
  >
    <el-checkbox
      v-for="county in city.counties"
      :key="county.regionId"
      :label="county.regionId"
      >{{ county.name }}</el-checkbox
    >
  </el-checkbox-group>
</template>

<script>
export default {
  computed: {
    selectedCitiesRegionIds: {
      get() {
        return (this.city || {}).counties
          .filter(function (e) {
            return e.selected;
          })
          .map(function (e) {
            return e.regionId;
          });
      },
      set(val) {
        for (let i = 0; i < this.city.counties.length; i++) {
          const item = this.city.counties[i];
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
  props: {
    city: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    selectCounty(e) {
      var city = this.city || {},
        counties = city.counties || [];
      counties.forEach(function (county) {
        -1 !== e.indexOf(county.regionId)
          ? (county.selected = !0)
          : (county.selected = !1);
      });
      if (counties.length === e.length) {
        city.selected = !0;
        city.indeterminate = !1;
      } else if (e.length > 0) {
        city.indeterminate = !0;
        city.selected = !1;
      } else if (0 === e.length) {
        city.indeterminate = !1;
        city.selected = !1;
      }
      city.selectNum = e.length;
      this.$emit("change", city);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>