
<template>



  <div class="main-menu">


<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
     <ul class="nav nav-pills">
      <li role="presentation" v-for="item in arrNav" v-link-active v-if="item.auth || authenticated">
        <a v-link="{ path: item.id, exact: true }">{{ item.title}}</a>
      </li>
     </ul>
      <button  v-if="authenticated" class="btn btn-default log-btn" v-on:click="logout()">Log Out</button>
      <button  v-else class="btn btn-default log-btn" v-on:click="login()">Log In</button>
    </div>
  </div>
</nav>


  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  props: ['authenticated'],
  data () {
    return {
      arrNav: [{
        'title': 'Training List',
        'id': '/traininglist',
        'auth': true
      },
      {
        'title': 'Enter Training',
        'id': '/entertraining',
        'auth': true
      }]
    }
  },
  methods: {
    login() {
      window.location.href = 'auth.html'
    },
    logout() {
      firebase.auth().signOut().then(function() {
        window.location.href = '/auth.html'
      }, function(error) {
        console.log(error)
      })
    }
   },
  ready: function () {
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  h1 {
    color: #FF0000;
  }

  .main-menu li{
    display: inline-block;
  }
  .nav-pills{
    display: inline-block;
  }
  .main-menu{
    margin-top: 20px;
  }
  .log-btn{
    margin-left: 40px;
    vertical-align: top;
    margin-top: 3px;
  }
  .container{
    margin-left: 20px;
  }

</style>
