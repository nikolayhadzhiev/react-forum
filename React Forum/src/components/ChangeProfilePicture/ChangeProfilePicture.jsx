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
    ? { border: '2px dashed blue', borderRadius: '15px' }
    : {};

  return (
    <div className="card w-1/2 bg-secondary shadow-2xl h-96 mx-48 my-16 items-center">
      <div
        className="card-body items-center text-center align-center h-max"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ ...dragOverStyle, padding: '20px', cursor: 'pointer' }}
      >
        <h2 className="card-title text-primary">Change your Profile Picture</h2>
        <div className="card-actions items-center justify-center">
          <input
            type="file"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            ref={fileInputRef}
            className="align-center justify-center text-primary"
          />
          {!previewImg && (
            <div className="text-primary my-4 h-32 flex items-center justify-center">
              Drag and Drop or click to upload a file!
            </div>
          )}
          {previewImg && (
            <img src={previewImg} alt="Preview" style={{ width: '200px' }} />
          )}
        </div>
      </div>
      <button
        className="btn btn-primary my-4 text-secondary w-48 absolute bottom-0"
        onClick={handleUpload}
      >
        Change Profile Picture
      </button>
      <ToastContainer />
    </div>
  );
};

export default ChangeProfilePicture;
