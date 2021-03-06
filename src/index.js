import _CityCascader from './city-cascader/Cascader.vue';
import _CityDisplay from './city-display/Display.vue';
import './index.scss'
export const CityDisplay = _CityDisplay;

export default _CityCascader;
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.component('city-cascader', _CityCascader);
    window.Vue.component('city-display', _CityDisplay);
}