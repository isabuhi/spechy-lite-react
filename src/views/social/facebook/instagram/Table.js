// ** React Imports
import React, { Fragment, useState, useEffect, memo } from "react";

// ** Table Columns
import { Columns } from "./columns";

// ** Store & Actions
import { getInstaList } from "../store/actions";
import { useSelector, useDispatch } from "react-redux";

// ** Third Party Components
import ReactPaginate from "react-paginate";
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
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import "./index.css";

import { useHistory } from "react-router";
import {
  Facebook,
  Twitter,
  Mail,
  GitHub,
  AlertCircle,
  ArrowLeftCircle,
  Coffee,
  UserPlus,
  ChevronDown,
  Plus,
} from "react-feather";
import Avatar from "../../../../@core/components/avatar";
import { toast, Slide } from "react-toastify";
import useJwt from "../../../../@core/auth/jwt/useJwt";
import { handleLogin } from "../../../../redux/actions/auth";
import FacebookLogin from "react-facebook-login";
import InstagramLogin from "react-instagram-login";

const DataTableServerSide = () => {
  let history = useHistory();

  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.facebookReducer);
  console.log("helloherer", store);
  // ** States
  const [modal, setModal] = useState(false);
  const [accessTokens, setAccessToken] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [searchValue, setSearchValue] = useState("");
  const [faceData, setFaceData] = useState([]);
  const [faceToken, setFaceToken] = useState("");

  const [tableState, setFormState] = useState({
    renderId: 1,
  });
  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal);
  useEffect(() => {
    dispatch(
      getInstaList({
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
      getInstaList({
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
      getInstaList({
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
      getInstaList({
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

  const ToastContent = ({ header, content, type }) => {
    return (
      <Fragment>
        <div className="toastify-header">
          <div className="title-wrapper">
            {type === "success" ? (
              <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
            ) : (
              <Avatar
                size="sm"
                color="danger"
                icon={<AlertCircle size={12} />}
              />
            )}
            <h6 className="toast-title font-weight-bold">{header}</h6>
          </div>
        </div>
        <div className="toastify-body">
          <span>{content}</span>
        </div>
      </Fragment>
    );
  };

  const responseFacebook = (response) => {
    console.log("fieldsres", response);
    setPagePermissions(response);
  };

  const handlepag = () => {
    console.log("here");
    setTimeout(
      function () {
        dispatch(
          getInstaList({
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

  const setPagePermissions = async (response) => {
    console.log("iamhere");
    await axios
      .post(
        `${BASE_URL}/api/instagram-management/account/set-page-permissions`,
        {
          access_token: response.accessToken,
        }
      )

      .then((res) => {
        console.log("instaresofpersmissions", res);
        if (res.status === 200) {
          toast.success(
            <ToastContent
              type={"success"}
              content={"You have successfully added a Whatsapp channel."}
              header={"Congratulations !!"}
            />,
            { transition: Slide, hideProgressBar: true, autoClose: 3000 }
          );
          handlepag();
          // history.goBack();
        }
      })
      .catch(() =>
        toast.error(
          <ToastContent
            type={"error"}
            content={"Something went wrong. Please try again!"}
            header={"Error !!"}
          />,
          { transition: Slide, hideProgressBar: true, autoClose: 3000 }
        )
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
    console.log("store.data", store);
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
      type: "CLOSE_MODAL",
      data: false,
    });
  };
  const handlePerPageRefresh = () => {
    console.log("here");
    setTimeout(
      function () {
        dispatch(
          getInstaList({
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
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Instagram Accounts</CardTitle>
          {/* <InstagramLogin
            clientId="962417357205224"
            buttonText="Login"
            onSuccess={responseFacebook}
            // onFailure={responseInstagram}
          /> */}

          <FacebookLogin
            appId="552791352751789"
            autoLoad={true}
            fields="name,email,picture"
            scope="instagram_basic,instagram_manage_messages"
            callback={responseFacebook}
            cssClass="my-facebook-button-class"
          />
        </CardHeader>
        <Row className="mx-0 mt-1 mb-50">
          <Col sm="6">
            <div className="d-flex align-items-center">
              <Label for="sort-select">show</Label>
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
              <Label for="sort-select">entries</Label>
            </div>
          </Col>
          <Col
            className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
            sm="6"
          >
            <Label className="mr-1" for="search-input">
              Search
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
