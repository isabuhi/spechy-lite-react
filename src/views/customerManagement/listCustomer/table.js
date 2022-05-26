// ** React Imports
import React, { Fragment, useState, useEffect, memo, useContext } from "react";

// ** Table Columns
import { columns } from "./columns";

// ** Store & Actions
import { getAllCustomerData, deleteCustomer } from "../store/Actions";
import { useSelector, useDispatch } from "react-redux";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import { ChevronDown, Plus } from "react-feather";
import DataTable from "react-data-table-component";
import {
  Card,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import axios from "axios";
import { Search } from "react-feather";

// import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
// import { IntlContext } from "../../../../utility/context/Internationalization";
import { FormattedMessage } from "react-intl";
const DataTableServerSide = () => {
  // const context = useContext(IntlContext);

  let history = useHistory();
  const handleAddClick = () => {
    history.push("contacts/add-contact");
  };
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.customers);
  console.log("newstore", store);
  // ** States
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [searchValue, setSearchValue] = useState("");
  const [tableState, setFormState] = useState({
    renderId: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal);
  useEffect(() => {
    dispatch(
      getAllCustomerData({
        offset: currentPage,
        limit: rowsPerPage,
        search: searchValue,
      })
    );
  }, [tableState.renderId]);

  const handleChange = (val) => {
    setSearchTerm(val);
  };
  // ** Function to handle filter
  const handleFilter = (e) => {
    setSearchValue(e);
    dispatch(
      getAllCustomerData({
        offset: currentPage,
        limit: rowsPerPage,
        search: e,
      })
    );
    setSearchValue(e);
  };

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    dispatch(
      getAllCustomerData({
        offset: page.selected + 1,
        limit: rowsPerPage,
        search: searchValue,
      })
    );
    setCurrentPage(page.selected + 1);
  };

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    console.log("value amount", value);
    dispatch(
      getAllCustomerData({
        offset: 1,
        limit: value,
        search: searchValue,
      })
    );
    setRowsPerPage(value);
    setCurrentPage(1);
    // console.log('handlePerPage limit value : ', value)
    // console.log('handlePerPage currentPage value : ', currentPage)
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = store.totalPages;
    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        breakLabel="..."
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={
          "pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
        }
      />
    );
  };

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
              <FormattedMessage id="contacts"></FormattedMessage>
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

            <Button.Ripple color="primary" onClick={handleAddClick}>
              <FormattedMessage id="addNewCustomer"></FormattedMessage>
            </Button.Ripple>
          </Col>
        </Row>
      </div>
    );
  };

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      q: searchValue,
    };
    console.log(store.allData);
    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0;
    });
    // console.log('store.data', store.templatesList)
    if (store.allData.length > 0) {
      return store.allData;
    } else if (store.allData.length === 0 && isFiltered) {
      return [];
    } else {
      return store.allData.slice(0, rowsPerPage);
    }
  };
  const deleteUserModalToggle = () => {
    dispatch({
      type: "CLOSE_MODALS",
      data: false,
    });
  };
  const handlePerPageRefresh = () => {
    console.log("here2");
    setTimeout(
      function () {
        dispatch(
          getAllCustomerData({
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
        isOpen={store.isDeleteModalOpens.status}
        className="modal-dialog-centered"
        modalClassName="modal-danger"
        toggle={deleteUserModalToggle}
      >
        <ModalHeader>
          <FormattedMessage id="Delete Customer"></FormattedMessage>
        </ModalHeader>
        <ModalBody>
          <FormattedMessage id="Are you sure to delete this Customer?"></FormattedMessage>
        </ModalBody>
        <ModalFooter>
          <Button.Ripple
            color="danger"
            onClick={() =>
              dispatch(
                deleteCustomer(store.isDeleteModalOpens.id),
                setTimeout(handlePerPageRefresh(), 1000),
                console.log(1)
              )
            }
          >
            <FormattedMessage id="Accept"></FormattedMessage>
          </Button.Ripple>
          <Button.Ripple
            color="secondary"
            onClick={() =>
              dispatch({
                type: "CLOSE_MODAL",
                data: false,
              })
            }
          >
            <FormattedMessage id="Cancel"></FormattedMessage>
          </Button.Ripple>
        </ModalFooter>
      </Modal>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">
            <FormattedMessage id="contacts"></FormattedMessage>
          </CardTitle>
          <Button className="ml-2" color="primary" onClick={handleAddClick}>
            <Plus size={15} />
            <span className="align-middle ml-50">
              <FormattedMessage id="addNewCustomer"></FormattedMessage>
            </span>
          </Button>
        </CardHeader>
        <Row className="mx-0 mt-1 mb-70">
          <Col sm="3">
            <div className="d-flex align-items-center">
              <Label for="sort-select">
                <FormattedMessage id="Show"> </FormattedMessage>
              </Label>
              <Input
                className="dataTable-select"
                type="select"
                id="sort-select"
                value={rowsPerPage}
                onChange={(e) => handlePerPage(e)}
              >
                <option value={7}>7</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>
              {/* <Label for="sort-select">
                <FormattedMessage id="Entries"> </FormattedMessage>
              </Label> */}
            </div>
          </Col>
          <Col
            className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
            sm="3"
          >
            <Label className="mr-1" for="search-input">
              <FormattedMessage id="search"> </FormattedMessage>
            </Label>
            <Input
              className="dataTable-filter"
              type="text"
              bsSize="sm"
              id="search-input"
              value={searchValue}
              onChange={handleFilter}
            />
          </Col>
        </Row>
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
          // subHeaderComponent={
          //   <CustomHeader
          //     toggleSidebar={toggleSidebar}
          //     handlePerPage={handlePerPage}
          //     rowsPerPage={rowsPerPage}
          //     searchTerm={searchTerm}
          //     handleFilter={handleFilter}
          //     handleChange={handleChange}
          //   />
          // }
        />
      </Card>
    </Fragment>
  );
};

export default memo(DataTableServerSide);
