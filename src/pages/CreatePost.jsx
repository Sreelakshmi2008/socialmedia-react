import React, { useState, useEffect } from 'react';
import FileUploader from '../components/FileUploader';
import ImageCropper from '../components/ImageCropper';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { baseUrl, createpost } from '../utils/constants';
import axiosInstance from '../utils/axiosInstance';

function CreatePost() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [croppedImages, setCroppedImages] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [showSelectMoreFiles, setShowSelectMoreFiles] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [hashs, setHashs] = useState('');

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if the user is authenticated
       
        // Reset state when the component mounts
        setSelectedFiles([]);
        setCroppedImages([]);
        setCaption('');
        setCurrentFileIndex(0);
        setShowSelectMoreFiles(false);
        setModalIsOpen(false);

      } catch (error) {
        console.error('Error fetching user details:', error);
      }
      finally {
      setIsLoading(false); // Set loading to false once data is fetched (whether successful or not)
    }
    };

    fetchData();
  }, []);

  const handleFileSelect = (file) => {
    setSelectedFiles([...selectedFiles, file]);
  };

  const handleCropComplete = async (croppedImageBlob) => {
    const updatedCroppedImages = [...croppedImages];
    updatedCroppedImages[currentFileIndex] = URL.createObjectURL(croppedImageBlob);
    setCroppedImages(updatedCroppedImages);
    setCurrentFileIndex((prevIndex) => prevIndex + 1);
    console.log('Updated Cropped Images:', updatedCroppedImages); // Log the updated array

    // Update showSelectMoreFiles state
    setShowSelectMoreFiles(true);
    console.log('finish in createpost');
  };

  const handleSelectMoreFiles = () => {
    setShowSelectMoreFiles(false);
    if (currentFileIndex < selectedFiles.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
    }
  };

  const handleFinish = () => {
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };
  console.log('currentFileIndex:', currentFileIndex);
  console.log('selectedFiles.length:', selectedFiles.length);

  const handleCreatePost = async () => {
    try {
      // Create FormData and append files
      const postData = new FormData();
      postData.append('caption', caption);
      postData.append('hashtags', hashs);

      const croppedImagesData = await Promise.all(
        croppedImages.map(async (file, index) => {
          const response = await fetch(file);
          const blob = await response.blob();
          const fileName = `croppedImage_${index}.png`; // You can generate a unique filename here
          postData.append('croppedImages', blob, fileName);
          return { blob, fileName };
        })
      );

      console.log([...postData.entries()]);

      // Send the data to the backend using Axios
      const response = await axiosInstance.post(baseUrl + createpost, postData);

      // Check if the post was successfully created
      if (response.status === 201) {
        console.log('Post created successfully:', response.data);

        // Reset state and navigate to the 'myposts' page
        setSelectedFiles([]);
        setCroppedImages([]);
        setCaption('');
        setCurrentFileIndex(0);
        setShowSelectMoreFiles(false);
        setModalIsOpen(false);
        navigate('/homepage'); // Replace with the actual route for 'myposts'
      } else {
        console.error('Failed to create post:', response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    {console.log(isLoading,"loading")}
      {!isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          {currentFileIndex < selectedFiles.length ? (
            // Main component
            <div
              style={{
                width: '60%',
                marginLeft: '20%',
              }}
            >
              <ImageCropper src={URL.createObjectURL(selectedFiles[currentFileIndex])} onCropComplete={handleCropComplete} />
            </div>
          ) : (
            <>
              <h2>Media Preview</h2>
              <div>
                {/* Display the cropped images in small size */}
                {croppedImages.length > 0 &&
                  croppedImages.map((image, index) => (
                    <div key={index}>
                      <img src={image} alt={`Cropped ${index}`} style={{ maxWidth: '100%', maxHeight: '100px' }} />
                    </div>
                  ))}
              </div>
              {console.log(showSelectMoreFiles)}
              {showSelectMoreFiles && (
                <div>
                  <button onClick={handleSelectMoreFiles}>Select More Files</button>
                  <button onClick={handleFinish}>Finish</button>
                </div>
              )}
            </>
          )}
          {!showSelectMoreFiles && <FileUploader onFileSelected={handleFileSelect} />}
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={handleModalClose}
            contentLabel="Caption Modal"
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust overlay background color and transparency
              },
              content: {
                width: '50%', // Set the width of the modal
                height: '50%', // Set the height of the modal
                margin: 'auto', // Center the modal horizontally
                border: '2px solid #ccc', // Set the border color and thickness
                borderRadius: '8px', // Set the border radius
                padding: '20px', // Add padding to the content inside the modal
              },
            }}
          >
            <h2>Enter Caption</h2>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{
                width: '100%', // Make the textarea take the full width
                minHeight: '100px', // Set a minimum height for the textarea
                resize: 'vertical', // Allow vertical resizing if needed
                fontSize: '16px', // Adjust font size
              }}
            />
            <input value={hashs} placeholder='hashtags' onChange={(e)=>setHashs(e.target.value)}/>
            <button onClick={handleCreatePost}>Create Post</button>
          </Modal>
        </div>
      ) : (
        <p className='text-center mt-8'>Loading user details...</p>
      )}
    </>
  );
}

export default CreatePost;
