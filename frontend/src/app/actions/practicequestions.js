import axios from "axios";

export const fetchPracticeQuestions = async (lecture_id) => {
  try {
    const response = await axios.get(`http://localhost:8000/edufy/lectures/${lecture_id}/test/`);
    console.log("COURSES, ", response)
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the data", error);
    return null;
  }
};
