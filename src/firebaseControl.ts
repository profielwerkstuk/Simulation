import admin from "firebase-admin"
import { readFileSync } from "fs";

const credentials = JSON.parse(readFileSync("superSecretCreds.json", "utf8"));


const app = admin.initializeApp({
  credential: admin.credential.cert(credentials)
});
const firestore = admin.firestore(app);

function uploadNewGenome(data: any) {
    firestore.collection("genomes").add(JSON.parse(data)).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    }).catch((error) => {
        console.error("Error adding document: ", error);
    })
}

export { uploadNewGenome };