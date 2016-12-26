
<template>
  <div class="training-graph" id="container" ></div>
</template>

<script>
import _ from 'underscore'
var Highcharts = require('highcharts')
var moment = require('moment')

export default {
  props: ['graphDataArray'],
  watch: {
    graphDataArray: function (newGraphDataArray) {
      console.log(newGraphDataArray)
      var jsonDetailData = this.makeJsonDetailData(newGraphDataArray)
      this.makeGraph(jsonDetailData)
    }
  },
  methods: {
    makeJsonDetailData(graphDataArray) {
      var trainingDate = this.getTrainingDate(graphDataArray)

      // get the line where the detail data starts
      var detailDataLineNumber = _.findIndex(graphDataArray, function(line){ 
        return line && new RegExp('^' + 'Session Detail Data').test(line)
        }
      )

      // get the line where the detail data header is      
      var detailDataWithTitles = graphDataArray.slice(detailDataLineNumber, graphDataArray.length)
      var headerLineNumber = _.findIndex(detailDataWithTitles, function(line){ 
        return line && new RegExp('^' + 'Interval').test(line)
        }
      )

      // detaildata starts 2 lines after the header and ends 1 line before EOF
      var detailData = detailDataWithTitles.slice(headerLineNumber + 2, detailDataWithTitles.length - 1)

      var durationArray = _.last(detailData).split(',')[1].split(':')
      var duration = {
        hours: parseInt(durationArray[0]),
        minutes: parseInt(durationArray[1]),
        seconds: parseInt(durationArray[2])
      }
      var jsonDetailData = this.arrayToJson(detailData, trainingDate, duration)

      this.addIntervalBreaks(jsonDetailData)

      return jsonDetailData
    }, 

    makeGraph(jsonDetailData) {
      Highcharts.chart('container', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Training speed and stroke rate',
                x: -20 //center
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Speed (km/h) and Stroke rate'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                      name: 'Speed',
                      data: _.map(jsonDetailData, function(entry) {
                              return [entry.time, entry.speed] 
                            })
                    }, {
                      name: 'Stroke rate',
                      data: _.map(jsonDetailData, function(entry) {
                              return [entry.time, entry.strokeRate] 
                    })
            }]
        })
    },

    getTrainingDate(graphDataArray) {
      var dateLine = _.find(graphDataArray, function(line){ 
        return line && new RegExp('^' + 'Start Time').test(line)
        }
      )
      var dateLineArray = dateLine.split(',')
      var dateTime = dateLineArray[1]
      var datePart = dateTime.split(' ')[0].split('/') // format is dd/mm/yy eg 27/11/16
      var outputDate = '20' + datePart[2] + '-' + datePart[1] + '-' + datePart[0]
      return outputDate
    },

    // transform the data to JSON. Line has structure of: Interval,Elapsed Time,GPS Distance,GPS Split,GPS Speed,Stroke Rate,Heart Rate,Stroke Count
    // so in a 0 based array we want occurences 0, 1, 4, 5. 
    arrayToJson(detailData, startDate, duration) {
      var jsonDetailData = _.map(detailData, function(line) {
        var inputArray = line.split(',')

        return {
          interval: parseInt(inputArray[0]), 
          time: this.calculateTime(inputArray, startDate, duration),
          speed: inputArray[4] === '---' ? 0 : parseFloat(inputArray[4]),   
          strokeRate: inputArray[4] === '---' ? 0 : parseFloat(inputArray[5])     
        }
      }, this) // need to set context in order to call a method
      return jsonDetailData
    },

    calculateTime(inputArray, startDate, duration) {
      var interval = parseInt(inputArray[0])
      var time = moment(startDate + ' ' + inputArray[1]).add(1, 'hours')
      if (interval > 1) {
        time.add((duration.hours * (interval - 1) ), 'hours')
        time.add(((duration.minutes + 1) * (interval - 1) ), 'minutes')   
        time.add((duration.seconds * (interval - 1) ), 'seconds')               
      } 
      return time.valueOf()
    },

    addIntervalBreaks(jsonDetailData) {
      var currentInterval = 1
      _.each(jsonDetailData, function(value, key, list){ 
        if (value.interval > currentInterval) {
            list.splice(key, 0, {
              interval: value.interval, 
              time: (value.time - 59999),
              speed: null,   
              strokeRate: null     
            })

             list.splice(key+1, 0, {
              interval: value.interval, 
              time: (value.time - 1),
              speed: null,   
              strokeRate: null   
            })   

          currentInterval = value.interval
        }
      })
    }

  }
}
</script>