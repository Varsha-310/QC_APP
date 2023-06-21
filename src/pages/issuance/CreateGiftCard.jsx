import styled from "styled-components";
import DeleteIcon from "../../assets/icons/svgs/delete.svg";
import AddIcon from "../../assets/icons/svgs/plus-sign.svg";
import UploadIcon from "../../assets/icons/svgs/upload.svg";
import { PrimaryBtn } from "../../components/BasicComponents";
import "./styles/CreateGiftCard.css";
import { useState, useRef } from "react";
import { FaChevronCircleRight, FaChevronCircleLeft } from "react-icons/fa";
import CustomDropdown from "../../components/CustomDropdown";

const ActiveDot = styled.div`
  width: 15px;
  height: 15px;
  margin: 0px 10px;
  border-radius: 20px;
  background: ${({ active }) => (active ? "#00dc72" : "")};
  border: 1px solid ${({ active }) => (active ? "#00dc72" : "#B62028")};
`;

const CreateGiftCard = () => {
  //
  const [cardData, setCardData] = useState({
    title: "Gift Card",
    description:
      "Shopping for someone else but not sure what to gift? Give the gift of choice with a gift card . Gift card are delivered by E-mail",
    variants: [{ variant_name: "dummy", variant_price: "1000" }],
  });

  const [isValidityCheck, setIsValidityCheck] = useState(false);
  // fetched images
  const [images, setImages] = useState([
    "download (6).png",
    "download.jpg",
    "download (1).jpg",
    "download (2).jpg",
    "download (3).jpg",
    "download (4).jpg",
    "download (5).jpg",
  ]);
  // selected or current image
  const [selectedImg, setSelectedImg] = useState(0);

  const [selectedImage, setSelectedImage] = useState([]);
  const [previewImage, setPreviewImage] = useState([]);

  console.log(selectedImage);
  console.log(previewImage);
  // validity checkbox

  const scrollContainer = useRef(null);

  // image preview slider scroll values
  const SCROLL_LEFT = -100;
  const SCROLL_RIGHT = 100;

  // image slider next and prev btns
  const imageSlider = (val) => {
    if (val === "next" && selectedImg < images.length - 1) {
      setSelectedImg(selectedImg + 1);
      console.log("hit");
    } else if (val === "prev" && selectedImg > 0) {
      setSelectedImg(selectedImg - 1);
    }
  };

  // choose image slider preview
  const sliderScroll = (val) => {
    scrollContainer.current.scrollBy({
      left: val,
      behaviour: "smooth",
    });
  };
  // handle on change
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };
  const handleVariant = (event) => {
    const index = event.target.id;
    const name = event.target.name;
    const value = event.target.value;

    setCardData((prev) => {
      let dt = { ...prev };
      let arr = dt.variants;
      arr[index][name] = value;
    });
  };

  // variant append and delete
  const handleAppend = () => {
    setCardData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { variant_name: "dummy111", variant_price: "100011" },
      ],
    }));
  };

  const handleDelete = (event) => {
    const index = event.target.id;

    setCardData((prev) => {
      const dt = { ...prev };
      const arr = dt.variants;
      arr.splice(index, 1);
      return dt;
    });
    console.log(index);
  };
  // file input
  const handleFileInput = (event) => {
    // const files = Array.from(event.target.files);
    // setImages(files);
    console.log(event.target.files);
    const file = event.target.files[0];

    if (file) {
      setSelectedImage((prev) => [...prev, file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setPreviewImage(null);
    }
  };

  return (
    <div className="gift-card__container section-box-container component">
      <div className="gift-card__active-status">
        Active Account <ActiveDot active={true} />
      </div>
      <div className="gift-card__card-details">
        <div className="gift-card__card-preview">
          <div className="gift-card__upload-image">
            <span>Ratio 600x250</span>
            <div className="file-input-container">
              <input
                type="file"
                id="file-input"
                className="file-input"
                typeof="image/png, image/jpg, image/jpeg"
                // multiple
                onChange={handleFileInput}
              />
              <img src={UploadIcon} alt="" />
              <label htmlFor="file-input" className="file-input-label">
                Change image
              </label>
            </div>
          </div>
          <div className="gift-card__preview-img">
            <div
              onClick={() => imageSlider("prev")}
              className="gift-card__image-slider-btns"
              id="scroll-left"
            >
              <FaChevronCircleLeft />
            </div>
            <div
              onClick={() => imageSlider("next")}
              className="gift-card__image-slider-btns"
              id="scroll-right"
            >
              <FaChevronCircleRight />
            </div>
            <img
              src={previewImage[selectedImg]}
              // src={require("../../assets/images/slider/" + images[selectedImg])}
              alt=""
            />
          </div>

          <div className="gift-card__scroll-container">
            <div
              onClick={() => sliderScroll(SCROLL_LEFT)}
              className="gift-card__slider-btns"
              id="scroll-left"
            >
              <FaChevronCircleLeft />
            </div>

            <div className="gift-card__preview-scroll" ref={scrollContainer}>
              {previewImage.length > 0 &&
                previewImage.map((item, index) => (
                  <figure key={index}>
                    <img
                      // src={require("../../assets/images/slider/" + item)}
                      src={item}
                      alt=""
                      onClick={() => setSelectedImg(index)}
                    />
                  </figure>
                ))}
            </div>

            <div
              onClick={() => sliderScroll(SCROLL_RIGHT)}
              className="gift-card__slider-btns"
              id="scroll-right"
            >
              <FaChevronCircleRight />
            </div>
          </div>
        </div>

        <div className="gift-card__card-data">
          <label className="gift-card__label">Title</label>
          <input
            type="text"
            className="gift-card__input"
            name="title"
            value={cardData.title}
            onChange={handleChange}
          />
          <label className="gift-card__label">Description</label>
          <textarea
            type="text"
            className="gift-card__input"
            name="description"
            rows={4}
            value={cardData.description}
            onChange={handleChange}
          />
          <div className="gift-card__validity">
            <input
              type="checkbox"
              className="gift-card__validity-checkbox"
              onChange={() => setIsValidityCheck(!isValidityCheck)}
              checked={isValidityCheck}
            />
            Gift Card Validity
          </div>

          {isValidityCheck && (
            <CustomDropdown options={["5 months", "6 months", "10 months"]} />
          )}
        </div>
      </div>

      <div className="gift-card__variant-data">
        <div className="gift-card__variant-grid-row">
          <label className="gift-card__label">Variant Name</label>
          <label className="gift-card__label">Gift Card Price</label>
          <label></label>
        </div>
        {cardData.variants.map((item, index) => (
          <div className="gift-card__variant-grid-row" key={index}>
            <input
              type="text"
              className="gift-card__variant-input-title gift-card__input"
              id={index}
              name="variant_name"
              value={item.variant_name}
              onChange={handleVariant}
            />
            <input
              type="number"
              className="gift-card__variant-input-price gift-card__input"
              id={index}
              name="variant_price"
              value={item.variant_price}
              onChange={handleVariant}
            />
            <img src={DeleteIcon} alt="" id={index} onClick={handleDelete} />
          </div>
        ))}
      </div>
      <div className="gift-card__append-variant" onClick={handleAppend}>
        Append a Variant <img src={AddIcon} alt="" />
      </div>

      <PrimaryBtn $primary>Save</PrimaryBtn>
    </div>
  );
};

export default CreateGiftCard;
