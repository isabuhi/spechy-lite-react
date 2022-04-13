// ** React Imports
import { Link, useRouteMatch } from "react-router-dom";

// ** Store & Actions
import { store } from "@store/storeConfig/store";
import Avatar from "@components/avatar";
import { FormattedMessage } from "react-intl";
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
        content={row.fullName || "John Doe"}
        initials
      />
    );
  }
};

export const Columns = [
  {
    name: "Title",
    minWidth: "287px",
    selector: "fullName",
    sortable: true,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <Link
            to={`/tickets/edit/${row.ticket_id}`}
            className="user-name text-truncate mb-0"
          >
            <span className="font-weight-bold">{row.subject}</span>
          </Link>
          <small className="text-truncate text-muted mb-0">
            @{row.subject}
          </small>
        </div>
      </div>
    ),
  },
  {
    name: "Description",
    selector: "templateTopic",
    sortable: true,
    minWidth: "150px",
    cell: (row) => <span>{row.description}</span>,
  },
  {
    name: "Status",
    selector: "templateTopic",
    sortable: true,
    minWidth: "150px",
    cell: (row) => (
      <span>
        {row.status === 1 && <p>open ticket </p>}
        {row.status === 2 && <p>Resolved</p>}
        {row.status === 3 && <p>Unresolved</p>}
        {row.status === 4 && <p>reopen</p>}
      </span>
    ),
  },
  {
    name: "Delete Status",
    selector: "templateTopic",
    sortable: true,
    minWidth: "150px",
    cell: (row) => (
      <span>
        {row.is_delete === 0 && <p>Active</p>}
        {row.is_delete === 1 && <p>Passive</p>}
      </span>
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
            tag={Link}
            to={`/tickets/edit/${row.ticket_id}`}
            className="w-100"
          >
            <Archive size={14} className="mr-50" />
            <span className="align-middle"><FormattedMessage id="Edit"></FormattedMessage></span>
          </DropdownItem>
          <DropdownItem
            className="w-100"
            onClick={() => {
              store.dispatch({
                type: "CLOSE_MODAL",
                data: true,
                id: row.ticket_id,
              });
            }}
          >
            <Trash2 size={14} className="mr-50" />
            <span className="align-middle"><FormattedMessage id="Delete"></FormattedMessage></span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    ),
  },
];
