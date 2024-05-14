// import { ref } from "firebase/database";
// import { getDownloadURL, listAll } from "firebase/storage";
// import { useEffect } from "react";
// import { useState } from "react";
// import { imageDb } from "../../config/firebase-config";

const About = () => {
  // const [imgUrl, setImgUrl] = useState([]);

  // useEffect(() => {
  //   listAll(ref(imageDb, `Profile pictures`)).then((images) => {
  //     images.items.forEach((val) => {
  //       getDownloadURL(val).then((url) => {
  //         setImgUrl((data) => [...data, url]);
  //       });
  //     });
  //   });
  // }, []);

  return (
    <div className="h-screen">
      <div className="container mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
        <h2
          className="text-2xl font-bold italic text-custom-color mb-4"
          style={{ color: "rgb(10, 42, 76)" }}
        >
          About React is Not Hard
        </h2>
        <p className="text-gray-700 mb-6">
          Welcome to the heart of React, a community-driven forum dedicated to
          making React learning accessible and enjoyable. Whether you are a
          beginner or an experienced developer, we believe that mastering React
          should be an engaging and rewarding journey.
        </p>

        <h3
          className="text-2xl font-bold italic text-custom-color mb-4"
          style={{ color: "rgb(10, 42, 76)" }}
        >
          Our Mission
        </h3>
        <p className="text-gray-700 mb-6">
          At React is Not Hard forum app, we are on a mission to clearer and
          easier to understand React and provide a space where developers of all
          levels can come together to learn, share, and grow. We strive to
          create a supportive environment where questions are encouraged, and
          knowledge is freely exchanged.
        </p>

        <h3
          className="text-2xl font-bold italic text-custom-color mb-4"
          style={{ color: "rgb(10, 42, 76)" }}
        >
          The Team
        </h3>
        <p className="text-gray-700 mb-6">
          Behind the scenes, React is Not Hard is powered by a passionate team
          of developers dedicated to simplifying the React learning experience.
          Meet the minds shaping this platform:
        </p>

        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/3 px-4 mb-8">
            {/* <img className="w-full h-40 object-cover mb-4 rounded" src={imgUrl.url} alt="Atanas" /> */}
            {/* {imgUrl.map((image) => {
              image === "Atanas" ? <img src={image} /> : <p>No image</p>;
            })} */}
            <h4 className="text-xl font-semibold mb-2">Atanas Georgiev</h4>
            <p className="text-gray-700">Web Developer</p>
          </div>
          <div className="w-full md:w-1/3 px-4 mb-8">
            {/* <img
              className="w-full h-40 object-cover mb-4 rounded"
              src=""
              alt="Nikolay"
            /> */}
            <h4 className="text-xl font-semibold mb-2">Nikolay Hadzhiev</h4>
            <p className="text-gray-700">Web Developer</p>
          </div>
          <div className="w-full md:w-1/3 px-4 mb-8">
            {/* <img
              className="w-full h-40 object-cover mb-4 rounded"
              src=""
              alt="Diana"
            /> */}
            <h4 className="text-xl font-semibold mb-2">Diana Alemkova</h4>
            <p className="text-gray-700">Web Developer</p>
          </div>
        </div>

        <h3
          className="text-2xl font-bold italic text-custom-color mb-4"
          style={{ color: "rgb(10, 42, 76)" }}
        >
          Join the Conversation
        </h3>
        <p className="text-gray-700 mb-6">
          We invite you to join our growing community. Whether you have
          questions, insights to share, or just want to connect with fellow
          React enthusiasts, React is Not Hard is the place for you. Let's make
          React learning a delightful journey together!
        </p>
      </div>
    </div>
  );
};

export default About;
