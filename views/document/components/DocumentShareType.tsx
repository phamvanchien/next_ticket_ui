import Button from "@/common/components/Button";
import { useTranslations } from "next-intl";
import React from "react";

interface DocumentShareTypeProps {
  shareType?: number
  setShareType: (shareType: number) => void
}

const DocumentShareType: React.FC<DocumentShareTypeProps> = ({ shareType, setShareType }) => {
  const t = useTranslations();
  return <>
    <div className="col-6 mt-2 mb-2">
      <Button color="secondary" outline={shareType === 2} fullWidth className="float-left btn-share-type" onClick={() => setShareType (1)}>
        {t('documents.share_in_project_label')}
      </Button>
    </div>
    <div className="col-6 mt-2 mb-2">
      <Button color="secondary" outline={shareType === 1} fullWidth className="float-left btn-share-type" onClick={() => setShareType (2)}>
        {t('documents.share_with_member')} <br/> {t('documents.just_you')}
      </Button>
    </div>
  </>
}
export default DocumentShareType;