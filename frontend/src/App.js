import React, { useEffect } from "react";
import "./App.css";
import Home from "./app/pages/Home";
import jwt_decode from "jwt-decode";
import { store } from "./app/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CourseDetail from "./app/components/CourseDetail";
import LectureDetail from "./app/components/LectureDetail";
import SideBar from "./app/layout/SideBar";
import { Center, ChakraProvider } from "@chakra-ui/react";
import Authenticate from "./app/pages/Authenticate";
import About from "./app/pages/About";
import { setUser } from "./app/slices/authSlice";
import Success from "./app/pages/Success";
import FlashCardPage from "./app/pages/FlashCardPage";
import NotesPage from "./app/pages/NotesPage";
import PracticeQuestionsPage from "./app/pages/PracticeQuestionsPage";
import Settings from "./app/pages/Settings";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        dispatch(setUser(decoded));
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, [dispatch, user, isAuthenticated]);

  return (
    <ChakraProvider>
      <Provider store={store}>
        <Router>
          <SideBar>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route exact path="success" element={<Success />} />
              <Route exact path="settings" element={<Settings />} />
              <Route exact path="authenticate" element={<Authenticate />} />
              <Route exact path="about" element={<About />} />
              <Route path="courses/:courseId" element={<CourseDetail />} />
              <Route
                exact
                path="/courses/:courseId/lectures/:lectureId"
                element={<LectureDetail />}
              />
              <Route
                exact
                path="/courses/:courseId/lectures/:lectureId/flashcards"
                element={<FlashCardPage />}
              />
              <Route
                exact
                path="/courses/:courseId/lectures/:lectureId/notes"
                element={<NotesPage />}
              />
              <Route
                exact
                path="/courses/:courseId/lectures/:lectureId/practice-questions"
                element={<PracticeQuestionsPage />}
              />
            </Routes>
          </SideBar>
        </Router>
      </Provider>
    </ChakraProvider>
  );
}

export default App;