
<template>
  <div class="enter-training">
    <div class="">
    <h2>Enter a training:</h2>
    <datepicker placeholder="Select Date" v-on:selected="setDate" ></datepicker>
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

<training-graph v-bind:graph-data-array='file'></training-graph>

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

  props: ['logstatus'],
  data () {
    return {
      stars: ['star_off', 'star_off', 'star_off', 'star_off', 'star_off'],
      training: '3 x 10 min',
      trainingName: 'Training Name',
      trainingType: 'rowing',
      trainingDate: null,
      rating: 0,
      file: '',
      data: ''
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
        trainingDate: this.trainingDate,
        rating: this.rating,
        data: this.data,
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
        vm.data = e.target.result
      }
      reader.readAsText(inputFile) // we want text output
    },
    removefile(e) {
      this.file = ''
    },   
    ready() {
    },
    setDate(selectedDate){
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
</style>

