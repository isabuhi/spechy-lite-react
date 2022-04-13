// ** React Imports
import React, { Fragment, useState, useEffect, useContext } from "react";

// ** Columns
import { columns } from "./columns";

// ** Store & Actions
import { getAllData, deleteCompany, getSmsRole } from "../store/Actions";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import {
  Card,
  Input,
  Row,
  Col,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import { useHistory } from "react-router-dom";
import { Search } from "react-feather";
// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { IntlContext } from "../../../utility/context/Internationalization";
import { FormattedMessage } from "react-intl";

// ** Table Header
const CustomHeader = ({
  toggleSidebar,
  handlePerPage,
  handleFilter,
  rowsPerPage,
  searchTerm,
  handleChange,
}) => {
  const history = useHistory();
  return (
    <div className="invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75">
      <Row>
        <Col xl="6" className="d-flex align-items-center p-0">
          <div className="d-flex align-items-center w-100">
            <FormattedMessage id="companies"></FormattedMessage>
          </div>
        </Col>

        <Col
          xl="6"
          className="d-flex align-items-sm-center justify-content-lg-end justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pr-lg-1 p-0 mt-lg-0 mt-1"
        >
          <div className="d-flex align-items-center mb-sm-0 mb-1 mr-2">
            <Label className="mb-0" for="search-invoice">
              <FormattedMessage id="search"></FormattedMessage>
            </Label>
            <Input
              id="search-invoice"
              className="ml-50 w-100"
              type="text"
              value={searchTerm}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFilter(searchTerm);
                }
              }}
            />
            <div
              style={{ cursor: "pointer" }}
              className="d-flex align-items-center justify-content-center mb-sm-0 mb-1 ml-1"
            >
              <Search onClick={() => handleFilter(searchTerm)} />
            </div>
          </div>

          <Button.Ripple
            color="primary"
            onClick={() => history.push("/companies/add")}
          >
            <FormattedMessage id="addnewcompany"></FormattedMessage>
          </Button.Ripple>
        </Col>
      </Row>
    </div>
  );
};

const CompanyList = () => {
  const context = useContext(IntlContext);

  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.companies);

  // ** States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentStatus, setCurrentStatus] = useState({
    value: "Select",
    label: "Select",
    id: null,
  });
  const [tableState, setFormState] = useState({
    renderId: 1,
  });
  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    dispatch(
      getAllData({
        page: 1,
        perPage: 10,
        status: "",
        searchValue: "",
      })
    );
  }, []);

  //   useEffect(() => {
  //     dispatch(
  //       getSmsRole({
  //         page: 1,
  //         perPage: 10,
  //         status: "",
  //         searchValue: "",
  //         allData: 1,
  //       })
  //     );
  //   }, []);

  // ** Function in get data on page change
  const handlePagination = (page) => {
    dispatch(
      getAllData({
        page: page.selected + 1,
        perPage: rowsPerPage,
        status: currentStatus.id ? currentStatus.value : "",
        searchValue: searchTerm,
      })
    );
    setCurrentPage(page.selected + 1);
  };

  const handleChange = (val) => {
    setSearchTerm(val);
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    dispatch(
      getAllData({
        page: 1,
        perPage: value,
        status: currentStatus.id ? currentStatus.value : "",
        searchValue: searchTerm,
      })
    );
    setRowsPerPage(value);
  };

  // ** Function in get data on search query change
  const handleFilter = (val) => {
    dispatch(
      getAllData({
        page: currentPage,
        perPage: rowsPerPage,
        status: currentStatus.id ? currentStatus.value : "",
        searchValue: val,
      })
    );
    setSearchTerm(val);
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = store.totalPage;
    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        pageCount={count || 1}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        containerClassName={
          "pagination react-paginate justify-content-end my-2 pr-1"
        }
      />
    );
  };

  // ** Table data to render
  const dataToRender = () => {
    console.log("renderedData", store);
    if (store.allData.length > 0) {
      return store.allData;
    } else if (store.data.length === 0) {
      return [];
    } else {
      return store.allData.slice(0, rowsPerPage);
    }
  };

  const deleteProjectModalToggle = () => {
    dispatch({
      type: "DELETE_COMPANY_MODAL_OPEN",
      data: false,
    });
  };
  const handlePerPageRefresh = () => {
    setTimeout(
      function () {
        dispatch(
          getAllData({
            offset: 1,
            limit: 10,
            search: "",
          })
        );
        setFormState({
          ...tableState,
          renderId: 2,
        });
      }.bind(this),
      2000
    );
  };

  return (
    <Fragment>
      <Modal
        isOpen={store.isDeleteModalOpen.status}
        className="modal-dialog-centered"
        modalClassName="modal-danger"
        toggle={deleteProjectModalToggle}
      >
        <ModalHeader>Delete Company</ModalHeader>
        <ModalBody>Are you sure to delete this Company?</ModalBody>
        <ModalFooter>
          <Button.Ripple
            color="danger"
            onClick={() =>
              dispatch(
                deleteCompany(store.isDeleteModalOpen.id),
                setTimeout(handlePerPageRefresh(), 1000)
              )
            }
          >
            Accept
          </Button.Ripple>
          <Button.Ripple
            color="secondary"
            onClick={() =>
              dispatch({
                type: "DELETE_COMPANY_MODAL_OPEN",
                data: false,
              })
            }
          >
            Cancel
          </Button.Ripple>
        </ModalFooter>
      </Modal>

      <Card>
        <DataTable
          noHeader
          pagination
          subHeader
          responsive
          paginationServer
          columns={columns}
          sortIcon={<ChevronDown />}
          className="react-dataTable"
          paginationComponent={CustomPagination}
          data={dataToRender()}
          subHeaderComponent={
            <CustomHeader
              toggleSidebar={toggleSidebar}
              handlePerPage={handlePerPage}
              rowsPerPage={rowsPerPage}
              searchTerm={searchTerm}
              handleFilter={handleFilter}
              handleChange={handleChange}
            />
          }
        />
      </Card>
    </Fragment>
  );
};

export default CompanyList;
