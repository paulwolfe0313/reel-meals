import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveMovieRating = async (userId, movieId, data) => {
  try {
    await setDoc(
      doc(db, "ratings", userId),
      {
        [movieId]: {
          ...data,
          timestamp: new Date().toISOString()
        }
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving rating:", error);
  }
};
