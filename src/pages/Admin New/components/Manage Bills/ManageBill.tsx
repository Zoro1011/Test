import React from "react";
import { AiFillDelete, AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import { AiOutlineUserAdd } from "react-icons/ai";
import { LockingButton } from "../../../../components/LockingButton/LockingButton";
import { UnLockingButton } from "../../../../components/UnLockingButton/UnLockingButton";
import { IOrder } from "../../../../bussiness/order";
import { getALllOrderPaging } from "../../../../apis/order/getAllOrderPaging.api";
import { lockOrderAsync } from "../../../../apis/order/lockOrder.api";
import { getOrderStatus } from "../../../../apis/enum/orderStatus.api";
import { getPaymentStatus } from "../../../../apis/enum/paymentStatus.api";
import "./ManageBill.style.scss";
import { editOrderAsync } from "../../../../apis/order/editOrder.api";
import { notifySuccess } from "../../../../utils/notify";
export const ManageBill = () => {
  const [orders, setOrders] = React.useState<Array<IOrder>>([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPage, setTotalPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeOrder, setActiveOrder] = React.useState<any>();
  const [orderStatus, setOrderStatus] = React.useState<any>();
  const [paymentStatus, setPaymentStatus] = React.useState<any>();
  const [orderOptions, setOrderOptions] = React.useState<any>();
  const [paymentOptions, setPaymentOptions] = React.useState<any>();
  const pageSize = 15;
  React.useEffect(() => {
    getALllOrderPaging(pageSize, currentPage).then((rs) => {
      setOrders(rs?.data?.content);
      setTotalPage(rs?.data?.totalPages);
    });
    getOrderStatus().then((rs: any) => {
      setOrderOptions(rs?.data);
    });
    getPaymentStatus().then((rs: any) => {
      setPaymentOptions(rs?.data);
    });
  }, []);
  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    getALllOrderPaging(pageSize, currentPage).then((rs) => {
      setOrders(rs?.data?.content);
    });
  }, [currentPage]);
  React.useEffect(() => {
    setOrderStatus(null);
    setPaymentStatus(null);
  }, [activeOrder]);
  console.log(orders);
  console.log(orderStatus);
  console.log(paymentStatus);
  const editOrder = () => {
    editOrderAsync(activeOrder?.id, orderStatus).then((rs: any) => {
      if (rs && rs?.data) {
        console.log(rs);
        notifySuccess("S???a ????n h??ng th??nh c??ng");
      }
    });
  };
  return (
    <div className="manage-bill-container">
      <div className="title-wrapper">
        <div className="title">Qu???n L?? ????n H??ng </div>
      </div>
      <div className="top-action">
        <div className="search-container">
          <AiOutlineSearch className="ic" />
          <input type="text" className="search" placeholder="T??m ki???m" />
        </div>
        {/* <div className="btns">
          <div className="delete-order" onClick={() => {}}>
            <AiOutlineUserAdd /> X??a ????n h??ng
          </div>
        </div> */}
      </div>
      <div className="table-row table-head">
        <div className="stt">#</div>
        <div className="phone">S??? ??i???n tho???i</div>
        <div className="date">Ng??y t???o</div>
        <div className="processing">T??nh tr???ng </div>
        <div className="payment">Tr???ng th??i thanh to??n </div>
        <div className="address">?????a ch???</div>
        <div className="price">Gi??</div>
        <div className="actions">Action</div>
      </div>

      <div className="table-row-wrapper">
        {orders?.length > 0 && !isLoading ? (
          orders?.map((order, key) => {
            let isEdited = order?.id === activeOrder?.id;
            return (
              <div
                className={isEdited ? "table-row edited" : "table-row"}
                key={key}
              >
                <div className="stt">{currentPage * pageSize + key + 1}</div>
                <div className="phone">{order?.phone}</div>
                <div className="date">{order?.createdOn}</div>
                {!isEdited ? (
                  <div className="processing">{order?.processing}</div>
                ) : (
                  <div className="processing options">
                    {orderOptions?.map((o: any) => {
                      let isActive;
                      if (orderStatus !== null) {
                        isActive = orderStatus === o;
                      } else {
                        isActive = order?.processing === o;
                      }
                      return (
                        <div
                          className={isActive ? "op active" : "op"}
                          onClick={() => setOrderStatus(o)}
                        >
                          {o}
                        </div>
                      );
                    })}
                  </div>
                )}
                {!isEdited ? (
                  <div className="payment">{order?.payment?.processing}</div>
                ) : (
                  <div className="payment options">
                    {paymentOptions?.map((p: any) => {
                      let isActive;
                      if (paymentStatus !== null) {
                        isActive = paymentStatus === p;
                      } else {
                        isActive = order?.payment?.processing === p;
                      }
                      return (
                        <div
                          className={isActive ? "op active" : "op"}
                          onClick={() => setPaymentStatus(p)}
                        >
                          {p}
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="address">
                  {order?.address.district +
                    "," +
                    order?.address.city +
                    "," +
                    order?.address.country}
                </div>
                <div className="price">
                  {order?.total?.price.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}{" "}
                </div>

                <div className="actions">
                  {(orderStatus && isEdited) || (paymentStatus && isEdited) ? (
                    <div
                      className="del"
                      onClick={() => {
                        editOrder();
                        setActiveOrder(null);
                      }}
                    >
                      OK
                    </div>
                  ) : (
                    <AiOutlineEdit
                      className="del"
                      onClick={() => {
                        if (isEdited) {
                          setActiveOrder(null);
                          return;
                        }
                        setActiveOrder(order);
                      }}
                    />
                  )}
                  {order?.enable ? (
                    // <div className="lock"></div>
                    <LockingButton id={order?.id} lockFn={lockOrderAsync} />
                  ) : (
                    <UnLockingButton id={order?.id} lockFn={lockOrderAsync} />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="loading">
            <span className="spinner-border spinner-border-sm"></span>
            Loading...
          </div>
        )}
      </div>
      <div className="pagination">
        <div
          className="btn-change"
          onClick={() => {
            if (currentPage > 0) setCurrentPage(currentPage - 1);
          }}
        >
          {"<"}
        </div>
        {Array.from(Array(totalPage).keys()).map((item, key) => {
          return (
            <div
              className={currentPage === item ? "num active" : "num"}
              key={key}
              onClick={() => setCurrentPage(item)}
            >
              {item + 1}
            </div>
          );
        })}

        <div
          className="btn-change"
          onClick={() => {
            if (currentPage < totalPage - 1) setCurrentPage(currentPage + 1);
          }}
        >
          {">"}
        </div>
      </div>
    </div>
  );
};
