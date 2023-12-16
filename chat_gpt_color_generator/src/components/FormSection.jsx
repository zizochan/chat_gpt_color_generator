import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";

const FormSection = ({ generateResponse }) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handelClick = async () => {
    setLoading(true);
    await generateResponse(newQuestion, setNewQuestion);
    setLoading(false);
  };

  const placeholderText = `お題を入力して下さい。
  例：
  ・学校のホームページを作ろうと思います。カラーコードを考えて下さい。
  ・ホラーゲームのタイトル画面の最適なカラーコードを教えて。
  ・恋愛SLGを作りたいです。最適な背景色とフォントカラーを考えて。`;

  const textAreaRows = 5;

  return (
    <div className="row m-3">
      <div className="col">
        <div className="row">
          <textarea
            rows={textAreaRows}
            placeholder={placeholderText}
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          ></textarea>
        </div>
        <div className="row">
          <Button
            className="btn btn-primary"
            disabled={isLoading}
            onClick={!isLoading ? handelClick : null}
          >
            {isLoading ? <Spinner animation="border" /> : "Generate Colors"}
          </Button>
        </div>
      </div>
    </div>
  );
};

FormSection.propTypes = {
  generateResponse: PropTypes.func.isRequired,
};

export default FormSection;
