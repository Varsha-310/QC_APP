import styled from "styled-components";
import DeleteIcon from "../../assets/icons/svgs/delete.svg";
import AddIcon from "../../assets/icons/svgs/plus-sign.svg";
import { PrimaryBtn } from "../../components/BasicComponents";
import "./styles/CreateGiftCard.css";

const ActiveDot = styled.div`
  width: 15px;
  height: 15px;
  margin: 0px 10px;
  border-radius: 20px;
  background: ${({ active }) => (active ? "#00dc72" : "")};
  border: 1px solid ${({ active }) => (active ? "#00dc72" : "#B62028")};
`;
const CreateGiftCard = () => {
  return (
    <div className="gift-card__container section-box-container component">
      <div className="gift-card__active-status">
        Active Account <ActiveDot active={true} />
      </div>
      <div className="gift-card__card-details">
        <div className="gift-card__card-preview"></div>
        <div className="gift-card__card-data">
          <label className="gift-card__label">Title</label>
          <input type="text" className="gift-card__input" />
          <label className="gift-card__label">Description</label>
          <textarea type="text" className="gift-card__input" />
          <div className="gift-card__validity">
            <input type="checkbox" className="gift-card__validity-checkbox" />{" "}
            Gift Card Validity
          </div>
          <div className="gift-card__validity_option">
            <select name="validity" id="validity">
              <option value="5">5 Months</option>
              <option value="5">5 Months</option>
              <option value="5">5 Months</option>
            </select>
          </div>
        </div>
      </div>

      <div className="gift-card__variant-data">
        <div className="gift-card__variant-grid-row">
          <label className="gift-card__label">Variant Name</label>
          <label className="gift-card__label">Gift Card Price</label>
          <label></label>
        </div>
        <div className="gift-card__variant-grid-row">
          <input
            type="text"
            className="gift-card__variant-input-title gift-card__input"
          />
          <input
            type="number"
            className="gift-card__variant-input-price gift-card__input"
          />
          <img src={DeleteIcon} alt="" />
        </div>
      </div>
      <div className="gift-card__append-variant">
        Append a Variant <img src={AddIcon} alt="" />
      </div>

      <PrimaryBtn $primary>Save</PrimaryBtn>
    </div>
  );
};

export default CreateGiftCard;
