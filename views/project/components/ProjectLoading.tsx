import SkeletonLoading from "@/common/components/SkeletonLoading";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

const ProjectLoading = () => {
  const t = useTranslations();
  return <>
    <div className="container-fluid px-3 py-3">
      <h3 className="mb-0 mt-4">
        <FontAwesomeIcon icon={faBullseye} className="text-primary me-2" />
        {t("projects_page.page_title")}
      </h3>
      <div className="row mt-4">
        <div className="col-lg-3 col-md-4 col-12 mb-4">
          <div className="project-card">
            <SkeletonLoading heigth={80} />
          </div>
        </div>
        <div className="col-lg-3 col-md-4 col-12 mb-4">
          <div className="project-card">
            <SkeletonLoading heigth={80} />
          </div>
        </div>
        <div className="col-lg-3 col-md-4 col-12 mb-4">
          <div className="project-card">
            <SkeletonLoading heigth={80} />
          </div>
        </div>
        <div className="col-lg-3 col-md-4 col-12 mb-4">
          <div className="project-card">
            <SkeletonLoading heigth={80} />
          </div>
        </div>
      </div>
    </div>
  </>
}
export default ProjectLoading;