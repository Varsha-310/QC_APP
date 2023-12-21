import React, { useEffect, useState } from "react";
import "./styles/RefundPage.css";
import { useParams, useNavigate } from "react-router";
import { PrimaryBtn } from "../../components/BasicComponents";
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
  return res;
};
const RefundPage = () => {
  const [data, setData] = useState(null);
  const [inputData, setInputData] = useState([]);
  const [refundAmount, setRefundAmount] = useState();
  const [calcData, setCaclData] = useState(null);
  const [isCalcLoading, setIsCalcLoading] = useState(false);
  const [refundOption, setRefundOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [setting, setSetting] = useState(false);
  const [taxPercent, setTaxPercent] = useState(0);
  const [refundData, setRefundData] = useState([]);

  console.log({ refundData });

  const navigate = useNavigate();

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
    } catch (error) {
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
      refund: true,
    };

    try {
      const res = await instance.post(url, body, { headers });
      const resJson = await res.data;
      const resData = resJson?.data.orders;

      const totalPrice = parseFloat(resData?.total_price);
      const totalTax = parseFloat(resData?.total_tax);
      const taxPercentage = (totalTax * 100) / (totalPrice - totalTax);

      setRefundData(resJson?.data?.refund || []);
      setTaxPercent(taxPercentage);

      // to calculate refund quantity
      const tempData = [];
      const refundLines = resData?.refunds;

      if (refundLines?.length !== 0) {
        if (refundLines?.length !== 0) {
          refundLines.forEach((refundHistory) => {
            refundHistory?.refund_line_items.forEach((product) => {
              const prodIndex = tempData.findIndex(
                (item) => item.id === product.line_item_id
              );

              if (prodIndex === -1) {
                tempData.push({
                  id: product.line_item_id,
                  qty: product.quantity,
                });
              } else {
                tempData[prodIndex].qty += product.quantity;
              }
            });
          });
        }
      }

      const calculatedData = resData.line_items.map((prod) => {
        const proditem = tempData.find((item) => item.id === prod.id);

        return proditem
          ? { ...prod, quantity: prod.quantity - proditem.qty }
          : prod;
      });

      setData(calculatedData);

      // for empty array
      const emptyInputArray = resData.line_items.map((prod) => ({
        id: prod.id,
        qty: 0,
        totalPrice: 0,
        totalTax: 0,
      }));
      setInputData(emptyInputArray);

      // transactions
      // const transactions = resData?.data?.refunds;
      // let totalRefunded = 0;
      // transactions?.forEach((trans) => {
      //   if (trans?.length > 1) {
      //     trans.forEach((transItem) => {
      //       totalRefunded += transItem.price;
      //     });
      //   }
      // });
    } catch (error) {}
  };

  // to initiate refund
  const handleInitiate = async () => {
    setIsLoading(true);

    const lineData = inputData.map((item) => ({
      id: item.id,
      qty: item.qty !== "" ? item.qty : "0",
    }));

    const url = "/refund/initiate";
    const headers = {
      Authorization: getUserToken(),
    };

    const body = {
      orderId: id,
      line_items: lineData,
      amount: refundAmount,
      refund_type: refundOption?.refund_type || null,
    };

    try {
      const res = await instance.post(url, body, { headers });
      const resData = res.data;

      if (resData?.success === true) {
        setIsLoading(false);
        navigate("/refund_success", { replace: true });
      }

      alert(resData.message);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // to fetch  max refundable amount
  const calcRefund = async (oid, data) => {
    setIsCalcLoading(true);
    const url = "/refund/calculate";
    const headers = {
      Authorization: getUserToken(),
    };

    const body = {
      orderId: oid,
      line_items: data,
    };

    try {
      const res = await instance.post(url, body, { headers });
      const resData = res.data;
      setCaclData(resData.data);
    } catch (error) {
    } finally {
      setIsCalcLoading(false);
    }
  };

  // to handle quantity change
  const handleQuantityChange = (itemId, newQty, totalQty, price, taxlines) => {
    const qtyValue = Number(newQty);

    const taxPerItem = price * (taxPercent / 100);

    if (!isNaN(qtyValue) && qtyValue >= 0 && qtyValue <= totalQty) {
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
    }
  };

  useScrollTop();

  useEffect(() => {
    fetchData(id);

    getConfig();
  }, [id]);

  useEffect(() => {
    if (data) {
      calcRefund(id, [{ id: data[0]?.id, qty: data[0]?.quantity }]);
    }
  }, [data]);

  const handleRetryRefund = async (rfItem) => {
    setIsLoading(true);

    const lineData = rfItem?.line_items.map((item) => ({
      id: item.id,
      qty: item.qty !== "" ? item.qty : 0,
    }));

    const url = "/refund/initiate";
    const headers = {
      Authorization: getUserToken(),
    };

    const body = {
      orderId: refundData.order_id?.toString(),
      line_items: lineData,
      amount: rfItem.total?.toString(),
      refund_type: rfItem?.refund_type,
      retry_id: rfItem?.id,
    };

    try {
      const res = await instance.post(url, body, { headers });
      const resData = res.data;

      if (resData?.success === true) {
        setIsLoading(false);
        navigate("/refund_success", { replace: true });
      }

      alert(resData.message);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="refund-page__component component">
      {isLoading &&
        createPortal(<Spinner />, document.getElementById("portal"))}

      <div className="section-box-container">
        <div className="section-box-title bold">Refunding Order No: {id}</div>
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
          <div>
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
                          inputData.find((item) => item.id === product.id)?.qty
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

            {/* refund history */}
            {refundData?.logs && (
              <div className="refund-history-container">
                <div className="refund-page__title">Refund History</div>
                <table>
                  <tr>
                    <th>Trasaction Id</th>
                    <th>Date</th>

                    <th>Amount</th>
                    <th>Refund Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  {refundData?.logs?.map((rfItem, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <abbr
                            title={rfItem?.id}
                            style={{ textDecoration: "underline" }}
                          >
                            XXX{rfItem?.id.slice(-5)}
                          </abbr>
                        </td>
                        <td>
                          {rfItem?.refund_created_at
                            ? new Date(
                                rfItem?.refund_created_at
                              ).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "N/A"}
                        </td>
                        <td>{rfItem?.total || "NA"}</td>
                        <td>{rfItem?.refund_type}</td>
                        <td>{rfItem?.status}</td>
                        <td>
                          {rfItem?.status === "in-process" ?
                           ( ""
                            // <div
                            //   onClick={() => handleRetryRefund(rfItem)}
                            //   className="retry-btn"
                            // >
                            //   Retry
                            // </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            )}
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

                  <tr id="total-refund">
                    <td>Refund Total</td>
                    <td>
                      ₹{" "}
                      {(
                        parseFloat(countTotal(inputData, "totalPrice")) +
                        parseFloat(countTotal(inputData, "totalTax"))
                      ).toFixed(2)}
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
                    type="text"
                    placeholder="Enter Amount"
                    value={refundAmount}
                    onWheel={(e) => e.target.blur()}
                    onChange={
                      (e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d*$/.test(val)) setRefundAmount(val);
                      }

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
                  {/* <div className="refund-page__refund-amount">
                    Rs.{" "}
                    {calcData?.refund?.transactions
                      ?.reduce((acc, curr) => {
                        const currValue = parseFloat(curr.maximum_refundable);
                        return acc + currValue;
                      }, 0)
                      .toFixed(2) || 0}{" "}
                    Available for refund
                  </div> */}
                  <div style={{ margin: "10px 0px" }}>
                    <CustomDropdown
                      options={[
                        {
                          title: "Refund to  Store Credit",
                          value: "Store-credit",
                        },
                        {
                          title: "Refund Back-to-Source",
                          value: "Back-to-Source",
                        },
                      ]}
                      emptyText={"Select Refund Mode"}
                      keyField="refund_type"
                      value={refundOption?.refund_type || "NA"}
                      setvalue={setRefundOption}
                    />
                  </div>
                  <PrimaryBtn $primary width="100%" onClick={handleInitiate}>
                    {refundOption?.refund_type
                      ? refundOption?.refund_type === "Store-credit"
                        ? "Refund to Store-Credit"
                        : "Refund Back to Source"
                      : "Refund"}
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
