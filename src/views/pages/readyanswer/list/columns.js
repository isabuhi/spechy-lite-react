// ** React Imports
import { Link, useRouteMatch } from "react-router-dom";
import { useContext } from "react";

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
import { IntlContext } from "../../../../utility/context/Internationalization";
import { FormattedMessage } from "react-intl";

const renderClient = (row) => {
  const context = useContext(IntlContext);

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
    name: <FormattedMessage id="title"> </FormattedMessage>,
    minWidth: "357px",
    selector: "fullName",
    sortable: true,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <Link
            to={`/readyanswer/edit/${row.ready_answer_id}`}
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
    name: <FormattedMessage id="source"> </FormattedMessage>,
    selector: "templateTopic",
    sortable: true,
    minWidth: "150px",
    cell: (row) => (
      // console.log("rw=eadyrow", row),

      <span>{Array.isArray(row) ? row.source.name : ""}</span>
    ),
  },
  {
    name: <FormattedMessage id="Status"> </FormattedMessage>,
    selector: "templateTopic",
    sortable: true,
    minWidth: "150px",
    cell: (row) => (
      <span>
        {row.status === 1 && <p>Active</p>}
        {row.status === 0 && <p>Passive</p>}
      </span>
    ),
  },
  {
    name: <FormattedMessage id="options"> </FormattedMessage>,
    minWidth: "50px",
    cell: (row) => (
      <UncontrolledDropdown>
        <DropdownToggle tag="div" className="btn btn-sm">
          <MoreVertical size={14} className="cursor-pointer" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            tag={Link}
            to={`/readyanswer/edit/${row.ready_answer_id}`}
            className="w-100"
          >
            <Archive size={14} className="mr-50" />
            <span className="align-middle">
              <FormattedMessage id="Edit"> </FormattedMessage>
            </span>
          </DropdownItem>
          <DropdownItem
            className="w-100"
            onClick={() => {
              store.dispatch({
                type: "DELETE_READY_MODAL_OPEN",
                data: true,
                id: row.ready_answer_id,
              });
            }}
          >
            <Trash2 size={14} className="mr-50" />
            <span className="align-middle">
              <FormattedMessage id="Delete"> </FormattedMessage>
            </span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    ),
  },
];
