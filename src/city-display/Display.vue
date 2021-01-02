<template>
  <div class="selectedList">
    <div
      class="provinceBlock"
      v-for="province in selectedProvinces"
      :key="province.regionId"
    >
      <span class="provinceLabel">{{ province.name }}</span>
      <div class="cityTags">
        <el-tag
          closable
          @close="deleteTag($event, city)"
          class="crowd-condition-tag"
          v-for="city in province.cities"
          :key="city.regionId"
          >{{ city.name }}</el-tag
        >
      </div>
    </div>
  </div>
</template>

<script>
import { valueEquals } from "./../utils";
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      provinces: [],
    };
  },
  watch: {
    data: {
      handler: function (val) {
        if (!valueEquals(this.provinces, val)) {
          this.provinces = val;
        }
      },
    },
  },
  computed: {
    selectedProvinces() {
      return this.provinces
        .map(function (_province) {
          return Object.assign({}, _province, {
            cities: _province.cities.filter(function (city) {
              return city.selected;
            }),
          });
        })
        .filter(function (_province) {
          return _province.cities.length > 0 || _province.selected;
        });
    },
  },
  methods: {
    deleteTag(event, tag) {
      // 过滤掉已被取消的城市
      var value = this.provinces
        .map(function (t) {
          return Object.assign({}, t, {
            cities: t.cities.filter(function (t) {
              return t.regionId !== tag.regionId;
            }),
          });
        })
        .filter(function (e) {
          return e.cities.length > 0;
        });
      this.provinces = value;
      this.$emit("remove-tag", tag.regionId);
    },
  },
};
</script>
