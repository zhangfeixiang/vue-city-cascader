<template>
  <div class="region-part__block">
    <!-- 海外 -->
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
      v-model="selectedCountries"
      @change="selectCountry"
    >
      <el-checkbox
        class="checkbox-wrap"
        v-for="(country, index) in part.countries"
        :key="country.regionId"
        :label="country.regionId"
        v-model="country.selected"
        :indeterminate="country.indeterminate"
      >
        <!-- 海外国家下级 -->
        <el-popover
          v-if="country.provinces && country.provinces.length"
          placement="top"
          trigger="hover"
        >
          <Countries
            :country="country"
            :index="index"
            @change="(val) => selectProvince(index)(val)"
          />
          <span slot="reference">
            {{ country.name }}
            <span v-if="country.selectNum" class="region-part__num"
              >({{ country.selectNum }})</span
            >
            <i class="region-province__more"></i>
          </span>
        </el-popover>
        <template v-else>
          {{ country.name }}
          <span v-if="country.selectNum" class="region-part__num"
            >({{ country.selectNum }})</span
          >
        </template>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import Countries from "./Countries.vue";
export default {
  props: {
    change: Function,
    part: Object, // 其实是region
  },
  data() {
    return {};
  },
  components: {
    Countries,
  },
  computed: {
    selectedCountries: {
      get() {
        return this.part.countries
          .filter((e) => {
            return e.selected;
          })
          .map((e) => {
            return e.regionId;
          });
      },
      set(val) {
        for (let i = 0; i < this.part.countries.length; i++) {
          const item = this.part.countries[i];
          if (val.includes(item.regionId)) {
            this.$set(item, "selected", true);
          } else {
            this.$set(item, "selected", false);
          }
        }
      },
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
          _country.selectNum = (_country.provinces || []).length || 1;
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
