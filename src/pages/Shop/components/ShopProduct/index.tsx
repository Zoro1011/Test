import React, { useState } from "react";
import { IProduct } from "../../../../bussiness/product";
import CardProduct from "../../../../components/CardProduct";

interface IProps {
  data: IProduct[];
}

const ShopProduct = ({ data }: IProps) => {
  return (
    <div className="row">
      {data?.length > 0
        ? data?.map((e, i) => (
            <div className="col-md-6 col-lg-3 ftco-animate" key={i}>
              <CardProduct book={e} />
            </div>
          ))
        : "Hiện không có sản phẩm nào trong danh mục này"}
    </div>
  );
};

export default ShopProduct;
