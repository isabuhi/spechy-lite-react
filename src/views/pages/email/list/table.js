// ** React Imports
import React, { Fragment, useState, useEffect, memo, useContext } from "react";

// ** Table Columns
import { Columns } from "./columns";

// ** Store & Actions
import { getConversationReadCodeList, deleteEmail } from "../store/actions";
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
import { useHistory } from "react-router";
import { IntlContext } from "../../../../utility/context/Internationalization";
import { FormattedMessage } from "react-intl";
const DataTableServerSide = () => {
  const context = useContext(IntlContext);

  let history = useHistory();
  const handleAddClick = () => {
    history.push("/email/add");
  };
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.emailTemplate);
  console.log("whatsthe problem", store);
  // ** States
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [searchValue, setSearchValue] = useState("");
  const [tableState, setFormState] = useState({
    renderId: 1,
  });
  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal);
  useEffect(() => {
    dispatch(
      getConversationReadCodeList({
        offset: currentPage,
        limit: rowsPerPage,
        search: searchValue,
      })
    );
  }, [tableState.renderId]);
  // ** Function to handle filter
  const handleFilter = (e) => {
    setSearchValue(e.target.value);
    dispatch(
      getConversationReadCodeList({
        offset: currentPage,
        limit: rowsPerPage,
        search: e.target.value,
      })
    );
    setSearchValue(e.target.value);
  };

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    dispatch(
      getConversationReadCodeList({
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
    dispatch(
      getConversationReadCodeList({
        offset: 1,
        limit: value,
        search: searchValue,
      })
    );
    setRowsPerPage(value);
    setCurrentPage(1);
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

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      q: searchValue,
    };
    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0;
    });
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
      type: "CLOSE_EMAIL_MODAL",
      data: false,
    });
  };
  const handlePerPageRefresh = () => {
    setTimeout(
      function () {
        dispatch(
          getConversationReadCodeList({
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
        toggle={deleteUserModalToggle}
      >
        <ModalHeader>
          <FormattedMessage id="Delete Mail Template"> </FormattedMessage>
        </ModalHeader>
        <ModalBody>
          <FormattedMessage id="Are you sure to delete this SMS Template?">
            {" "}
          </FormattedMessage>
        </ModalBody>
        <ModalFooter>
          <Button.Ripple
            color="danger"
            onClick={() =>
              dispatch(
                deleteEmail(store.isDeleteModalOpen.id),
                setTimeout(handlePerPageRefresh(), 1000)
              )
            }
          >
            <FormattedMessage id="Accept"></FormattedMessage>
          </Button.Ripple>
          <Button.Ripple
            color="secondary"
            onClick={() =>
              dispatch({
                type: "CLOSE_EMAIL_MODAL",
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
            <FormattedMessage id="emailtemplates"> </FormattedMessage>
          </CardTitle>
          <Button className="ml-2" color="primary" onClick={handleAddClick}>
            <Plus size={15} />
            <span className="align-middle ml-50">
              <FormattedMessage id="addtemplates"> </FormattedMessage>
            </span>
          </Button>
        </CardHeader>
        <Row className="mx-0 mt-1 mb-50">
          <Col sm="6">
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
              <Label for="sort-select">
                <FormattedMessage id="Entries"> </FormattedMessage>
              </Label>
            </div>
          </Col>
          <Col
            className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
            sm="6"
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
          paginationServer
          className="react-dataTable"
          columns={Columns}
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={CustomPagination}
          data={dataToRender()}
        />
      </Card>
    </Fragment>
  );
};

export default memo(DataTableServerSide);
