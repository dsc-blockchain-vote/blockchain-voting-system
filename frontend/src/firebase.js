import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyCwSINPXKGAIvvxgbzzN6x5m-TWA2Mqd0g",
    authDomain: "blockchain-vote-a2e38.firebaseapp.com",
    databaseURL: "https://blockchain-vote-a2e38-default-rtdb.firebaseio.com",
    projectId: "blockchain-vote-a2e38",
    storageBucket: "blockchain-vote-a2e38.appspot.com",
    messagingSenderId: "965952968322",
    appId: "1:965952968322:web:94b442051ab294fd32069b"
  };
  // Initialize Firebase
  var fireDb = firebase.initializeApp(firebaseConfig);

  export default fireDb.database().ref();
