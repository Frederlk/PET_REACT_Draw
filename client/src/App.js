import SettingBar from "./components/SettingBar";
import ToolBar from "./components/ToolBar";
import Canvas from "./components/Canvas";
import "./styles/app.scss";
import { Routes, Route, redirect, Navigate } from "react-router-dom";

function App() {
    return (
        <div className="app">
            <Routes>
                <Route
                    path="/:id"
                    element={
                        <>
                            <ToolBar />
                            <SettingBar />
                            <Canvas />
                        </>
                    }
                />
                <Route
                    path="/"
                    element={
                        <>
                            <ToolBar />
                            <SettingBar />
                            <Canvas />
                            <Navigate to={`/f${(+new Date()).toString(16)}`} replace />
                        </>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
