import { categories } from "@/api/post.api";
import { API_CODE } from "@/enums/api.enum";
import { CategoryType } from "@/types/post.type";
import Link from "next/link";
import { useEffect, useState } from "react";

const CategoryMenu = () => {
  const [categoriesData, setCategoriesData] = useState<CategoryType[]>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categories({
          forMenu: true,
          page: 1,
          size: 7
        });
        setLoading(false);
        if (response && response.code === API_CODE.OK) {
          setCategoriesData(response.data.items);
          return;
        }
      } catch (error) {
        return;
      }
    }
    loadCategories();
  }, []);
  if (loading && !categoriesData) {
    return <></>
  }
  return (
    <div className="collapse navbar-collapse" id="nextpage_main_menu">
      <ul className="navbar-nav menu-open">
        <li className="current-menu-item">
          <Link href="/">Trang chủ</Link>
        </li>
        {
          categoriesData?.map(category => (
            <li className="current-menu-item" key={category.id}>
              <Link href={`/chuyen-muc/${category.slug}`}>{category.title}</Link>
            </li>
          ))
        }
        <li className="current-menu-item">
          <Link href="#banner">Tất cả chuyên mục</Link>
        </li>
      </ul>
    </div>
  )
}
export default CategoryMenu;