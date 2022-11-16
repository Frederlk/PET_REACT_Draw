import React from "react";
import toolState from "../store/toolState";

const SettingBar = () => {
    return (
        <div className="setting-bar">
            <label htmlFor="line-width">Line Width </label>
            <input
                onChange={(e) => toolState.setLineWidth(e.target.value)}
                id="line-width"
                type="number"
                defaultValue={1}
                min={1}
                max={50}
                className="setting-bar__input"
            />
            <label html="stroke-color">Stroke Color</label>
            <input
                onChange={(e) => toolState.setStrokeColor(e.target.value)}
                id="stroke-color"
                type="color"
                className="setting-bar__input"
            />
        </div>
    );
};

export default SettingBar;
