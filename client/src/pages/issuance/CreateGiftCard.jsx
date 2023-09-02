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
import instance from "../../axios";
import Spinner from "../../components/Loaders/Spinner";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import fieldValidate from "../../utils/fieldValidate";
import { getUserToken } from "../../utils/userAuthenticate";

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

  console.log(cardData);

  // error
  const [isError, setIsError] = useState(null);

  // selected or current image
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);

  const [previewImage, setPreviewImage] = useState([]);

  console.log(previewImage);

  const navigate = useNavigate();

  const scrollContainer = useRef(null);

  // image slider next and prev btns
  const imageSlider = (val) => {
    if (val === "next" && selectedImg < previewImage.length - 1) {
      setSelectedImg(selectedImg + 1);
      console.log("hit");
    } else if (val === "prev" && selectedImg > 0) {
      setSelectedImg(selectedImg - 1);
    }
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

    // console.log(index + name + value);

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

  // file input
  const handleFileInput = (event) => {
    // setImages(files);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          if (img.width === 600 && img.height === 250) {
            // Image dimensions are valid
            // data without base64 prefix
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
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const url = "/giftcard/products/add";
    const headers = {
      Authorization: getUserToken(),
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
      const res = await instance.post(
        url,
        {
          title: cardData.title.trim(),
          description: cardData.description.trim(),
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gift-card__container component">
      <div className="section-box-container">
        <div className="section-box-title">Publish Gift Card</div>
      </div>
      {/* <div className="gift-card__active-status"></div> */}
      <div className="section-box-container component">
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
                  Change image
                </label>
                <div className="mandatory">*</div>
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

              {previewImage?.length !== 0 ? (
                <img
                  src={
                    "data:image/jpeg;base64," +
                    previewImage[selectedImg]?.attachment
                  }
                  alt=""
                />
              ) : (
                <img src={require("../../assets/images/sampleGC.png")} alt="" />
              )}
            </div>

            <div className="gift-card__scroll-container">
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
              Validity <span className="mandatory">*</span>
            </div>

            <div className="gift-card__validity">
              <CustomDropdown
                options={[
                  { title: "6 months", value: "180" },
                  { title: "12 months", value: "365" },
                ]}
                keyField={"validity"}
                value={cardData?.validity}
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
          Add a Variant
          <span>
            <FaPlus />
          </span>
        </div>

        {/* error */}
        {isError && <div className="gift-card__error">{isError}</div>}

        <PrimaryBtn $primary width={"230px"} onClick={handleSubmit}>
          Create & Publish Gift Card
        </PrimaryBtn>
      </div>
    </div>
  );
};

export default CreateGiftCard;
