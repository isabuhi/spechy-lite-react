// ** React Imports
import { Link, useRouteMatch } from "react-router-dom";
import { useContext } from "react";
// ** Store & Actions
import { store } from "@store/storeConfig/store";
import { IntlContext } from "../../../utility/context/Internationalization";
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
import Avatar from "@components/avatar";

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
        content={row.templateName || "Template Name "}
        initials
      />
    );
  }
};

export const columns = [
  {
    name: <FormattedMessage id="name"></FormattedMessage>,
    minWidth: "257px",
    selector: "name_surname",
    sortable: true,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <Link
            to={`/customers/edit-customer/${row.customer_id}`}
            className="user-name text-truncate mb-0"
          >
            <span className="font-weight-bold">
              {Object.keys(row)
                ? row.profile.name_surname.slice(0, 10) +
                  (row.profile.name_surname > 10 ? "..." : "")
                : ""}
            </span>
          </Link>
          <small className="text-truncate text-muted mb-0">
            @{" "}
            {Object.keys(row)
              ? row.profile.name_surname.slice(0, 10) +
                (row.profile.name_surname > 10 ? "..." : "")
              : ""}
          </small>
        </div>
      </div>
    ),
  },
  {
    name: <FormattedMessage id="Email"></FormattedMessage>,
    minWidth: "257px",
    selector: "email_address",
    sortable: true,
    cell: (row) => (row.email === null ? "" : row.email.email_address),
  },
  {
    name: <FormattedMessage id="Phone"></FormattedMessage>,
    minWidth: "257px",
    selector: "phone_number",
    sortable: true,
    cell: (row) => (row.phone === null ? "" : row.phone.phone_number),
  },
  // {
  //   name: <FormattedMessage id="Email"></FormattedMessage>,
  //   minWidth: "197px",
  //   selector: "City",
  //   sortable: true,
  //   cell: (row) => row.city_name,
  // },
  // {
  //   name: <FormattedMessage id="district"></FormattedMessage>,
  //   minWidth: "197px",
  //   selector: "District",
  //   sortable: true,
  //   cell: (row) => row.district_name,
  // },
  {
    name: <FormattedMessage id="options"></FormattedMessage>,
    minWidth: "50px",
    cell: (row) => (
      <UncontrolledDropdown>
        <DropdownToggle tag="div" className="btn btn-sm">
          <MoreVertical size={14} className="cursor-pointer" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            tag={Link}
            to={`/customers/edit-customer/${row.customer_id}`}
            className="w-100"
          >
            <Archive size={14} className="mr-50" />
            <span className="align-middle">
              <FormattedMessage id="Edit"></FormattedMessage>
            </span>
          </DropdownItem>
          <DropdownItem
            className="w-100"
            onClick={() => {
              console.log("row", row.customer_id);
              store.dispatch({
                type: "CLOSE_MODALS",
                data: true,
                id: row.customer_id,
              });
            }}
          >
            <Trash2 size={14} className="mr-50" />
            <span className="align-middle">
              <FormattedMessage id="Delete"></FormattedMessage>
            </span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    ),
  },
];
