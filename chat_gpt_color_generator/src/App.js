import React from "react";
import OpenAI from "openai";

import FormSection from "./components/FormSection";
import AnswerSection from "./components/AnswerSection";
import { useState } from "react";
import { colorConfigs } from "./constants";
import { chatGptOptions } from "./constants";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const [storedValues, setStoredValues] = useState({});

  const setResponseColors = (responseColors) => {
    for (const color in colorConfigs) {
      if (responseColors[color]) {
        document.documentElement.style.setProperty(
          colorConfigs[color].cssClass,
          responseColors[color]
        );
      }
    }
  };

  function createFunctionProperties(configs) {
    const properties = {};

    Object.keys(configs).forEach((key) => {
      properties[key] = createColorProperty(configs[key].description);
    });

    properties.description =
      createColorProperty("その色を選んだ理由を日本語でまとめる");

    return properties;
  }

  const createColorProperty = (description) => ({
    type: "string",
    description,
  });

  const functionParameters = {
    type: "object",
    properties: createFunctionProperties(colorConfigs),
    required: [...Object.keys(colorConfigs), "description"],
  };

  const generateResponse = async (newQuestion, setNewQuestion) => {
    if (newQuestion === "") return;

    let completeQuestion = {
      ...chatGptOptions,
      messages: [
        {
          role: "system",
          content: "お題に合った最適なカラーコードを選択して下さい。",
        },
        { role: "user", content: newQuestion },
      ],
      functions: [
        {
          name: "color_choice",
          description: "最適な色を選択する",
          parameters: functionParameters,
        },
      ],
      function_call: { name: "color_choice" },
    };

    const response = await openai.chat.completions.create(completeQuestion);

    if (response.choices) {
      const result_arguments = JSON.parse(
        response.choices[0].message.function_call.arguments
      );

      const responseColors = Object.keys(colorConfigs)
        .map((colorKey) => ({
          [colorKey]: result_arguments[colorKey],
        }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setResponseColors(responseColors);

      setStoredValues({
        description: result_arguments.description,
        colors: responseColors,
      });
      setNewQuestion(newQuestion);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-2"></div>
        <div className="col">
          <div className="row text-center">
            <p className="h1 text-primary">ChatGPT Color Generator</p>
            <p className="text-secondary">
              ChatGPTに配色を決めてもらうツールです
            </p>
          </div>
          <FormSection generateResponse={generateResponse} />
          {storedValues && storedValues.description && (
            <AnswerSection answer={storedValues} />
          )}
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};

export default App;
