// ** React Imports
import React, { Fragment, useState, useEffect, useContext } from "react";

// ** Columns
import { columns } from "./columns";

// ** Store & Actions
import { getAllData, deleteCompany, getSmsRole } from "../store/Actions";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { ChevronDown, Plus } from "react-feather";
import DataTable from "react-data-table-component";
import {
  Card,
  CardHeader,
  CardTitle,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
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
            <h4>Companies</h4>
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

          <Button.Ripple color="primary" onClick={() => history.push("/companies/add")}>
            <FormattedMessage id="addnewcompany1"></FormattedMessage>
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
  const [searchValue, setSearchValue] = useState("");

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
        breakLabel="..."
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
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={
          "pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
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
  const history = useHistory();
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
      <CardHeader className="border-bottom">
          <CardTitle tag="h4">
            <FormattedMessage id="Companies"></FormattedMessage>
          </CardTitle>
          <Button className="ml-2" color="primary" onClick={() => history.push("/companies/add")}>
            <Plus size={15} />
            <span className="align-middle ml-50">
              <FormattedMessage id="Add New Company"></FormattedMessage>
            </span>
          </Button>
        </CardHeader>
        <Row className="mx-0 mt-1">
          <Col
            className="d-flex align-items-center justify-content-sm-start mt-sm-0 mt-1"
            sm="6"
          >
            
            <div className="chat-fixed-search">
            <div className="d-flex align-items-center w-100">
            <div className="sidebar-profile-toggle"></div>
              <InputGroup className="input-group-merge ml-1 w-100 sreach-chat">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className="round">
                    <Search className="text-muted" size={14} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  //value={searchValue}
                  className="round"
                  placeholder="Search"
                  onChange={handleFilter}
                />
              </InputGroup>
            </div>
          </div>
          </Col>
          <Col sm="6">
            <div className="d-flex align-items-center justify-content-sm-end">
              <Label className='mr-1' for="sort-select" size='lg'>Show entries</Label>
              <Input
                style={{width: "75px"}}
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
            </div>
          </Col>
        </Row>
        <DataTable
          noHeader
          pagination
          //responsive
          paginationServer
          columns={columns}
          sortIcon={<ChevronDown size={10} />}
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

export default CompanyList;
