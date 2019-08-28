const regions = {};

regions.list = [];

regions.set = list => {
    regions.list = list;
};

regions.get = () => regions.list;

regions.load = () => {
    api.call("regions")
        .then(regionList => {
            regions.set(regionList);
        })
};

regions.render = (formSelector, selectedRegionId) => {
    let regionSelect = $(formSelector).find(".region_select");

    regions.get()
        .forEach(regionData => {
            let {
                id,
                name
            } = regionData;

            let optionTpl = `
                    <option value="${id}" ${selectedRegionId == id ? "selected": ""}>${name}</option>
				`;

            $(regionSelect).append(optionTpl);
        });

    $(regionSelect).select2();
};

regions.getSelected = formSelector => {
    let regionSelect = $(formSelector).find(".region_select");

    return regionSelect.find("option:selected").val();
};

regions.load();