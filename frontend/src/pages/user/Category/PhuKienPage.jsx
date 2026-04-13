import React from "react";
import CategoryPageTemplate from "../../../components/Category/CategoryPageTemplate";

const PhuKienPage = () => (
  <CategoryPageTemplate
    title="PHỤ KIỆN NAM"
    subtitle="ACCESSORIES COLLECTION"
    breadcrumb="Phụ Kiện"
    heroImage="https://cdn.hstatic.net/files/1000360022/collection/phu-kien-dep_c9b77b2141e948968c7342347861a3d7.jpg"
    categoryKeywords={["giày","dép","balo","túi","nón","thắt lưng","vớ","mắt kính","phụ kiện"]}
    emptyText="Chưa có sản phẩm phụ kiện nào."
  />
);
export default PhuKienPage;
