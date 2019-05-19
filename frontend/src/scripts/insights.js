import * as $ from "jquery";

import {
  parseURLParams,
  getSettings,
  getPromiseInformation,
  getSectorPromises,
  buildTwitterUrl
} from './utils'


var paramsInfo, settings, promiseInformation, promiseHashtag


const  updateScore=  ({data, element}) => {


    let count = 0;
        let avgScore = 0;
        let totalScore = 0;

        data.forEach(item => {

            count++;
            totalScore += Math.round(item.sentiment_score * 100);



        });

        avgScore = totalScore / count;

        const metricGraph = $(element)[0];
            const currentLeft = parseInt(metricGraph.style.left.replace('%',''))
            const score = avgScore;
            const newLeft = Math.round(score - currentLeft);
            metricGraph
                .animate({left: `+=${newLeft}%`}, 2000, 'swing');
    }

const buildPage = function() {
   const promiseAnchor = $('#promise-id')
    const candidateName = $('#candidate-name')
    const shareTwitter = $('#share-twitter')[0]
    const backToSectors = $('#backToSector')[0]

    promiseAnchor.text(promiseInformation.text)
    candidateName.text(settings.candidate.name)

    const sectorInformation = settings.sectors.find(sector => {return sector.id ==  promiseInformation.sector_id})


    shareTwitter.href = buildTwitterUrl({promiseInfo: promiseInformation,sectorInfo: sectorInformation})
    shareTwitter.target= '_blank'

    backToSectors.href = 'promises.html?sectorId=' + promiseInformation.sector_id

    updateScore({data: promiseInformation.tweets, element: '#promise-score'})
}



const checkUrl = function() {
    const params = parseURLParams(window.location.href)


    if (window.location.pathname.includes('insights') ) {
        promiseHashtag = (params && params.promiseHashtag) ?params.promiseHashtag[0] : 'eco1'
        getSettings( settingsInfo => {
            paramsInfo = params
            settings = settingsInfo
            getPromiseInformation( {
                callback: (sectorData) => {
                    promiseInformation = sectorData
                    buildPage()
                },
                promiseHashtag: promiseHashtag
            })
        })

    }

}



$(document).ready(() => {
    checkUrl()
})
