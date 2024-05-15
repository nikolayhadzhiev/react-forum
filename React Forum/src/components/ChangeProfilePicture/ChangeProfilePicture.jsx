import { useContext, useState, useRef } from 'react';
import { imageDb } from '../../config/firebase-config';
import { uploadBytes, ref } from 'firebase/storage';
import AppContext from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ChangeProfilePicture = () => {
  const { userData } = useContext(AppContext);
  const [img, setImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!img) {
      toast.error(`Please select a picture to upload!`, {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    const imgRef = ref(imageDb, `Profile pictures/${userData.handle}`);
    setPreviewImg(null);
    await uploadBytes(imgRef, img);
    toast.success(`Profile picture has been changed!`, {
      autoClose: 3000,
      className: 'font-bold',
    });
    navigate('/');
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImg(selectedImage);
    setDragging(false);

    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImg(event.target.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const selectedImage = e.dataTransfer.files[0];
    setImg(selectedImage);

    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImg(event.target.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const openFileDialog = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  const dragOverStyle = dragging
    ? { border: '2px dashed #0A2A4C', borderRadius: '15px' }
    : {};

  return (
    <div className="w-1/2 mx-24 my-16 border shadow-xl card bg-secondary h-96 text-primary">
      <div
        className="flex flex-col items-center justify-between text-center card-body h-max"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ ...dragOverStyle, padding: '20px', cursor: 'pointer' }}
      >
        <h2 className="pt-4 font-bold uppercase card-title text-primary">
          Change your Profile Picture
        </h2>
        <div className="items-center justify-center card-actions">
          <input
            type="file"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            ref={fileInputRef}
            className="justify-center align-center text-primary"
          />
          {!previewImg && (
            <div
              className={`flex items-center justify-center h-32 p-8 mb-4 italic border-2 rounded-xl text-primary border-primary ${
                dragging
                  ? 'border-solid bg-primary text-white'
                  : 'border-dashed'
              }`}
            >
              Drag and Drop or click to upload a file!
            </div>
          )}
          {previewImg && (
            <img src={previewImg} alt="Preview" style={{ width: '200px' }} />
          )}
        </div>
        <button
          className="w-48 btn btn-primary text-secondary hover:bg-accent hover:text-primary hover:border-none"
          onClick={handleUpload}
        >
          Change Profile Picture
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChangeProfilePicture;
