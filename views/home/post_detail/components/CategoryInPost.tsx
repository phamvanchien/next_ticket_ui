import { CategoryType } from "@/types/post.type";
import Link from "next/link";
import React from "react";

interface CategoryInPostProps {
  categories: CategoryType[]
}

const CategoryInPost: React.FC<CategoryInPostProps> = ({ categories }) => {
  return (
    <div className="tagcloud">
      {
        categories.map(category => (
          <Link href={`/chuyen-muc/${category.slug}`}>{category.title}</Link>
        ))
      }
    </div>
  )
}
export default CategoryInPost;