import React, { useState } from "react";

function App() {
  const [profileInfo, setProfileInfo] = useState(null);
  const [state, setState] = useState({ name: "", fname: "" });
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setState({ ...state, [name]: value });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const profileInfo = await window.api.getProfileInfo(state);
      // console.log("profileInfo", profileInfo);
      // profileInfo !== null ? setProfileInfo(profileInfo) : null;
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          Name:
          <input type="text" name="name" onChange={(e) => handleChange(e)} />
        </div>
        <div>
          FName:
          <input type="text" name="fname" onChange={(e) => handleChange(e)} />
        </div>
        <input type="submit" />
      </form>

      <div>fname: {state?.fname}</div>
    </div>
  );
}

export default App;
