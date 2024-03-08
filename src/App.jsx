import { BrowserRouter, Routes, Route } from "react-router-dom";
import JoinForm from "./components/JoinForm";
import JoinLink from "./components/JoinLink";
import MainEngine from "./components/MainEngine";
import { LoaderBar } from "./helpers/loaders";
import { Suspense, useEffect } from "react";

const App = () => {

  useEffect(() => {
    if(window.innerWidth < 768) {
      alert("This app is not currently supported on mobile devices. Please use a desktop or laptop for the best experience.")
    }
  },[])

  return (
    <Suspense fallback={<LoaderBar />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<JoinForm />} />
          <Route path="/:meetingId" element={<JoinLink />} />
          <Route path="/:meetingId/3d" element={<MainEngine />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
