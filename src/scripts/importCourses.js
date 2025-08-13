// importCourses.js
const admin = require("firebase-admin");
const courses = require("./data/new.json"); // তোমার JSON ডেটা এখানে রাখো

// 🔐 serviceAccountKey.json Firebase Console থেকে ডাউনলোড করো
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadCourses() {
  for (const course of courses) {
    const courseId = `course-${course.id}`; // আইডি ডিফাইন করলে পরেও খুঁজে পাবে
    const { id, ...data } = course;
    await db.collection("courses").doc(courseId).set({
      ...data,
      createdAt: new Date(course.createdAt || Date.now())
    });
    console.log(`✅ Uploaded: ${course.title}`);
  }

  console.log("🎉 All courses uploaded.");
}

uploadCourses();
