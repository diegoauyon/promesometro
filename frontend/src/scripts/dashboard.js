import * as $ from 'jquery'
import { dashboardView } from './dashboard-view'
import {getSettings} from './utils'
import {instanciateSocket} from './websocket'


const settingsUrl = "https://9mtn9bajdj.execute-api.us-east-2.amazonaws.com/dev/settings"
const promiseUrl = (id) => `https://9mtn9bajdj.execute-api.us-east-2.amazonaws.com/dev/promise/${id}`
const sectorUrl = (id) => `https://9mtn9bajdj.execute-api.us-east-2.amazonaws.com/dev/sector/${id}`

class Dashboard {
    constructor(settings) {
        this.sectorsMap = {};
        this.sectorDataMap = {};
        this.sectors = [...settings.sectors];
        this.promises = [...settings.promises];
        this.init();
    }
    init () {
        this.sectors.forEach(sector => {
            $.ajax({url: sectorUrl(sector.id), success: ((result) => {
                this.sectorDataMap[result.data.id] = result.data;
                dashboardView.fillSectors(result.data);
                const score = Math.round(result.data.sentiment_score * 100)
                $(`#avg-score-${sector.id}`)
                    .animate({left: `+=${score}%`}, 2000, 'swing');
            }).bind(this)});
        })
    }
    updateEducationScore(data) {
        data = [...JSON.parse(data)]
        this.sectors.forEach(item => {
            if (!this.sectorsMap[item.id]) {
                this.sectorsMap[item.id] = []
                this.sectorsMap[item.id].push(item.hashtags_list)
            }
        });
        data.forEach(item => {
            let sector = this.sectors.find(x => x.hashtags_list.includes(item.promise_id))
            if(sector) {
                const metricGraph = $(`#avg-score-${sector.id}`)[0];
                const currentLeft = parseInt(metricGraph.style.left.replace('%',''))
                const score = item.sentiment_score * 100;
                const newLeft = Math.round(score - currentLeft);
                const tweetCount = parseInt($(`#tweets-sector-${sector.id}`)[0].innerText);
                $(`#tweets-sector-${sector.id}`)[0].innerText = tweetCount + 1
                $(`#avg-score-${sector.id}`)
                    .animate({left: `+=${newLeft}%`}, 2000, 'swing');
            }
        });
    }
}


$(document).ready(()=> {
    getSettings( settings => {
        const dashboard = new Dashboard(settings)
        const ws = instanciateSocket({
            settings,
            onOpen: () =>{},
            onClose: ()=>{},
            onError: ()=> {},
            onMessage: (event)=> {
                 dashboard.updateEducationScore(event.data);
            }
        })
    })
})
