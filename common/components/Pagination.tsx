import { rangeNumber } from "@/utils/helper.util";
import { faAngleDoubleLeft, faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface PaginationProps {
  totalPage: number
  page: number
  setPage: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ totalPage, page, setPage }) => {
  if (totalPage < 2) {
    return <></>
  }
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className={`page-item`} onClick={() => setPage (page - 1)}>
          <a className="page-link">
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </a>
        </li>
        {
          rangeNumber(1, (totalPage + 1)).map(p => (
            <li key={p} className={`page-item ${page === p ? 'active' : ''}`} onClick={() => setPage (p)}>
              <a className="page-link">
                {p}
              </a>
            </li>
          ))
        }
        <li className={`page-item`} onClick={() => setPage (page + 1)}>
          <a className="page-link">
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </a>
        </li>
      </ul>
    </nav>
  )
}
export default Pagination;