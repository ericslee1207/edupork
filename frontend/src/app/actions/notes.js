import axios from "axios";

export const fetchNotes = async (lecture_id) => {
  try {
    const response = await axios.get(`http://localhost:8000/edufy/lectures/${lecture_id}/notes/`);
    console.log("COURSES, ", response)
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the data", error);
    return null;
  }
};
