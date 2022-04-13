import { useContext } from "react";
import { Link } from "react-router-dom";
import { store } from "@store/storeConfig/store";
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
} from "reactstrap";
import {
  Slack,
  User,
  Settings,
  Database,
  Edit2,
  MoreVertical,
  FileText,
  Trash2,
  Archive,
} from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@components/avatar";
import { IntlContext } from "../../../utility/context/Internationalization";
import { FormattedMessage } from "react-intl";

// ** Renders Client Columns
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
    name: <FormattedMessage id="companyname"></FormattedMessage>,
    minWidth: "297px",
    selector: "CompanyName",
    sortable: true,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <Link
            to={`/companies/edit-company/${row.customer_company_id}`}
            className="user-name text-truncate mb-0"
          >
            <span className="font-weight-bold">
              {row.company_name
                ? row.company_name.slice(0, 20) +
                  (row.company_name > 20 ? "..." : "")
                : ""}
            </span>
          </Link>
          <small className="text-truncate text-muted mb-0">
            @
            {row.company_name
              ? row.company_name.slice(0, 20) +
                (row.company_name > 20 ? "..." : "")
              : ""}
          </small>
        </div>
      </div>
    ),
  },
  {
    name: <FormattedMessage id="phone"></FormattedMessage>,
    minWidth: "297px",
    selector: "Phone",
    sortable: true,
    cell: (row) => row.phone_number,
  },
  {
    name: <FormattedMessage id="city"></FormattedMessage>,
    minWidth: "297px",
    selector: "City",
    sortable: true,
    cell: (row) => row.city_name,
  },
  {
    name: <FormattedMessage id="district"></FormattedMessage>,
    minWidth: "297px",
    selector: "District",
    sortable: true,
    cell: (row) => row.district_name,
  },
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
            to={`/companies/edit-company/${row.customer_company_id}`}
            className="w-100"
          >
            <Archive size={14} className="mr-50" />
            <span className="align-middle">Edit</span>
          </DropdownItem>
          <DropdownItem
            className="w-100"
            onClick={() => {
              store.dispatch({
                type: "DELETE_COMPANY_MODAL_OPEN",
                data: true,
                id: row.customer_company_id,
              });
              // console.log("objectrowid",store)
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
