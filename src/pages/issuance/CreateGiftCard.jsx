import styled from "styled-components";
import DeleteIcon from "../../assets/icons/svgs/delete.svg";
import UploadIcon from "../../assets/icons/svgs/upload.svg";
import { PrimaryBtn } from "../../components/BasicComponents";
import "./styles/CreateGiftCard.css";
import { useState, useRef } from "react";
import {
  FaChevronCircleRight,
  FaChevronCircleLeft,
  FaPlus,
} from "react-icons/fa";
import CustomDropdown from "../../components/CustomDropdown";
import axios from "axios";
import { baseUrl1 } from "../../axios";
import Spinner from "../../components/Loaders/Spinner";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import fieldValidate from "../../utils/fieldValidate";

const ActiveDot = styled.div`
  width: 15px;
  height: 15px;
  margin: 0px 10px;
  border-radius: 20px;
  background: ${({ active }) => (active ? "#00dc72" : "")};
  border: 1px solid ${({ active }) => (active ? "#00dc72" : "#B62028")};
`;

const CreateGiftCard = () => {
  //values
  const [cardData, setCardData] = useState({
    title: "",
    description: "",
    terms: "",
    variants: [{ option1: "", price: "" }],
    validity: "",
  });

  // error
  const [isError, setIsError] = useState(null);

  // const [isValidityCheck, setIsValidityCheck] = useState(false);
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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);

  const [selectedImage, setSelectedImage] = useState([]);
  const [previewImage, setPreviewImage] = useState([]);

  const navigate = useNavigate();

  // console.log(selectedImage);
  // console.log(previewImage);

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

    // console.log(index+name+value)
    setCardData((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index][name] = value;
      return { ...prev, variants: updatedVariants };
    });
  };

  // variant append and delete
  const handleAppend = () => {
    setCardData((prev) => ({
      ...prev,
      variants: [...prev.variants, { option1: "", price: "" }],
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
    const file = event.target.files[0];

    if (file) {
      setSelectedImage((prev) => [...prev, file]);
      const reader = new FileReader();

      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          if (img.width === 600 && img.height === 250) {
            // Image dimensions are valid
            // data without base64 prefix
            console.log(reader.result.split(",")[0]);
            const dataURLWithoutPrefix = reader.result.split(",")[1];
            setPreviewImage((prev) => [
              ...prev,
              { attachment: dataURLWithoutPrefix },
            ]);
            // alert("Image dimensions are valid");
          } else {
            // Image dimensions are invalid
            // Perform any error handling or display an error message
            alert("Image dimensions are invalid");
          }
        };

        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setPreviewImage(null);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const url = baseUrl1 + "/giftcard/products/add";
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJtbXR0ZXN0c3RvcmU4Lm15c2hvcGlmeS5jb20iLCJpYXQiOjE2ODc0MjAxMzR9.wR7CCHPBMIbIv9o34E37j2yZSWF1GkKv4qXbROV6vf0",
    };

    // field validation
    if (!fieldValidate(cardData.title, 3)) {
      setIsError("* Title can't be empty (min 4)");
      setIsLoading(false);
      return;
    } else if (!fieldValidate(cardData.validity, 0)) {
      setIsError("* Validity can't be empty");
      setIsLoading(false);
      return;
    } else if (
      cardData.variants.length === 0 ||
      cardData.variants.some((item) => item.option1 === "" || item.price === "")
    ) {
      setIsError("* Variants can't be empty");
      setIsLoading(false);
      return;
    } else if (previewImage.length === 0) {
      setIsError("* Min 1 image required");
      setIsLoading(false);
      return;
    } else {
      setIsError(null);
    }

    // post request
    try {
      const res = await axios.post(
        url,
        {
          title: cardData.title,
          description: cardData.description,
          published: "true",
          variants: cardData.variants,
          images: previewImage,
          terms: cardData.terms,
          validity: cardData.validity,
        },
        { headers }
      );
      const resData = res.data;

      if (resData.code === 200) {
        alert(resData.message);
        navigate("/my-gift-card");
      } else {
        alert(resData.message);
      }
      console.log(res.data);
    } catch (e) {
      alert("Something went wrong!");
      // console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gift-card__container section-box-container component">
      <div className="gift-card__active-status">
        Active Account <ActiveDot active={true} />
      </div>

      {isLoading &&
        createPortal(<Spinner />, document.getElementById("portal"))}
      <div className="gift-card__card-details">
        <div className="gift-card__card-preview">
          <div className="gift-card__upload-image">
            <span>Ratio 600x250</span>
            <div className="file-input-container">
              <input
                type="file"
                id="file-input"
                className="file-input"
                accept="image/png, image/jpg, image/jpeg"
                // multiple
                onChange={handleFileInput}
              />
              <img src={UploadIcon} alt="" />
              <label htmlFor="file-input" className="file-input-label">
                Change image <span className="mandatory">*</span>
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
              src={
                "data:image/jpeg;base64," +
                previewImage[selectedImg]?.attachment
              }
              alt=""
            />
          </div>

          <div className="gift-card__scroll-container">
            {/* <div
              onClick={() => sliderScroll(SCROLL_LEFT)}
              className="gift-card__slider-btns"
              id="scroll-left"
            >
              <FaChevronCircleLeft />
            </div> */}

            <div className="gift-card__preview-scroll" ref={scrollContainer}>
              {previewImage.length > 0 &&
                previewImage.map((item, index) => (
                  <figure key={index}>
                    <img
                      src={"data:image/jpeg;base64," + item?.attachment}
                      alt=""
                      onClick={() => setSelectedImg(index)}
                    />
                  </figure>
                ))}
            </div>

            {/* <div
              onClick={() => sliderScroll(SCROLL_RIGHT)}
              className="gift-card__slider-btns"
              id="scroll-right"
            >
              <FaChevronCircleRight />
            </div> */}
          </div>
        </div>

        <div className="gift-card__card-data">
          <label className="gift-card__label">
            Title <span className="mandatory">*</span>
          </label>
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
            rows={3}
            value={cardData.description}
            onChange={handleChange}
          />
          <label className="gift-card__label">Terms & Condition</label>
          <textarea
            type="text"
            className="gift-card__input"
            name="terms"
            rows={3}
            value={cardData.terms}
            onChange={handleChange}
          />
          <div className="gift-card__label">
            Gift Card Validity <span className="mandatory">*</span>
          </div>

          <div className="gift-card__validity">
            <CustomDropdown
              options={[
                { title: "6 months", value: "180" },
                { title: "12 months", value: "365" },
              ]}
              setCardData={setCardData}
              validity={cardData.validity}
            />
          </div>
        </div>
      </div>

      <div className="gift-card__variant-data">
        <div className="gift-card__variant-grid-row">
          <label className="gift-card__label">
            Variant Name <span className="mandatory">*</span>
          </label>
          <label className="gift-card__label">
            Gift Card Price <span className="mandatory">*</span>
          </label>
          <label></label>
        </div>

        {cardData.variants.map((item, index) => (
          <div className="gift-card__variant-grid-row" key={index}>
            <input
              type="text"
              className="gift-card__variant-input-title gift-card__input"
              id={index}
              name="option1"
              value={item.option1}
              onChange={handleVariant}
            />
            <input
              type="number"
              className="gift-card__variant-input-price gift-card__input"
              id={index}
              name="price"
              value={item.price}
              onChange={handleVariant}
            />
            <img src={DeleteIcon} alt="" id={index} onClick={handleDelete} />
          </div>
        ))}
      </div>
      <div className="gift-card__append-variant" onClick={handleAppend}>
        Append a Variant
        <span>
          <FaPlus />
        </span>
      </div>

      {/* error */}
      {isError && <div className="gift-card__error">{isError}</div>}

      <PrimaryBtn $primary onClick={handleSubmit}>
        Save
      </PrimaryBtn>
    </div>
  );
};

export default CreateGiftCard;
