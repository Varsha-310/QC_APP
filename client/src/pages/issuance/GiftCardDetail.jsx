import styled from "styled-components";
import "./styles/CreateGiftCard.css";
import { useState, useRef, useEffect } from "react";
import { FaChevronCircleRight, FaChevronCircleLeft } from "react-icons/fa";
import instance from "../../axios";
import { useParams } from "react-router";
import { getUserToken } from "../../utils/userAuthenticate";

const ActiveDot = styled.div`
  width: 15px;
  height: 15px;
  margin: 0px 10px;
  border-radius: 20px;
  background: ${({ active }) => (active ? "#00dc72" : "")};
  border: 1px solid ${({ active }) => (active ? "#00dc72" : "#B62028")};
`;

const GiftCardDetail = () => {
  const { id } = useParams();
  console.log(id);
  const [cardData, setCardData] = useState(null);
  const [isValidityCheck, setIsValidityCheck] = useState(false);
  console.log(cardData);
  const updateData = async () => {
    const url = "/giftcard/products/select";
    const headers = {
      Authorization: getUserToken(),
    };
    const body = {
      product_id: id,
    };

    const res = await instance.post(url, body, { headers });
    const resData = res.data;

    setCardData(resData.data);
    // console.log(res);
  };

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
    if (val === "next" && selectedImg < previewImage.length - 1) {
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

  useEffect(() => {
    updateData();
  }, []);

  return (
    cardData !== null && (
      <div className="gift-card__container section-box-container component">
        <div className="gift-card__active-status">
          Active Account <ActiveDot active={true} />
        </div>
        <div className="gift-card__card-details">
          <div className="gift-card__card-preview">
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
              <img src={cardData?.images[selectedImg]?.src} alt="" />
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
                {cardData?.images.length > 0 &&
                  cardData?.images.map((item, index) => (
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
            <label className="gift-card__label">Title</label>
            <div className="gift-card__input">{cardData?.title}</div>

            <label className="gift-card__label">Description</label>
            <div className="gift-card__input">{cardData?.body_html}</div>

            <label className="gift-card__label">Terms & Conditions</label>
            <div className="gift-card__input">
              {cardData?.terms ? cardData?.terms : "N/A"}
            </div>

            <div className="gift-card__label">Gift Card Validity</div>

            <div className="gift-card__validity-show">
              {cardData?.validity === 180 ? "6 Months" : "12 Months" || "NA"}
            </div>
          </div>
        </div>

        <div className="gift-card__variant-data">
          <div className="gift-card__variant-grid-row">
            <label className="gift-card__label">Variant Name</label>
            <label className="gift-card__label">Gift Card Price</label>
            <label></label>
          </div>

          {cardData?.variants.map((item, index) => (
            <div className="gift-card__variant-grid-row" key={index}>
              <div className="gift-card__variant-input-title gift-card__input">
                {item.option1}
              </div>
              <div className="gift-card__variant-input-title gift-card__input">
                {item.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default GiftCardDetail;
