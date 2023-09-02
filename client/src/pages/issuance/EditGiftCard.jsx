import styled from "styled-components";
import DeleteIcon from "../../assets/icons/svgs/delete.svg";
import AddIcon from "../../assets/icons/svgs/plus-sign.svg";
import UploadIcon from "../../assets/icons/svgs/upload.svg";
import { PrimaryBtn } from "../../components/BasicComponents";
import "./styles/CreateGiftCard.css";
import { useState, useRef, useEffect } from "react";
import {
  FaChevronCircleRight,
  FaChevronCircleLeft,
  FaPlus,
} from "react-icons/fa";
import CustomDropdown from "../../components/CustomDropdown";
import axios from "axios";
import instance from "../../axios";
import { useParams } from "react-router";
import fieldValidate from "../../utils/fieldValidate";
import { createPortal } from "react-dom";
import { getUserToken } from "../../utils/userAuthenticate";
import Spinner from "../../components/Loaders/Spinner";

const ActiveDot = styled.div`
  width: 15px;
  height: 15px;
  margin: 0px 10px;
  border-radius: 20px;
  background: ${({ active }) => (active ? "#00dc72" : "")};
  border: 1px solid ${({ active }) => (active ? "#00dc72" : "#B62028")};
`;

const EditGiftCard = () => {
  // id by params
  const { id } = useParams();

  // data values
  const [cardData, setCardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  console.log(cardData);
  // fetched images

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
    if (val === "next" && selectedImg < cardData.images.length - 1) {
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

    if (/^[a-zA-z0-9.\s]*$/.test(value)) {
      setCardData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleVariant = (event) => {
    const index = event.target.id;
    const name = event.target.name;
    const value = event.target.value;

    // console.log(index+name+value)
    if (name === "price") {
      if (/^(?!.*\..*\.)[0-9]*(\.[0-9]*)?$/.test(value)) {
        setCardData((prev) => {
          const updatedVariants = [...prev.variants];
          updatedVariants[index][name] = value;
          return { ...prev, variants: updatedVariants };
        });
      }
    } else if (/^[a-zA-z0-9.\s]*$/.test(value)) {
      setCardData((prev) => {
        const updatedVariants = [...prev.variants];
        updatedVariants[index][name] = value;
        return { ...prev, variants: updatedVariants };
      });
    }
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

  //fetch
  const fetchData = async () => {
    setIsLoading(true);
    const url = "/giftcard/products/select";
    const headers = {
      Authorization: getUserToken(),
    };
    const body = {
      product_id: id,
    };

    try {
      const res = await instance.post(url, body, { headers });
      const resData = res.data;
      setCardData(resData.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //   update data
  const handleUpdate = async () => {
    console.log(cardData.validity);
    setIsLoading(true);
    const url = "/giftcard/products/update";
    const headers = {
      Authorization: getUserToken(),
    };
    const body = {
      product_id: id,
      title: cardData.title,
      description: cardData.body_html,
      variants: cardData.variants,
      validity: cardData.validity,
      terms: cardData?.terms.trim(),
    };

    // field validation
    if (!fieldValidate(cardData.title, 3)) {
      setIsError("* Title can't be empty (min 4)");
      setIsLoading(false);
      return;
    } else if (!fieldValidate(cardData?.validity.toString(), 0)) {
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
    } else {
      setIsError(null);
    }

    try {
      const res = await instance.put(url, body, { headers });
      const resData = res.data;
      alert(resData.message);
    } catch (error) {
      console.log();
    } finally {
    }

    setIsLoading(false);
  };

  return (
    cardData !== null && (
      <div className="gift-card__container section-box-container component">
        <div className="gift-card__active-status">
          Active Account <ActiveDot active={true} />
        </div>

        {isLoading &&
          createPortal(<Spinner />, document.getElementById("portal"))}

        <div className="gift-card__card-details">
          <div className="gift-card__card-preview">
            {/* <div className="gift-card__upload-image">
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
                  Change image
                </label>
              </div>
            </div> */}
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
              <img src={cardData.images[selectedImg]?.src} alt="" />
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
                {cardData.images.length > 0 &&
                  cardData.images.map((item, index) => (
                    <figure key={index}>
                      <img
                        src={item?.src}
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
              name="body_html"
              rows={3}
              value={cardData.body_html}
              onChange={handleChange}
            />
            <label className="gift-card__label">Terms and Condition</label>
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
                keyField={"validity"}
                value={cardData?.validity.toString() || "Select"}
                setvalue={setCardData}
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
            Denomination <span className="mandatory">*</span>
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
                onWheel={(e) => e.target.blur()}
              />
              <input
                type="text"
                className="gift-card__variant-input-price gift-card__input"
                id={index}
                name="price"
                value={item.price}
                onChange={handleVariant}
                onWheel={(e) => e.target.blur()}
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

        <PrimaryBtn $primary onClick={handleUpdate}>
          Save
        </PrimaryBtn>
      </div>
    )
  );
};

export default EditGiftCard;
