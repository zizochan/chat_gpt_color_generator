import React from "react";
import { Clipboard } from "react-bootstrap-icons";
import PropTypes from "prop-types";
import { colorConfigs } from "../constants";

const ColorDisplay = ({ colorName, colorValue }) => (
  <div className="mb-2">
    <span
      style={{
        color:
          colorName === "secondary_background_color" ? "#000000" : colorValue,
      }}
    >
      {colorName}: {colorValue}
    </span>
  </div>
);

const propTypesFromColorConfigs = Object.keys(colorConfigs).reduce(
  (propTypes, colorKey) => ({
    ...propTypes,
    [colorKey]: PropTypes.string,
  }),
  {}
);

const AnswerSection = ({ answer }) => {
  const copyText = (colors) => {
    const text = Object.entries(colors)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    navigator.clipboard.writeText(text);
  };

  return (
    <div className="row m-3">
      <div className="col">
        <div className="row bg-secondary text-primary">
          <div className="col-12">
            <p>{answer.description}</p>
          </div>
          {Object.keys(colorConfigs).map((key) => (
            <div className="col-12 col-md-6 custom-text-shadow" key={key}>
              <ColorDisplay
                key={key}
                colorName={key}
                colorValue={answer.colors[key]}
              />
            </div>
          ))}
        </div>
        <div className="row mt-3">
          <button
            type="button"
            className="btn text-secondary"
            onClick={() => copyText(answer.colors)}
          >
            <span>copy</span>
            <Clipboard />
          </button>
        </div>
      </div>
    </div>
  );
};

AnswerSection.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    colors: PropTypes.shape(propTypesFromColorConfigs),
  }).isRequired,
};

ColorDisplay.propTypes = {
  colorName: PropTypes.string.isRequired,
  colorValue: PropTypes.string.isRequired,
};

export default AnswerSection;
