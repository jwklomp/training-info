
<template>
  <div class="enter-training">
    <div class="">
    <h2>Enter a training:</h2>
    <datepicker placeholder="Select Date"></datepicker>
    <select v-model="trainingType">
      <option>rowing</option>
      <option>ergo</option>
      <option>running</option>
      <option>other</option>
    </select>
    <br/>

    <select v-model="training">
      <option>15 x 1 min</option>
      <option>10 x 2 min</option>
      <option>7 x 3 min</option>
      <option>5 x 5 min</option>
      <option>3 x 10 min</option>
    </select>
    <br/>

    <input class="form-control" type="text" v-model="trainingName" placeholder="trainingName"><br/>
    <h4 class="star-title">Rating:</h4>
    <div class="stars">
    <img class="star-img" :src="file
    Path1" v-on:click="rate(0)" alt="">
    <img class="star-img" :src="file
    Path2" v-on:click="rate(1)" alt="">
    <img class="star-img" :src="file
    Path3" v-on:click="rate(2)" alt="">
    <img class="star-img" :src="file
    Path4" v-on:click="rate(3)" alt="">
    <img class="star-img" :src="file
    Path5" v-on:click="rate(4)" alt="">
    </div><br/>
 </div>
<div>
  <div v-if="!file">
    <input type="file"  @change="onFileChange">
  </div>
  <div v-else>
    <button @click="removefile
    ">Remove file</button>
  </div>
</div>
    <button  class="btn btn-default submit-btn" v-on:click="submit()">Submit</button>
</div>  

<div id="container" v-if="trainingDetailData"></div>

</template>

<script>
import Datepicker from 'vuejs-datepicker'
import _ from 'underscore'
import firebase from 'firebase'

var Highcharts = require('highcharts')
var moment = require('moment')

export default {
    components: {
        Datepicker
    },

  props: ['logstatus'],
  data () {
    return {
      stars: ['star_off', 'star_off', 'star_off', 'star_off', 'star_off'],
      training: '3 x 10 min',
      trainingName: 'Training Name',
      trainingType: 'rowing',
      date: new Date(),
      rating: 0,
      file: '',
      trainingDetailData: {},
      jsonDetailData: {}
    }
  },
  watch: {
    // whenever jsonDetailData changes, create a new graph
    jsonDetailData: function () {
      Highcharts.chart('container', {
            chart: {
                zoomType: 'x'
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
                      data: _.map(this.jsonDetailData, function(entry) {
                              return [entry.time, entry.speed] 
                            })
                    }, {
                      name: 'Stroke rate',
                      data: _.map(this.jsonDetailData, function(entry) {
                              return [entry.time, entry.strokeRate] 
                    })
            }]
        })
    }
  },
  computed: {
    filePath1: function () {
      return require('../assets/' + this.stars[0] + '.png')
    },
    filePath2: function () {
      return require('../assets/' + this.stars[1] + '.png')
    },
    filePath3: function () {
      return require('../assets/' + this.stars[2] + '.png')
    },
    filePath4: function () {
      return require('../assets/' + this.stars[3] + '.png')
    },
    filePath5: function () {
      return require('../assets/' + this.stars[4] + '.png')
    }
  },
  methods: {
    submit() {
      var user = firebase.auth().currentUser
      var d = Date.now()
      firebase.database().ref('users/' + user.uid).push({
        training: this.training,
        trainingName: this.trainingName,
        trainingType: this.trainingType,
        date: this.date,
        rating: this.rating,
        trainingDetailData: this.trainingDetailData,
        time: d
      })
      this.$route.router.go({path: '/traininglist'})
    },
    rate(index){
      this.rating = index + 1
      this.startTest = 'star'
      for (var i = 0; i < 5; i++) {
        if (index < i){
          this.stars.$set(i, 'star_off')
        } else {
          this.stars.$set(i, 'star')
        }
      }
    },
   onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.loadGraphFile(files[0])
    },
    loadGraphFile(inputFile) {
      var reader = new FileReader()
      var vm = this
      reader.onload = (e) => {
        vm.file = e.target.result.split('\n') 
        vm.readGraphFileData(vm.file)
        vm.file = inputFile.name
      }
      reader.readAsText(inputFile) // we want text output
    },
    readGraphFileData(graphDataArray) {
      // get the date 
      var dateLine = _.find(graphDataArray, function(line){ 
        return line && new RegExp('^' + 'Start Time').test(line)
        }
      )
      var dateLineArray = dateLine.split(',')
      var dateTime = dateLineArray[1]
      var datePart = dateTime.split(' ')[0].split('/') // format is dd/mm/yy eg 27/11/16
      var outputDate = '20' + datePart[2] + '-' + datePart[1] + '-' + datePart[0]
      console.log('outputDate', outputDate)
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

      // transform the data to JSON. Line has structure of: Interval,Elapsed Time,GPS Distance,GPS Split,GPS Speed,Stroke Rate,Heart Rate,Stroke Count
      // so in a 0 based array we want occurances 1, 4, 5. 

      this.jsonDetailData = _.map(detailData, function(line) {
        var inputArray = line.split(',')

        return {
          interval: parseInt(inputArray[0]), 
          time: moment(outputDate + ' ' + inputArray[1]).valueOf(),
          speed: inputArray[4] === '---' ? 0 : parseFloat(inputArray[4]),   
          strokeRate: inputArray[4] === '---' ? 0 : parseFloat(inputArray[5])     
        }
      })
      console.log('jsonDetailData', this.jsonDetailData)
      this.trainingDetailData = JSON.stringify(this.jsonDetailData)
    },
    removefile(e) {
      this.file = ''
    },   
    ready() {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #FF0000;
}
.star-img{
  cursor: pointer;
}
.stars{
  display: inline-block;
}
.star-title{
  display: inline-block;
}
.submit-btn{
  margin-top: 20px;
}
</style>

