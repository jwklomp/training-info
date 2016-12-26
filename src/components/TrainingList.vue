
<template>
  <div class="training-list">
    <div class="">
      <h2>Your Trainings:</h2>
      <ul class='training-list'>
        <li class="training-item" v-for="item in trainingList | orderBy 'time' -1 " v-on:click="setCurrentItem(item)">
          <h4 class="training-title">{{ item.training}}, {{ item.trainingName }}, {{ item.trainingType}}, {{ item.trainingDate}}</h4><button  class="close-btn btn btn-default btn-xs" v-on:click="deleteItem($key)">X</button>
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
      var user = firebase.auth().currentUser
      var adaRef = firebase.database().ref('users/' + user.uid + '/' + key)
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
      console.log(item)
    }
   },
  ready: function () {
    var user = firebase.auth().currentUser
    var _this = this
    firebase.database().ref('users/' + user.uid).on('value', function(snapshot) {
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

