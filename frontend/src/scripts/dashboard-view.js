// JQuery
import * as $ from 'jquery'
// Import initial page logic
import { dashboard } from './dashboard'

class DashboardView {
    constructor(){}
    fillSectors (sector) {
        $("#sectors").append(`
            <div class="row">
                <div class="col-12">
                    <div class="card card_metric mb-3">
                        <div class="card-body">
                        <h6 class="card-title">
                            `+ sector.name + `
                            <span id=`+ `tweets-sector-` + sector.id + ` class="float-right small text-muted">
                            `+ sector.tweets_count + `
                            <span class="typcn typcn-social-twitter"></span></span>
                        </h6>
                        <div class="metric">
                            <span class="typcn typcn-arrow-down-thick metric-negative"></span>
                            <div class="metric__graph">
                                <span 
                                    id=`+ `avg-score-` + sector.id + ` 
                                    class="typcn typcn-location metric__location" 
                                    style="left: 0%;">
                                </span>
                            </div>
                            <span class="typcn typcn-arrow-up-thick metric-positive"></span>
                        </div>
                        </div>
                    </div>
                </div>
            </div>`);
    }
}

export const dashboardView = new DashboardView();