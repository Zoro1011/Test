import React, { useEffect, useState } from "react";
import "./style.scss";
import { moneyFormater, moneyFormaterDong } from "../../utils/moneyFormater";
import { getOrderByUserID } from "../../apis/order/gerOrderByUserID";
import { AiOutlineFieldTime } from "react-icons/ai";
import { FaShippingFast } from "react-icons/fa";
import { IoMdCloudDone } from "react-icons/io";
import { getOrderStatus } from "../../apis/enum/orderStatus.api";

interface OrderProps {}

const OrderPage = (props: OrderProps) => {
  const [orders, setOrders] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [tab, setTab] = React.useState<number>(0);
  const [orderEnum, setOrderEnum] = useState<any>([]);
  const [orderShown, setOrderShown] = useState<any>();

  React.useEffect(() => {
    getOrderStatus().then((rs: any) => {
      if (rs && rs?.data) {
        setOrderEnum(rs?.data);
      }
    });
    getOrderByUserID().then((rs: any) => {
      if (rs && rs?.data) {
        setOrders(rs?.data);
      }
    });
    // setOrderShown(orders);
  }, []);
  React.useEffect(() => {
    let temp = [...orders]?.filter((item: any) => {
      return item.processing === orderEnum[tab];
    });
    setOrderShown([...temp]);
  }, [orderEnum, orders]);
  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    let temp = [...orders]?.filter((item: any) => {
      return item.processing === orderEnum[tab];
    });
    setOrderShown([...temp]);
  }, [tab]);

  console.log(orders);
  console.log(orderShown);

  return (
    <div className="orderPage container">
      <div className="tt">Thông tin đơn hàng của bạn:</div>
      <div className="orderPage-wrapper">
        <div className="tabs">
          <div
            className={tab === 0 ? "tab active" : "tab"}
            onClick={() => {
              setTab(0);
            }}
          >
            <AiOutlineFieldTime className="ic waiting" /> Đang xử lí
          </div>
          <div
            className={tab === 1 ? "tab active" : "tab"}
            onClick={() => {
              setTab(1);
            }}
          >
            <FaShippingFast className="ic shipping" /> Đang vận chuyển
          </div>
          <div
            className={tab === 2 ? "tab active" : "tab"}
            onClick={() => {
              setTab(2);
            }}
          >
            <IoMdCloudDone className="ic done" /> Đã giao
          </div>
        </div>
      </div>
      <div className="orderPage-bottom" style={{}}>
        {orderShown && orderShown?.length > 0 && !isLoading ? (
          orderShown?.map((item: any, i: any) => (
            <div className="payment">
              <div className="head">
                <div className="processing">
                  <span> Trạng thái:</span>
                  {item.processing === "Chua_Xu_Ly" ? "  Chưa xử lý" : ""}
                  <div className="id">
                    <span> Mã đơn hàng : </span>
                    {item.id}
                  </div>
                </div>

                <div className="payment-status">
                  Thanh toán:
                  {item?.payment === null ? (
                    <div
                      className="btn-payment"
                      // onClick={() => {
                      //   handlePayment(item.id);
                      // }}
                    >
                      {isLoading ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        "Ship COD"
                      )}
                    </div>
                  ) : (
                    <div className="btn-payment purchased">
                      Đã thanh toán (VNPAY)
                    </div>
                  )}
                </div>
              </div>
              <div className="body">
                <div className="lb">Danh sách sản phẩm bao gồm:</div>
                <div className="pros">
                  {item?.productsInOrder?.map((pro: any) => {
                    let data = pro?.product;
                    let price =
                      pro?.quantity *
                      (data?.price.price -
                        (data?.price.price * data?.discount) / 100);
                    return (
                      <div className="pro">
                        <img
                          src={pro?.product.images[0]}
                          alt="product image"
                          className="ava"
                        />
                        <div className="info">
                          <div className="name">
                            <span>{pro?.product.title}</span>
                          </div>
                          <div className="quantity">
                            <span> x{pro?.quantity}</span>
                          </div>
                        </div>
                        <div className="price">{moneyFormaterDong(price)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        ) : orderShown && isLoading ? (
          <div className="loading">
            <span className="spinner-border spinner-border-sm"></span>
            Loading...
          </div>
        ) : (
          <div> Không có đơn hàng nào ở mục này </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
