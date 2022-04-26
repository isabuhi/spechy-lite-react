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
  PenTool,
  Chrome,
  EyeOff,
  ShieldOff,
  PhoneMissed,
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
        content={row.fullName || "John Doe"}
        initials
      />
    );
  }
};

export const Columns = [
  {
    name: "Title",
    minWidth: "500px",
    selector: "fullName",
    sortable: true,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <Link
            to={`/vedio-chat-widget/edit/${row.widget_id}`}
            className="user-name text-truncate mb-0"
          >
            <span className="font-weight-bold">{row.title}</span>
          </Link>
          <small className="text-truncate text-muted mb-0">@{row.title}</small>
        </div>
      </div>
    ),
  },
  {
    name: "Online",
    minWidth: "50px",
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <Link
          to={`/vedio-chat-widget/edit/${row.widget_id}`}
          className="user-name text-truncate mb-0"
        >
          <PenTool size={14} className="mr-50" />
        </Link>
        <Link
          to={`/vedio-chat-widget/window/${row.widget_id}`}
          className="user-name text-truncate mb-0"
        >
          <Chrome size={14} className="mr-50" />
        </Link>
      </div>
    ),
  },
  {
    name: "Offline",
    minWidth: "50px",
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <Link
          to={`/vedio-chat-widget/form/${row.widget_id}`}
          className="user-name text-truncate mb-0"
        >
          <EyeOff size={14} className="mr-50" />
        </Link>
        <Link
          to={`/vedio-chat-widget/offline/${row.widget_id}`}
          className="user-name text-truncate mb-0"
        >
          <ShieldOff size={14} className="mr-50" />
        </Link>
        <Link
          to={`/vedio-chat-widget/button/${row.widget_id}`}
          className="user-name text-truncate mb-0"
        >
          <PhoneMissed size={14} className="mr-50" />
        </Link>
      </div>
    ),
  },
  {
    name: "Action",
    minWidth: "50px",
    cell: (row) => (
      <UncontrolledDropdown>
        <DropdownToggle tag="div" className="btn btn-sm">
          <MoreVertical size={14} className="cursor-pointer" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            tag={Link}
            to={`/vedio-chat-widget/js/${row.widget_id}/${row.file_key}`}
            className="w-100"
          >
            <Archive size={14} className="mr-50" />
            <span className="align-middle">Vedio Chat Code JS</span>
          </DropdownItem>
          <DropdownItem
            className="w-100"
            onClick={() => {
              console.log("delete");
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
