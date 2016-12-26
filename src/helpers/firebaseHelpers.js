import firebase from 'firebase'

export function fireInit(func) {
	var config = {
    apiKey: 'AIzaSyDlnkurDNAYZAF7h9HY3voH0dfKAUhuw-s',
    authDomain: 'training-info.firebaseapp.com',
    databaseURL: 'https://training-info.firebaseio.com',
    storageBucket: 'training-info.appspot.com'
	}
	firebase.initializeApp(config)

	firebase.auth().onAuthStateChanged(function (user) {
	  if (user) {
	    func(true, user)
	  } else {
	    func(false)
	  }
	}, function(error) {
	  console.log(error)
	})
}
