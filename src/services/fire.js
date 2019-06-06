import firebase from 'firebase'; // 4.8.1

class Fire {
  constructor() {
    this.init();
    this.observeAuth();
  }

  init = () => {
    firebase.initializeApp({
        apiKey: "AIzaSyAOf0ropcVHwWsdfTyQHGqmqvY0E8oLEHI",
        authDomain: "kinderapp-e5770.firebaseapp.com",
        databaseURL: "https://kinderapp-e5770.firebaseio.com",
        projectId: "kinderapp-e5770",
        storageBucket: "kinderapp-e5770.appspot.com",
        messagingSenderId: "450246520913"
    });

    /*
    firebase.messaging().getToken()
		.then(fcmToken => {
			if (fcmToken) {
				// 
				console.log('token =' + fcmToken);
			} else {
			// user doesn't have a device token yet
			} 
    });
    */
  }

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('messages');
  }

  get messaging() {
    return firebase.messaging();
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  on = callback =>
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp,
      };
      this.append(message);
    }
  };

  append = message => this.ref.push(message);

  // close the connection to the Backend
  off() {
    this.ref.off();
  }
}

Fire.shared = new Fire();
export default Fire;
