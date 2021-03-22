import firebase from 'firebase/app'
import 'firebase/storage'
import {upload} from './upload.js'

const firebaseConfig = {
	apiKey: "AIzaSyBud7v_kSufyvOfJla3-ueGVDNzsDA9NsQ",
	authDomain: "fe-upload-app-d7a87.firebaseapp.com",
	projectId: "fe-upload-app-d7a87",
	storageBucket: "fe-upload-app-d7a87.appspot.com",
	messagingSenderId: "46988763660",
	appId: "1:46988763660:web:e40e3d541ce0f2485f4429"
}

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`)
      const task = ref.put(file)

      task.on('state_changed', snapshot => {
        const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
        const block = blocks[index].querySelector('.preview-info-progress')
        block.textContent = percentage
        block.style.width = percentage
      }, error => {
        console.log(error)
      }, () => {
        task.snapshot.ref.getDownloadURL().then(url => {
          console.log('Download URL', url)
        })
      })
    })
  }
})
