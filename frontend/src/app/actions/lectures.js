import axios from "axios";

export const fetchLectures = async (course_id) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/edufy/courses/${course_id}/lectures/`
    );
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the data", error);
    return null;
  }
};

export const fetchLecture = async (lecture_id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/edufy/lectures/${lecture_id}/`
      );
      return response.data;
    } catch (error) {
      console.error("There was an error fetching the data", error);
      return null;
    }
  };

export const createLecture = async (
  course_id,
  audioFile,
  transcriptionFile,
  courseName
) => {
  try {
    // Initialize payload with the name and course_id, which are always required
    console.log(course_id, courseName);

    let formData = new FormData();
    formData.append("name", courseName);
    formData.append("course", course_id);
    if (audioFile) {
      formData.append("video_file", audioFile);
    }
    if (transcriptionFile) {
      formData.append("transcription_file", transcriptionFile);
    }

    const response = await axios.post(
      `http://localhost:8000/edufy/courses/${course_id}/create_lecture/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response);

    // Call appropriate API based on the provided files
    if (audioFile) {
      await axios.post(
        `http://localhost:8000/edufy/transcribe/${response.data.id}/`
      );
    } else if (transcriptionFile) {
      await axios.post(
        `http://localhost:8000/edufy/generate_content/${response.data.id}/`
      );
    }

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("There was an error creating the lecture", error);
    return null;
  }
};
