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
          size: 12
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
    <div className="nav-scroller py-1 mb-2">
      <nav className="nav d-flex justify-content-between">
        {
          categoriesData?.map(category => (
            <Link key={category.id} className="p-2 text-muted" href="#">{category.title}</Link>
          ))
        }
      </nav>
    </div>
  )
}
export default CategoryMenu;