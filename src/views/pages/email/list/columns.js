// ** React Imports
import { Link, useRouteMatch } from "react-router-dom";
import { useContext } from "react";
// ** Store & Actions
import { store } from "@store/storeConfig/store";
import Avatar from "@components/avatar";
import { IntlContext } from "../../../../utility/context/Internationalization";
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
  PenTool,
  Chrome,
  EyeOff,
  ShieldOff,
  PhoneMissed,
  Edit,
  Delete,
} from "react-feather";

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
    name: <FormattedMessage id="templatename"></FormattedMessage>,
    selector: "templateName",
    sortable: true,
    minWidth: "225px",
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <Link
            to={`/email/edit/${row.template_id}`}
            className="user-name text-truncate mb-0"
          >
            <span className="font-weight-bold">
              {row.name.slice(0, 10) + (row.name > 10 ? "..." : "")}
            </span>
          </Link>
          <small className="text-truncate text-muted mb-0">
            @{row.name.slice(0, 10) + (row.name > 10 ? "..." : "")}
          </small>
        </div>
      </div>
    ),
  },
  {
    name: <FormattedMessage id="topicoftemplate"></FormattedMessage>,
    selector: "templateTopic",
    sortable: true,
    minWidth: "250px",
    cell: (row) => row.subject,
  },
  {
    name: <FormattedMessage id="dateofadding"></FormattedMessage>,
    selector: "dateAdded",
    sortable: true,
    minWidth: "250px",
    cell: (row) => row.created_at,
  },
  {
    name: <FormattedMessage id="options"></FormattedMessage>,
    minWidth: "100px",
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <Link className="user-name text-truncate mb-0">
          <Delete
            size={14}
            className="mr-50"
            onClick={() => {
              store.dispatch({
                type: "CLOSE_EMAIL_MODAL",
                data: true,
                id: row.template_id,
              });
            }}
          />
        </Link>
        <Link
          to={`/email/edit/${row.template_id}`}
          className="user-name text-truncate mb-0"
        >
          <Edit size={14} className="mr-50" />
        </Link>
      </div>
      // <UncontrolledDropdown>
      //   <DropdownToggle tag="div" className="btn btn-sm">
      //     <MoreVertical size={14} className="cursor-pointer" />
      //   </DropdownToggle>
      //   <DropdownMenu right>
      //     <DropdownItem
      //       tag={Link}
      //       to={`/email/edit/${row.template_id}`}
      //       className="w-100"
      //     >
      //       <Archive size={14} className="mr-50" />
      //       <span className="align-middle">
      //         <FormattedMessage id="Edit"></FormattedMessage>
      //       </span>
      //     </DropdownItem>
      //     <DropdownItem
      //       className="w-100"
      //       onClick={() => {
      //         store.dispatch({
      //           type: "CLOSE_EMAIL_MODAL",
      //           data: true,
      //           id: row.template_id,
      //         });
      //       }}
      //     >
      //       <Trash2 size={14} className="mr-50" />
      //       <span className="align-middle">
      //         <FormattedMessage id="Delete"></FormattedMessage>
      //       </span>
      //     </DropdownItem>
      //   </DropdownMenu>
      // </UncontrolledDropdown>
    ),
  },
];
