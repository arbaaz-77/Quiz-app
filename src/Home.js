import React from "react";

const Home = ({ startQuiz }) => {
  return (
    <div className="intro">
      <h1 className="intro__title">Cool Whip 😎</h1>
      <p>The ultimate quiz</p>
      <p>How much do you know?</p>
      <button className="intro__start-btn" onClick={startQuiz}>
        Start
      </button>
    </div>
  );
};

export default Home;
