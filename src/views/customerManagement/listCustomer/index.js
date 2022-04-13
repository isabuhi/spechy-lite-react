// ** User List Component
import Table from "./table";

// ** Styles
import "@styles/react/apps/app-users.scss";
import Breadcrumbs from "../subComponents/breadCrumbs"

const ProjectList = () => {
  return (
    <div className="app-user-list">
      <div className="d-flex justify-content-start breadcrumb-wrapper">
        <Breadcrumbs/>
      </div>
      <Table />
    </div>
  );
};

export default ProjectList;
