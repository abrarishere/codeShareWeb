import NoteCodeLogo from "./assets/NoteCodeLogo.svg";
import EditorContainer from "./components/EditorContainer";
import EditorContainerWithId from "./components/EditorContainerWithId";
import { Routes, Route } from "react-router-dom";
import { useParams } from "react-router-dom";

const App = () => {
  const App = () => {
    const { id } = useParams();

    return (
      <div className="w-full min-h-screen overflow-hidden main">
        <div className="flex flex-col h-full w-full justify-center items-center">
          <div className="flex gap-3 justify-center items-center">
            <img src={NoteCodeLogo} alt="NoteCode Logo" className="w-28 h-28" />
          </div>
          <h2 className="text-[2rem] font-semibold text-[#121826]">
            Create & Share
          </h2>
          <h1 className="text-[2.5rem] font-semibold text-[#121826]">
            Your Code easily
          </h1>
          {/* Editor Container */}
          <Routes>
            <Route path="/" element={<EditorContainer />} />
            {id && <Route path="/:id" element={<EditorContainerWithId />} />}
          </Routes>
        </div>
      </div>
    );
  };
};

export default App;
