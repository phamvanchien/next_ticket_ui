import { APP_CONFIG } from "@/configs/app.config";
import { API_CODE, API_METHOD_ENUM } from "@/enums/api.enum";
import { APP_AUTH } from "@/enums/app.enum";
import { cookies } from "next/headers";
import { BaseResponseType } from "@/types/base.type";
import { WorkspaceType } from "@/types/workspace.type";
import { responseError, catchError } from "@/services/error.service";
import MenuSidebar from "@/common/layouts/MenuSidebar";
import ErrorPage from "@/common/layouts/ErrorPage";

interface LayoutProps {
  params: { id: number };
  children: React.ReactNode;
}

const fetchWorkspace = async (workspaceId: number): Promise<BaseResponseType<WorkspaceType>> => {
  try {
    const apiResponse = await fetch(
      `${APP_CONFIG.API.URL}${APP_CONFIG.API.PREFIX.workspace.url}/${workspaceId}`,
      {
        method: API_METHOD_ENUM.GET,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get(APP_AUTH.COOKIE_AUTH_KEY)?.value}`,
        },
      }
    );

    return await apiResponse.json();
  } catch (error) {
    const errorRes = responseError(500);
    errorRes.error = catchError();
    return errorRes;
  }
};

const WorkspaceLayout = async ({ params, children }: LayoutProps) => {
  const workspace = await fetchWorkspace(params.id);

  if (!workspace || workspace.code !== API_CODE.OK) {
    return <ErrorPage code={workspace.code} />;
  }

  return (
    <div id="layoutSidenav">
      <MenuSidebar workspace={workspace.data} />
      <div id="layoutSidenav_content">
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default WorkspaceLayout;