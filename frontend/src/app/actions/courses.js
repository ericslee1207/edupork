import axios from "axios";

export const fetchCourses = async (user_id) => {
  try {
    console.log(user_id)
    const response = await axios.get(`http://localhost:8000/edufy/users/${user_id}/courses/`);
    console.log("COURSES, ", response)
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the data", error);
    return null;
  }
};

export const createCourse = async (user_id, courseName) => {
  console.log(courseName);
  try {
    const payload = {
      user: user_id,
      name: courseName,
    };
    const response = await axios.post(`http://localhost:8000/edufy/users/${user_id}/create_course/`, payload);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("There was an error creating the course", error);
    return null;
  }
};
