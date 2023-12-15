import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useNavigate } from 'react-router-dom';

const ImageCropper = ({ src, onCropComplete }) => {
  const [crop, setCrop] = useState();
  const [imageRef, setImageRef] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const imgRef = useRef(null);
  const navigate = useNavigate()

  const onImageLoaded = (image) => {
    setImageRef(image);
  };

  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const getCroppedImg = async () => {
    if (imageRef && crop.width && crop.height) {
      const croppedImageBlob = await getCroppedBlob(imageRef, crop, 'image/jpeg');
      setCroppedImage(URL.createObjectURL(croppedImageBlob));
      onCropComplete(croppedImageBlob);
      console.log("finish")
  
     
    }
  };
  

  const getCroppedBlob = (image, crop, mimeType) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        resolve(blob);
      }, mimeType);
    });
  };

  return (
    <div style={{ maxWidth: '80%', overflow: 'hidden', margin: '0 auto' }}>
      <ReactCrop
        src={src}
        crop={crop}
        onImageLoaded={onImageLoaded}
        onChange={onCropChange}
        ref={imgRef}
        style={{ maxWidth: '100%', maxHeight: '80%'}}
        />
      <button onClick={getCroppedImg}>Crop</button>
      
    </div>
  );
};

export default ImageCropper;
