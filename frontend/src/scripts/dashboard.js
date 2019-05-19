import * as $ from 'jquery'

class Dashboard {
    constructor() {

    }
    updateEducationScore(avgScore) {
        const metricGraph = $('#education-avg-score');
        const score = Math.round(Math.random() * 100);
        metricGraph.animate({left: `+=${score}%`}, 2000, 'swing');
    }
}

export const dashboard = new Dashboard();