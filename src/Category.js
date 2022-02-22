import React from "react";
import { nanoid } from "nanoid";

const Category = ({ generateApiUrl, buttonStyle }) => {
  const [categoryOptions, setCategoryOptions] = React.useState([]);
  const [difficultyOptions, setDifficultyOptions] = React.useState([]);
  const [apiUrlData, setApiUrlData] = React.useState({
    category: "",
    difficulty: "",
  });
  const [loading, setLoading] = React.useState(false);
  const difficulties = ["easy", "medium", "hard"];
  const selectedOption = {
    backgroundColor: "rgb(51, 51, 51)",
    color: "#F5F7FB",
    border: "1px solid rgb(51, 51, 51)",
  };

  /* Fetch categories from API (categories may change due to open source). Add a random option to data, then set category and difficulty state values as array of objects, each object containing the primary value and an isSelected boolean which will be used to determine which option is selected*/
  React.useEffect(() => {
    setLoading(true); /* Implement loading screen while waiting for fetch. */
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => {
        data.trivia_categories.unshift({
          id: 0,
          name: "Random",
          isSelected: true,
          key: nanoid(),
        });
        /* Remove extraneous category naming */
        data.trivia_categories = data.trivia_categories.map((category) => {
          let newName = category.name
            .split("Entertainment: ")
            .join("")
            .split("Science: ")
            .join("");
          return { ...category, name: newName };
        });
        setCategoryOptions(
          data.trivia_categories.map((category) => {
            if (category.id !== 0) {
              return {
                ...category,
                isSelected: false,
                key: nanoid(),
              };
            } else {
              /* Establish random category as isSelected by default */
              return category;
            }
          })
        );
        setDifficultyOptions(
          difficulties.map((item) => ({
            difficulty: item,
            isSelected: false,
            key: nanoid(),
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Function set as onclick function for every category. Sets apiUrlData and maps through categoryOptions to make sure selection is highlighted. */
  function selectCategory(id) {
    setApiUrlData((prevData) => ({ ...prevData, category: id }));
    setCategoryOptions((prevOptions) =>
      prevOptions.map((option) => {
        let newOption = option;
        if (option.isSelected) {
          newOption = { ...option, isSelected: false };
        }
        if (option.id === id) {
          newOption = { ...option, isSelected: true };
        }
        return newOption;
      })
    );
  }

  /* Function set as onclick function for every difficulty. Sets apiUrlData and maps through difficultyOptions to make sure selection is highlighted. */
  function selectDifficulty(str) {
    setApiUrlData((prevData) => ({ ...prevData, difficulty: str }));
    setDifficultyOptions((prevOptions) =>
      prevOptions.map((option) => {
        let newOption = option;
        if (option.isSelected) {
          newOption = { ...option, isSelected: false };
        }
        if (option.difficulty === str) {
          newOption = { ...option, isSelected: true };
        }
        return newOption;
      })
    );
  }

  /* Render JSX elements. Styling applied based on boolean values. */
  const categoryElements = categoryOptions.map((category) => {
    const styles = category.isSelected ? selectedOption : null;
    return (
      <li
        className="option"
        onClick={() => selectCategory(category.id)}
        style={styles}
        key={category.key}
      >
        {category.name}
      </li>
    );
  });
  const difficultyElements = difficultyOptions.map((item) => {
    const styles = item.isSelected ? selectedOption : null;
    /* Difficulty values are lowercase for proper URL format. Capitalize first letter for display. */
    const formattedItem =
      item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1);
    return (
      <li
        className="option"
        onClick={() => selectDifficulty(item.difficulty)}
        style={styles}
        key={item.key}
      >
        {formattedItem}
      </li>
    );
  });

  /* Show loading animation while waiting for data from fetch */
  if (loading) {
    return (
      <div className="app">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="customize-container">
      <h3 className="customize-header">Select a category</h3>
      <ul className="customize-options">{categoryElements}</ul>
      <h3 className="customize-header customize-header__difficulty">
        Select difficulty
      </h3>
      <ul className="customize-options customize-options__difficulties">
        {difficultyElements}
      </ul>
      <button
        className="start-quiz-btn"
        onClick={() => generateApiUrl(apiUrlData)}
        style={buttonStyle}
      >
        Start quiz
      </button>
    </div>
  );
};

export default Category;
