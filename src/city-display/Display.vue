<template>
    <div class="selectedList">
        <div class="provinceBlock" v-for="province in selectedProvinces" :key="province.regionId">
            <span class="provinceLabel">{{province.name}}</span>
            <div class="cityTags">
                <el-tag closable @close="handleDelete(city.regionId)" class="crowd-condition-tag" v-for="city in province.cities" :key="city.regionId">{{city.name}}</el-tag>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            provinces: {
                type: Array,
                default: () => ([])
            },
            onDelete: Function
        },
        computed: {
            selectedProvinces() {
                return this.provinces.map(function(_province) {
                    return Object.assign( {},  _province, {
                        cities: _province.cities.filter(function(city) {
                            return city.selected
                        })
                    })
                }).filter(function(_province) {
                    return _province.cities.length > 0 || _province.selected
                })
            }
        },
        methods: {
            handleDelete(val) {
                this.$emit('onDelete', val)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>