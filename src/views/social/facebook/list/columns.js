// ** React Imports
import { Link, useRouteMatch } from "react-router-dom";

// ** Store & Actions
import { store } from "@store/storeConfig/store";
import Avatar from "@components/avatar";
// ** Third Party Components
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  MoreVertical,
  Trash2,
  Archive,
  FileText,
  Trash,
  Edit,
} from "react-feather";

const renderClient = (row) => {
  if (row.imgPath) {
    return <Avatar className="mr-1" img={row.imgPath} width="32" height="32" />;
  } else {
    const stateNum = Math.floor(Math.random() * 6),
      states = [
        "light-success",
        "light-danger",
        "light-warning",
        "light-info",
        "light-primary",
        "light-secondary",
      ],
      color = states[stateNum];
    return (
      <Avatar
        color={color || "primary"}
        className="mr-1"
        content={row.category || "John Doe"}
        initials
      />
    );
  }
};
const renderProject = (row) => {
  if (row.imgPath) {
    return <Avatar className="mr-1" img={row.imgPath} width="32" height="32" />;
  } else {
    const stateNum = Math.floor(Math.random() * 6),
      states = [
        "light-success",
        "light-danger",
        "light-warning",
        "light-info",
        "light-primary",
        "light-secondary",
      ],
      color = states[stateNum];
    return (
      <Avatar
        color={color || "primary"}
        className="mr-1"
        content={row.source.name || "John Doe"}
        initials
      />
    );
  }
};

export const Columns = [
  {
    name: "category",
    minWidth: "297px",
    selector: "category",
    sortable: true,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <Link to={`#`} className="user-name text-truncate mb-0">
            <span className="font-weight-bold">{row.category}</span>
          </Link>
          <small className="text-truncate text-muted mb-0">
            @{row.category}
          </small>
        </div>
      </div>
    ),
  },
  {
    name: "page name",
    selector: "page_name",
    sortable: true,
    minWidth: "150px",
    cell: (row) => row.page_name,
  },
  {
    name: "Source Name",
    selector: "Project Name",
    sortable: true,
    minWidth: "150px",
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderProject(row)}
        <div className="d-flex flex-column">
          <Link
            to={`/facebook/edit/${row.account_id}`}
            className="user-name text-truncate mb-0"
          >
            <span className="font-weight-bold">{row.source.name}</span>
          </Link>
        </div>
      </div>
    ),
  },
  {
    name: "Actions",
    minWidth: "50px",
    cell: (row) => (
      <UncontrolledDropdown>
        <DropdownToggle tag="div" className="btn btn-sm">
          <MoreVertical size={14} className="cursor-pointer" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            className="w-100"
            onClick={() => {
              store.dispatch({
                type: "CLOSE_MODAL",
                data: true,
                id: row.account_id,
              });
            }}
          >
            <Trash2 size={14} className="mr-50" />
            <span className="align-middle">Delete</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    ),
  },
];
