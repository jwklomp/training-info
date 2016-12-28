
<template>
  <div class="training-list">
    <div class="">
      <h2>Your Trainings:</h2>
      <h3>Click on a training to see the speed graph</h3>
      <ul class='training-list'>
        <li class="training-item" v-for="item in trainingList | orderBy 'time' -1 " v-on:click="setCurrentItem(item)">
          <h4 class="training-title">{{ item.training}}, {{ item.trainingName }}, {{ item.trainingType}}, {{ formatDate(item.trainingDate) }}</h4><button  class="close-btn btn btn-default btn-xs" v-on:click="deleteItem($key)">X</button>
          <div class="stars">
            <img v-for="n in item.rating" class="star-img" src="../assets/star.png" alt="">
          </div>
        </li>
      </ul>
      <training-graph v-bind:graph-data-array="currentData"></training-graph>
    </div>    
  </div>
</template>

<script>
import firebase from 'firebase'
import TrainingGraph from './TrainingGraph.vue'
var moment = require('moment')
export default {
  data () {
    return {
      currentItem: {},
      currentData: [],
      trainingList: [],
      user: firebase.auth().currentUser
    }
  },
  components: {
      TrainingGraph
  },
  methods: {
   logout() {
      firebase.auth().signOut().then(function() {
        window.location.href = '/auth.html'
      }, function(error) {
        console.log(error)
      })
    },
    deleteItem(key) {
      console.log('delete: ' + key)
      var adaRef = firebase.database().ref('/training' + key)
        adaRef.remove()
          .then(function() {
            console.log('Remove succeeded.')
          })
          .catch(function(error) {
            console.log('Remove failed: ' + error.message)
          })
    },
    setCurrentItem(item) {
      this.currentItem = item
      this.currentData = item.data.split('\n')
    }, 
    formatDate(date) {
      return moment(date).format('DD-MM-YYYY')
    }
   },
  ready: function () {
    var _this = this
    firebase.database().ref('/training').on('value', function(snapshot) {
      _this.trainingList = snapshot.val()
    })
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #FF0000;
}
.close-btn{
  display: inline-block;
  margin-left: 10px;
}
.training-title{
  display: inline-block;
}
.star-img{
  width:20px;
}
.training-item{
  border-bottom: 1px dotted #999;
  padding-bottom: 10px;
}
.training-list{
  list-style: none;
  padding-left: 0;
}

</style>

