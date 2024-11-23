import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import * as monaco from "monaco-editor";
import { initializeEditor } from "../monacoSetup";
import Select, { components } from "react-select";
import ShareIcon from "../assets/Share.svg";
import LinkIcon from "../assets/link.svg";
import DropArrow from "../assets/down arrow.svg";
import { set } from "mongoose";

const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <img src={DropArrow} alt="custom icon" />
  </components.DropdownIndicator>
);

const IndicatorSeparator = () => null;

const EditorContainerWithId = () => {
  const { id } = useParams();
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  const [theme, setTheme] = useState("vs-light");
  const [language, setLanguage] = useState("html");
  const [code, setCode] = useState(`
<html>
  <head>
    <title>HTML Sample</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <style type="text/css">
      h1 {
        color: #CCA3A3;
      }
    </style>
    <script type="text/javascript">
      alert("I am a sample... visit devChallengs.io for more projects");
    </script>
  </head>
  <body>
    <h1>Heading No.1</h1>
    <input disabled type="button" value="Click me" />
  </body>
</html>
`);

  const [link, setLink] = useState("");
  const [isChanged, setIsChanged] = useState(false);

  const themes = [
    { value: "vs-light", label: "Light" },
    { value: "vs-dark", label: "Dark" },
  ];

  const languages = [
    { value: "plaintext", label: "Plain Text" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "json", label: "JSON" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "scala", label: "Scala" },
    { value: "perl", label: "Perl" },
    { value: "lua", label: "Lua" },
    { value: "r", label: "R" },
    { value: "shell", label: "Shell" },
    { value: "powershell", label: "PowerShell" },
    { value: "sql", label: "SQL" },
    { value: "yaml", label: "YAML" },
    { value: "xml", label: "XML" },
    { value: "dockerfile", label: "Dockerfile" },
  ];

  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: theme === "vs-light" ? "#CED6E1" : "#FFFFFE",
      color: theme === "vs-light" ? "#406AFF" : "#121826",
      border: "none",
      boxShadow: "none",
      fontSize: "14px",
      borderRadius: "100px",
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? theme === "vs-light"
          ? "#1E1E1E"
          : "#FFFFFE"
        : isFocused
        ? theme === "vs-light"
          ? "#1E1E1E"
          : "#FFFFFE"
        : null,
      color: isDisabled
        ? "#ccc"
        : isSelected || isFocused
        ? theme === "vs-light"
          ? "#FFFFFE"
          : "#1E1E1E"
        : null,
    }),
  };

  const createCodeLink = async () => {
    const url = import.meta.env.VITE_API;
    const mineUrl = import.meta.env.VITE_MINE;
    const data = {
      code: editorInstanceRef.current.getValue(),
      language,
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const { _id } = await res.json();
    if (_id) {
      const link = `${mineUrl}/${_id}`;
      setLink(link);
      setIsChanged(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard");
  };

  useEffect(() => {
    if (editorRef.current && !editorInstanceRef.current) {
      editorInstanceRef.current = initializeEditor(
        editorRef.current,
        code,
        theme,
        language
      );

      // Listen for content changes
      editorInstanceRef.current.onDidChangeModelContent(() => {
        const editorCode = editorInstanceRef.current.getValue();
        setIsChanged(editorCode !== code);
      });
    }

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.dispose();
        editorInstanceRef.current = null;
      }
    };
  }, [code]);

  useEffect(() => {
    if (editorInstanceRef.current) {
      monaco.editor.setTheme(theme);
      const model = editorInstanceRef.current.getModel();
      if (model) monaco.editor.setModelLanguage(model, language);
    }
  }, [theme, language]);

  useEffect(() => {
    const fetchCode = async () => {
      const url = import.meta.env.VITE_API;
      const mineUrl = import.meta.env.VITE_MINE;
      const res = await fetch(`${url}/${id}`);
      if (!res.ok) {
        alert("Code not found");
        return;
      }
      const { code, language } = await res.json();
      setCode(code);
      setLanguage(language);
      setIsChanged(false);
      setLink(`${mineUrl}/${id}`);
    };

    fetchCode();
  }, [id]);

  return (
    <div
      className={`flex shadow-md rounded-lg flex-col justify-center items-center p-4 w-[80%] mb-36 mt-4 h-[90vh] ${
        theme === "vs-light" ? "bg-[#FFFFFE]" : "bg-[#1E1E1E]"
      }`}
    >
      <div
        ref={editorRef}
        id="editor"
        className="editor-container w-full h-full"
      ></div>

      <div className="flex justify-between items-center w-full mt-4">
        <div className="flex items-center gap-3">
          <Select
            options={themes}
            onChange={(e) => setTheme(e.value)}
            styles={colourStyles}
            defaultValue={themes[0]}
            components={{ DropdownIndicator, IndicatorSeparator }}
          />

          <Select
            options={languages}
            onChange={(e) => setLanguage(e.value)}
            styles={colourStyles}
            defaultValue={languages[1]}
            components={{ DropdownIndicator, IndicatorSeparator }}
          />
        </div>

        <div className="flex justify-center items-center mt-4">
          {link && (
            <div className="flex justify-content items-center">
              <img src={LinkIcon} alt="link icon" />
              <p className="text-[#364153]" onClick={copyToClipboard}>
                {link.slice(0, 30)}...
              </p>
            </div>
          )}
          <button
            className={`flex gap-2 justify-center items-center py-1 px-4 rounded-2xl text-[#CED6E1] ${
              theme === "vs-light" ? "bg-[#4061ff]" : "bg-[#364153]"
            } ${!isChanged ? "cursor-not-allowed" : "cursor-pointer"}`}
            onClick={createCodeLink}
            disabled={!isChanged}
          >
            <img src={ShareIcon} alt="Share" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorContainerWithId;
