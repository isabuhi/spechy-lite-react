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
        content={row.fullName || "John Doe"}
        initials
      />
    );
  }
};

export const ticketsColumns = [
  {
    name: "Starting Date",
    selector: "start_at",
    sortable: true,
    minWidth: "150px",
    cell: (row) => <span>{row.start_at}</span>,
  },
  {
    name: "Status",
    selector: "templateTopic",
    sortable: true,
    minWidth: "150px",
    cell: (row) => (
      <span>
        {row.status === 0 && <p>Pending</p>}
        {row.status === 1 && <p>Resolved</p>}
        {row.status === 2 && <p>Unresolved</p>}
        {row.status === 3 && <p>Unresolved</p>}
      </span>
    ),
  },
];
