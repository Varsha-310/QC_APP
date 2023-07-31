import React, { useCallback, useEffect, useState } from "react";
import "./styles/RefundPage.css";
import { useParams } from "react-router";
import { Dot, PrimaryBtn } from "../../components/BasicComponents";
import CustomDropdown from "../../components/CustomDropdown";
import instance from "../../axios";
import { getUserToken } from "../../utils/userAuthenticate";
import { LuImage } from "react-icons/lu";
import useScrollTop from "../../hooks/useScrollTop";
import Toast from "../../components/Toast";
import { createPortal } from "react-dom";
import Spinner from "../../components/Loaders/Spinner";

// calculate total from a array of object
const countTotal = (obj, key) => {
  const res = obj
    ?.reduce((acc, curr) => {
      const currValue = parseFloat(curr[key]);
      return acc + currValue;
    }, 0)
    .toFixed(2);

  return parseFloat(res);
};
const RefundPage = () => {
  const [data, setData] = useState(null);
  const [inputData, setInputData] = useState([]);

  const [refundAmount, setRefundAmount] = useState();
  const [calcData, setCaclData] = useState(null);
  const [isCalcLoading, setIsCalcLoading] = useState(false);
  const [refundData, setRefundData] = useState([]);
  const [refundOption, setRefundOption] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [setting, setSetting] = useState(false);

  console.log(refundData);

  console.log(data);

  const { id } = useParams();

  // getsetting
  const getConfig = async () => {
    setIsLoading(true);
    const url = "/refund/getSetting";
    const headers = {
      Authorization: getUserToken(),
    };
    try {
      const res = await instance.get(url, { headers });
      const resData = res?.data;
      console.log(resData.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // fetch item data
  const fetchData = async (id) => {
    const url = "/order/details";
    const headers = {
      Authorization: getUserToken(),
    };
    const body = {
      orderId: id.toString(),
    };

    try {
      const res = await instance.post(url, body, { headers });
      const resData = res.data;

      console.log(resData);
      // setData(resData.data);

      // to calculate refund quantity
      const dum = [];
      const refundLines = resData.data?.refunds;
      if (refundLines?.length !== 0) {
        if (refundLines?.length !== 0) {
          refundLines.forEach((refundHistory) => {
            refundHistory?.refund_line_items.forEach((product) => {
              const prodIndex = dum.findIndex(
                (item) => item.id === product.line_item_id
              );

              if (prodIndex === -1) {
                dum.push({ id: product.line_item_id, qty: product.quantity });
              } else {
                // console.log(dum[prodIndex].qty);
                console.log("index", prodIndex);
                dum[prodIndex].qty += product.quantity;
              }
            });
          });
        }
      }

      console.log("dum", dum);

      const calculatedData = resData.data.line_items.map((prod) => {
        const proditem = dum.find((item) => item.id === prod.id);

        return proditem
          ? { ...prod, quantity: prod.quantity - proditem.qty }
          : prod;
      });

      // console.log("obj", calculatedData);
      setData(calculatedData);
    } catch (error) {
      console.log(error);
    }
  };

  // to initiate refund
  const handleInitiate = async () => {
    setIsLoading(true);

    const lineData = inputData.map((item) => ({ id: item.id, qty: item.qty }));

    const url = "/refund/initiate";
    const headers = {
      Authorization: getUserToken(),
    };

    const body = {
      orderId: id,
      line_items: lineData,
      amount: refundAmount,
      refund_type: refundOption?.refund_type, //Back-to-Source , Store-credit
    };
    console.log("body", body);

    try {
      const res = await instance.post(url, body, { headers });
      const resData = res.data;
      console.log("initiate", resData);
      alert(resData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // to fetch  max refundable amount
  const calcRefund = async (oid, data) => {
    setIsCalcLoading(true);
    console.log("calculate");
    const url = "/refund/calculate";
    const headers = {
      Authorization: getUserToken(),
    };
    console.log(inputData);
    const body = {
      orderId: oid,
      line_items: data,
    };

    try {
      const res = await instance.post(url, body, { headers });
      const resData = res.data;
      setCaclData(resData.data);
      console.log(resData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsCalcLoading(false);
    }
  };

  // to handle quantity change
  const handleQuantityChange = (itemId, newQty, totalQty, price, taxlines) => {
    const qtyValue = Number(newQty);

    const taxPerItem = taxlines.reduce((acc, curr) => {
      const cvalue = parseFloat(curr.price);
      return acc + cvalue;
    }, 0);

    if (!isNaN(qtyValue) && qtyValue > 0 && qtyValue <= totalQty) {
      const itemIndex = inputData.findIndex((item) => item.id === itemId);

      if (itemIndex !== -1) {
        const updatedInputData = [...inputData];
        updatedInputData[itemIndex].qty = newQty;
        updatedInputData[itemIndex].totalPrice = newQty * price;
        updatedInputData[itemIndex].totalTax = newQty * taxPerItem;
        setInputData(updatedInputData);
      } else {
        const newItem = {
          id: itemId,
          qty: newQty,
          totalPrice: newQty * price,
          totalTax: newQty * taxPerItem,
        };
        setInputData((prev) => [...prev, newItem]);
      }
    } else {
      const updatedInputData = inputData.filter((item) => item.id !== itemId);
      setInputData(updatedInputData);
    }
  };

  // for call calucate refund in every change

  useScrollTop();

  useEffect(() => {
    fetchData(id);

    getConfig();

    // calcRefund();
  }, [id]);

  useEffect(() => {
    if (data) {
      calcRefund(id, [{ id: data[0]?.id, qty: data[0]?.quantity }]);
    }
  }, [data]);

  return (
    <div className="refund-page__component component">
      {isLoading &&
        createPortal(<Spinner />, document.getElementById("portal"))}

      <div className="section-box-container">
        <div className="section-box-title bold">
          Refunding Order No: {id} Orders Via Gift Card
        </div>
      </div>

      {setting === null ? (
        <Toast>
          Please set your store preferences before initiating the Refund!
        </Toast>
      ) : (
        ""
      )}

      <div className="section-box-container main-component">
        <div className="refund-page__refund-item-data">
          {/* refund items */}
          <div className="refund-page__details">
            {data?.map((product, index) => {
              return (
                <div className="refund-page__product-detail" key={index}>
                  <div className="refund-page__product-data">
                    <LuImage className="gc-table-icons" />
                    <div>
                      <div className="refund-page__product-title">
                        {product?.title}
                      </div>
                      <div className="refund-page__product-price">
                        ₹ {product?.price}
                      </div>
                    </div>
                  </div>
                  <div className="refund-page__product-count">
                    <input
                      type="number"
                      name="qty"
                      id={product.id}
                      // value={inputData[index]?.qty ? inputData[index]?.qty : ""}
                      value={
                        inputData.find((item) => item.id === product.id)?.qty ||
                        ""
                      }
                      onChange={(e) =>
                        handleQuantityChange(
                          product?.id,
                          e.target.value,
                          product?.quantity,
                          product?.price,
                          product?.tax_lines
                        )
                      }
                    />
                    / {product?.quantity}
                  </div>
                  <div className="refund-page__product-refund-total">
                    ₹
                    {inputData.find((item) => item.id === product.id)?.qty
                      ? parseFloat(
                          inputData.find((item) => item.id === product.id)
                            ?.qty * product?.price
                        ).toFixed(2)
                      : "00.00"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* refund summary */}
          {isCalcLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="refund-page__summary">
              <div className="refund-page__refund-process">
                <div className="refund-page__title">Summary</div>

                {/* total price estimation */}

                <table className="refund-page__price-summary-table">
                  <tr>
                    <td>Item Subtotal</td>
                    <td>₹ {countTotal(inputData, "totalPrice")}</td>
                  </tr>
                  <tr>
                    <td>{inputData?.length} Items</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Tax</td>
                    <td>₹ {countTotal(inputData, "totalTax")}</td>
                  </tr>
                  {/* <tr>
                  <td>Shipping</td>
                  <td>₹00</td>
                </tr> */}
                  <tr id="total-refund">
                    <td>Refund Total</td>
                    <td>
                      ₹{" "}
                      {countTotal(inputData, "totalPrice") +
                        countTotal(inputData, "totalTax")}
                    </td>
                  </tr>
                </table>

                <div className="horinzontal-bar"></div>
              </div>

              <div className="refund-page__refund-shipping">
                <div className="refund-page__shipping-rate">
                  <div className="refund-page__title">
                    Refund Product Amount
                  </div>
                  <input
                    type="number"
                    placeholder="Enter Amount"
                    value={refundAmount}
                    onChange={
                      (e) => setRefundAmount(e.target.value)
                      // calcData?.refund
                      //   ? countTotal(
                      //       calcData?.refund?.transactions,
                      //       "maximum_refundable"
                      //     ) <= e.target.value
                      //     ? setRefundAmount(e.target.value)
                      //     : ""
                      //   : ""
                    }
                    className="refund-page__shipping-rate-input"
                  />
                  <div className="refund-page__refund-amount">
                    Rs.{" "}
                    {calcData?.refund?.transactions
                      ?.reduce((acc, curr) => {
                        const currValue = parseFloat(curr.maximum_refundable);
                        return acc + currValue;
                      }, 0)
                      .toFixed(2) || 0}{" "}
                    Available for refund
                  </div>
                  <div style={{ margin: "10px 0px" }}>
                    <CustomDropdown
                      options={[
                        {
                          title: "Initiate to  Store Credit",
                          value: "Store-credit",
                        },
                        { title: "Back to Source", value: "Back-to-Source" },
                      ]}
                      keyField="refund_type"
                      value={refundOption?.refund_type || "NA"}
                      setvalue={setRefundOption}
                    />
                  </div>
                  <PrimaryBtn $primary width="100%" onClick={handleInitiate}>
                    Refund to Store-Credit
                  </PrimaryBtn>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefundPage;
