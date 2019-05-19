import * as $ from 'jquery'


import {
  parseURLParams, 
  getSettings, 
  getSectorInformation, 
  getSectorPromises,
  buildTwitterUrl
} from './utils'

var paramsInfo, settings, sectorInformation, sectorId


const promiseTemplate = ({settingsPromiseInfo}) => {
    return `
    <div class="media align-items-center mb-4 promise">
            <div class="media-body promise">
              <div class="promise__cite font-italic">
                <a class="d-block"  href="insights.html?promiseHashtag=${settingsPromiseInfo.hashtag}">"${settingsPromiseInfo.text}"</a>
                <span class="float-right small promise__auth">
                  ~ ${settings.candidate.name}
                </span>
              </div>
            </div>
            <button class="media__btn" type="submit">
              <span class="typcn typcn-pin"></span>
            </button>
          </div>
    `
}

// target="_blank" href="${buildTwitterUrl({promiseInfo: settingsPromiseInfo, sectorInfo: sectorInformation})}">"${settingsPromiseInfo.text}"</a>
//

const buildPage = function() {
    const titleSpan = $('#title-id')
    const titleHeader = $('#header-title')
    const promisesLegend = $('#promises-legend')
    const promisesContainer = $('#promises-container')

    promisesContainer.empty()

    const sectorPromises = (sectorId === -1)? settings.promises : getSectorPromises({settings, sectorId: sectorId})
    titleSpan.text(sectorInformation.name)
    titleHeader.text('Promesas')
    promisesLegend.text(sectorInformation.name)

    sectorPromises.forEach( promiseInfo => {
        promisesContainer.append(promiseTemplate({settingsPromiseInfo: promiseInfo}))
    })

}


const checkUrl = function() {
    const params = parseURLParams(window.location.href)


    if (window.location.pathname.includes('promise') ) {
        sectorId = (params && params.sectorId) ?params.sectorId[0] : -1
        getSettings( settingsInfo => {
            paramsInfo = params
            settings = settingsInfo
            getSectorInformation( {
                callback: (sectorData) => {
                    sectorInformation = sectorData
                    buildPage()
                },
                sectorId: (sectorId === -1)? 1 : sectorId
            })
        })

    }

}



$(document).ready(() => {
    checkUrl()
})
