<template>
  <div class="container">
    <div class="row">
      <div class="panel panel-default">
        <div class="panel-heading form-group">
          <h2>Enter a training</h2>
        </div>
        <div class="row form-group">
          <div class="col-md-3">Date of training</div>
          <div class="col-md-9">
            <datepicker placeholder="Select Date" v-on:selected="setDate"></datepicker>
          </div>
        </div>
        <div class="row form-group">
          <div class="col-md-3">Training type</div>
          <div class="col-md-9">
            <select v-model="trainingType" class="selectBox">
                  <option>rowing</option>
                  <option>ergo</option>
                  <option>running</option>
                  <option>other</option>
               </select>
          </div>
        </div>
        <div class="row form-group">
          <div class="col-md-3">Interval type</div>
          <div class="col-md-9">
            <select v-model="training" class="selectBox">
                  <option>15 x 1 min</option>
                  <option>10 x 2 min</option>
                  <option>7 x 3 min</option>
                  <option>5 x 5 min</option>
                  <option>3 x 10 min</option>
                  <option>6 x 500 m</option>
                  <option>7 x 300 m</option>
               </select>
          </div>
        </div>
        <div class="row form-group">
          <div class="col-md-3">Remarks about training</div>
          <div class="col-md-9">
            <input class="form-control" type="text" v-model="trainingName">
          </div>
        </div>
        <div class="row form-group">
          <div class="col-md-3">Rating</div>
          <div class="col-md-9">
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
            </div>
          </div>
        </div>
        <div class="row form-group">
          <div class="col-md-3">Speedcoach file</div>
          <div class="col-md-9">
            <div>
              <div v-if="!file">
                <input type="file" @change="onFileChange">
              </div>
              <div v-else>
                <button @click="removefile">Remove file</button> {{file.name}}
              </div>
            </div>

          </div>
        </div>

        <div class="row form-group">
          <div class="col-md-3"></div>
          <div class="col-md-9">
            <button class="btn btn-info" @click="submit()">Submit</button>
          </div>
        </div>

      </div>

    </div>

    <div class="row">
      <div class="col-md-12" v-show="data != null">
        <training-graph v-bind:graph-data-array='file'></training-graph>
      </div>
    </div>

  </div>
</template>

<script>
  import Datepicker from 'vuejs-datepicker'
  import firebase from 'firebase'
  import TrainingGraph from './TrainingGraph.vue'

  export default {
    components: {
      Datepicker,
      TrainingGraph
    },
    props: [],
    data() {
        return {
          stars: ['star_off', 'star_off', 'star_off', 'star_off', 'star_off'],
          training: '3 x 10 min',
          trainingName: 'Training Name',
          trainingType: 'rowing',
          trainingDate: null,
          rating: 0,
          file: null,
          data: null
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
        firebase.database().ref('/training').push({
          training: this.training,
          trainingName: this.trainingName,
          trainingType: this.trainingType,
          trainingDate: this.trainingDate,
          rating: this.rating,
          data: this.data,
          time: d,
          user: user.uid
        })
        this.$route.router.go({ path: '/traininglist' })
      },
      rate(index) {
        this.rating = index + 1
        this.startTest = 'star'
        for (var i = 0; i < 5; i++) {
          if (index < i) {
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
          vm.data = e.target.result
        }
        reader.readAsText(inputFile) // we want text output
      },
      removefile(e) {
        this.file = null
        this.data = null
      },
      ready() {
      },
      setDate(selectedDate) {
        this.trainingDate = selectedDate.getTime()
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
.selectBox{
  border-radius:4px;border:1px solid #AAAAAA;
  }
</style>