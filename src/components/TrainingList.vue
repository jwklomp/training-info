
<template>
  <div class="training-list">
    <div class="">
      <h2>Your Trainings:</h2>
      <span class="label label-default">Click a training to see the speed graph</span>
      <table class="table table-hover">
      <thead> 
        <tr> 
          <th>Training</th>
          <th>Description</th>
          <th>Type</th>
          <th colspan="2">Date</th>
        </tr> 
      </thead>
      <tbody> 
        <tr v-for="item in trainingList | orderBy 'time' -1 " v-on:click="setCurrentItem(item)"  v-bind:class="{ info: item == this.currentItem}"> 
          <th scope="row">{{ item.training}}</th> 
          <td>{{ item.trainingName }}</td> 
          <td>{{ item.trainingType}}</td> 
          <td>{{ formatDate(item.trainingDate) }}</td>
          <td><button class="btn btn-warning" v-on:click="deleteItem($key)">Delete</button></td>
        </tr> 
      </tbody>
      </table>

      <training-graph v-if="typeof currentData !== undefined && currentData[0] !== ''" v-bind:graph-data-array="currentData"></training-graph>
      <div v-if="typeof currentData == undefined || currentData[0] == ''">Selected training has no graph data</div>
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
      console.log('out')
      firebase.auth().signOut().then(function() {
        window.location.href = '/auth.html'
      }, function(error) {
        console.log(error)
      })
    },
    deleteItem(key) {
      console.log('delete: ' + key)
      var adaRef = firebase.database().ref('/training/' + key)
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
.well {
    background: none;
}
</style>

