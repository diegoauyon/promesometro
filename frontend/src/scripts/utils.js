
import * as $ from 'jquery'


const SETTINGS_URL = 'https://9mtn9bajdj.execute-api.us-east-2.amazonaws.com/dev/settings'
const SECTOR_URL = 'https://9mtn9bajdj.execute-api.us-east-2.amazonaws.com/dev/sector/'
const PROMISE_URL = 'https://9mtn9bajdj.execute-api.us-east-2.amazonaws.com/dev/promise/'

export const getSettings = function(callback) {
    return $.getJSON(SETTINGS_URL)
            .done(response => {
                callback(response.data)
            })
}

export const getSectorInformation = function({callback, sectorId}) {
    return $.getJSON(`${SECTOR_URL}${sectorId}`)
            .done(response => {
                callback(response.data)
            })
}


export const getSectorPromises = function ({settings, sectorId}) {
    const promises = settings.promises.filter( info => { info.sector_id="" == sectorId})
    return promises
}

export const buildTwitterUrl = function({promiseInfo, sectorInfo}) {
    return `http://twitter.com/share?text=Opiniomentro&hashtags=${sectorInfo.name},${promiseInfo.hashtag}`
}


export const parseURLParams = function(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}
