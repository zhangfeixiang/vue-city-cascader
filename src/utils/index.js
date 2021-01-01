export const directCity = [110000, 120000, 310000, 500000, 710000, 810000, 820000];
export const getCodes = function (regionList) {
    //   直辖市城市码
    return regionList.reduce(function (codes, _province) {
        // 直辖市直接加入codes
        if (_province.selected && directCity.indexOf(_province.regionId) > -1) {
            return codes.concat(_province.regionId);
        }
        var selectedRegionIds = _province.cities
            .filter(function (e) {
                return e.selected;
            })
            .map(function (e) {
                return e.regionId;
            });
        return codes.concat(selectedRegionIds);
    }, []);
}

export const valueEquals = (a, b) => {
    // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
    if (a === b) return true;
    if (!(a instanceof Array)) return false;
    if (!(b instanceof Array)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i !== a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};