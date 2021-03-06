const config = {
    baseUrl: 'https://www.car.gr',
    db:{
        file: 'db-final.json'
    },
    export:{
        file: 'export-final.xlsx'
    },
    dealers: {
        list:{
            ctype: 'vehicles',
            vtype: '',
            requestUrl: (base) => base + '?q=' +
                                '&ctype=' + config.dealers.list.ctype + 
                                '&vtype=' + config.dealers.list.vtype +
                                '&ptype=&region='
        },
        regions:{
            queryUrl: () => config.baseUrl + '/dealers/list/get_prefectures/',
            ctype: 'vehicles',
            vtype: '',
            requestUrl: () => config.dealers.regions.queryUrl() +
                                '?ctype=' + config.dealers.regions.ctype + 
                                '&vtype=' + config.dealers.regions.vtype +
                                '&q=&region='
        },
        vehicleTypesToExport: [
            'car', // 2233
            'bike', // 475
            'van',
            'truck',
            'bus',
            'builder',
            'semitruck',
            'semitrailer',
            'tractor',
            'forklift',
            'taxi'
        ],
        listPageLink: '?q=&ctype=vehicles&vtype=bike&ptype=&region='
    }
}

module.exports = config