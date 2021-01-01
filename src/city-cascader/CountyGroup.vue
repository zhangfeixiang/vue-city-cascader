<template>
  <div class="region-part__block">
    <el-checkbox
      :indeterminate="part.indeterminate"
      :checked="part.selected"
      @change="selectPart"
      >{{ part.part }}
      <el-checkbox-group
        class="region-part__province"
        :value="selectedCountries"
        @change="selectCountry"
      >
        <el-checkbox
          v-for="(country, index) in part.countries"
          :key="country.regionId"
          :label="country.regionId"
          :indeterminate="country.indeterminate"
        >
          <el-popover
            v-if="country.provinces && country.provinces.length"
            placement="top"
            trigger="hover"
          >
            <Township
              :country="country"
              :index="index"
              @change="selectProvince(index)"
            />
            <span slot="reference">
              {{ country.name }}
              <span v-if="country.selectNum" class="region-part__num"
                >({{ country.selectNum }})</span
              >
              <i class="region-province__more"></i>
            </span>
          </el-popover>
          <template>
            {{ country.name }}
            <span v-if="country.selectNum" class="region-part__num"
              >({{ country.selectNum }})</span
            >
          </template>
        </el-checkbox>
      </el-checkbox-group>
    </el-checkbox>
  </div>
</template>

<script>
import Township from "./Township.vue";
export default {
  props: {
    change: Function,
    part: Object, // 其实是region
  },
  data() {
    return {};
  },
  components: {
    Township,
  },
  computed: {
    selectedCountries() {
      return this.part.countries
        .filter((e) => {
          return e.selected;
        })
        .map((e) => {
          return e.regionId;
        });
    },
  },
  methods: {
    selectProvince(index) {
      return (newVal) => {
        var part = this.part,
          countries = part.countries || [];
        countries.splice(index, 1, newVal);
        part.selected = countries.every((country) => {
          return country.selected;
        });
        part.indeterminate =
          !part.selected &&
          countries.some((e) => {
            return e.selected || e.indeterminate;
          });
        this.$emit("change", part);
      };
    },
    selectCountry(e) {
      var part = this.part,
        countries = part.countries || [];
      countries.forEach((_country) => {
        var regionId = _country.regionId,
          provinces = _country.provinces || [];
        if (-1 !== e.indexOf(regionId)) {
          _country.selected = true;
          _country.indeterminate = false;
          _country.selectNum =
            _country.provinces && _country.provinces.length
              ? _country.provinces.length
              : 1;
          provinces.forEach((e) => {
            e.selected = true;
          });
        } else {
          if (_country.indeterminate) return;
          _country.selected = false;
          _country.selectNum = 0;
          provinces.forEach((e) => {
            return (e.selected = false);
          });
        }
      });
      part.selected = e.length === countries.length;
      part.indeterminate =
        !part.selected &&
        countries.some((e) => {
          return e.selected || e.indeterminate;
        });
      this.$emit("change", part);
    },
    selectPart(checked) {
      var part = this.part,
        countries = part.countries || [];
      part.selected = checked;
      part.indeterminate = false;
      countries.forEach((t) => {
        var provinces = t.provinces || [];
        t.selected = checked;
        t.indeterminate = false;
        var o = t.provinces && t.provinces.length ? t.provinces.length : 1;
        t.selectNum = checked ? o : 0;
        provinces.forEach((province) => {
          province.selected = checked;
        });
      });
      this.$emit("change", part);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>