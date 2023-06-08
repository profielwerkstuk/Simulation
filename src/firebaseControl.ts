import admin from "firebase-admin"
import { readFileSync } from "fs";

const credentials = JSON.parse(readFileSync("./dist/superSecretCreds.json", "utf8"));


const app = admin.initializeApp({
  credential: admin.credential.cert(credentials)
});
const firestore = admin.firestore(app);

function uploadNewGenome(data: any) {
    data = JSON.parse(data)
    data.uploadDate = admin.firestore.Timestamp.now();
    firestore.collection("genomes").add(data).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    }).catch((error) => {
        console.error("Error adding document: ", error);
    })
}

export { uploadNewGenome };