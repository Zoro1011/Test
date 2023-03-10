import { GrFormAdd } from "react-icons/gr";
import { IoIosCloseCircle } from "react-icons/io";
import { SignUp } from "../../../../SignUp";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { IoLogoFacebook, IoLogoGoogle, IoLogoTwitter } from "react-icons/io";
import "./EditUser.style.scss";
import { signUpSchema } from "../../../../../validate/auth";
import { registerAsync } from "../../../../../apis/auths/register.api";
import { Link } from "react-router-dom";
import { notifyError, notifySuccess } from "../../../../../utils/notify";
import { createNewAdminAsync } from "../../../../../apis/user/createNewAdmin.api";
import { createNewUserAsync } from "../../../../../apis/user/createNewUser.api";
import React from "react";
import { getListCategoryName } from "../../../../../apis/category/listCategoryName";
import { editProduct } from "../../../../../apis/product/editProduct.api";
import { Spinner } from "react-bootstrap";
import { ButtonSpinner } from "../../../../../components/ButtonSpinner";
const size_mock = ["S", "M", "L", "XL", "XXL"];
export const EditProduct = ({ setVisibility, product }: any) => {
  const [colors, setColors] = React.useState<Array<string>>(
    product.options.color
  );
  const [sizes, setSizes] = React.useState(product.options.sizes);
  const [quantiy, setQuantity] = React.useState(product.quantity);
  const [title, setTitle] = React.useState(product.title);
  const [desc, setDesc] = React.useState(product.descriptions[0].description);
  const [discount, setDiscount] = React.useState(product.discount);
  const [price, setPrice] = React.useState(product.price.price);
  const [categories, setCategories] = React.useState<Array<any>>([]);
  const [category, setCategory] = React.useState();
  const [img, setImg] = React.useState<any>();
  // const [imgFiles, setImgFiles] = React.useState<any>();
  const [isLoading, setIsLoading] = React.useState(false);
  console.log(colors);
  React.useEffect(() => {
    setCategory(product.fallIntoCategories[0]?.title);
    getListCategoryName().then((rs: any) => {
      setCategories(rs?.data);
    });
  }, []);
  const handleEditProduct = () => {
    if (
      sizes?.find((s: any) => {
        return s.quantity < 0;
      })
    ) {
      notifyError("S??? l?????ng kh??ng h???p l???!");
      return;
    }
    let productData: any = {
      id: product.id,
      title: title,
      descriptions: [
        {
          description: desc,
          language: "vi",
        },
      ],
      discount: discount,
      enable: true,
      fallIntoCategories: [
        {
          id: categories.find((item) => item.title === category)?.id,
          title: category,
        },
      ],
      options: {
        color: colors,
        sizes: sizes,
      },
      quantity: quantiy,
      price: {
        price: price,
        currency: "VND",
      },
    };
    const formData = new FormData();
    const productJson = JSON.stringify(productData);
    const blobProduct = new Blob([productJson], {
      type: "application/json",
    });
    const blobImage = new Blob([img], {
      type: "multipart/form-data",
    });
    formData.append("dto", blobProduct);
    for (let i = 0; i < img?.length; i++) {
      formData.append("files", img[i]);
    }
    editProduct(formData, product.id);
    setTimeout(() => setIsLoading(false), 1000);
  };
  // React.useEffect(() => {
  //   const imgStored = JSON.parse(localStorage.getItem(product.id));
  //   setImg(imgStored);
  // }, []);
  // React.useEffect(() => {
  //   console.log("blob", imgFiles);
  // }, [imgFiles]);

  return (
    <div className="edit-product">
      <div
        className="bg"
        onClick={() => {
          setVisibility(false);
        }}
      ></div>
      <div className="content">
        <div className="title">S???a s???n ph???m</div>
        <div className="field">
          <div className="label">Ti??u ????? :</div>
          <input
            type="text"
            placeholder="Nh???p ti??u ?????"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
        </div>
        <div className="field desc">
          <div className="label">M?? t??? :</div>
          <textarea
            name=""
            id=""
            cols={30}
            rows={5}
            onChange={(e: any) => setDesc(e.target.value)}
          >
            {desc}
          </textarea>
        </div>

        {/* {img?.length > 0 && (
          <div className="field">
            <div className="label"> </div>
            <div className="preview-wrapper">
              <div
                className="delete-all"
                onClick={() => {
                  const ele = document.querySelector(
                    "#imgs_select"
                  ) as HTMLElement;
                  ele.
                }}
              >
                x
              </div>
              {img?.length > 0 &&
                img?.map((i: any) => {
                  return <img src={i} />;
                })}
            </div>
          </div>
        )} */}
        <div className="btns">
          <div className="btn cancel" onClick={() => setVisibility(false)}>
            H???y
          </div>
          <div
            className="btn add"
            onClick={() => {
              setIsLoading(true);
              handleEditProduct();
            }}
          >
            {isLoading ? <ButtonSpinner /> : "S???a"}
          </div>
        </div>
      </div>
    </div>
  );
};
