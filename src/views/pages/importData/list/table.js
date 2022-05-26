// ** React Imports
import React, { Fragment, useState, useEffect, memo } from "react";

// ** Table Columns
import { Columns } from "./columns";
import useJwt from "@src/auth/jwt/useJwt";
// ** Store & Actions
import { getAllEmailTemplates, deleteEmailTemplate } from "../store/actions";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import {
  ChevronDown,
  Plus,
  AlertCircle,
  ArrowLeftCircle,
  Coffee,
  UserPlus,
} from "react-feather";
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
  CardBody,
  Form,
} from "reactstrap";
import axios from "axios";
import { useForm } from "react-hook-form";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import Uppy from "@uppy/core";
import thumbnailGenerator from "@uppy/thumbnail-generator";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  isObjEmpty,
  getHomeRouteForLoggedInUser,
} from "../../../../utility/Utils";

import { DragDrop } from "@uppy/react";
import FormGroup from "reactstrap/lib/FormGroup";
import BodyTable from "./bodyTable";
import TableRow from "./tableRow";
import SelectData from "./selectData";
import ListData from "./listData";

const DataTableServerSide = () => {
  let history = useHistory();
  const handleAddClick = () => {
    history.push("/tag-management/add");
  };
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.emailTemplate);
  // ** States
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [searchValue, setSearchValue] = useState("");
  const [formState, setFormState] = useState({
    name: "",
  });
  const [file, setUploadFile] = useState();
  const [headerData, setHeaderData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [dataTypes, setDataTypes] = useState([]);
  const [disabled, setDisabled] = useState(true);

  const [uploadResponse, setUploadResponse] = useState();

  // ** Custom Pagination

  const { register, errors, handleSubmit } = useForm({
    mode: "onSubmit",
  });

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

  const onSubmit = (event) => {
    console.log("file", file);
    event.preventDefault();
    const access_token = useJwt.getToken();
    const dataArray = new FormData();

    dataArray.append("file", file[0]);

    axios
      .post(
        `${BASE_URL}/api/project-management/import-data/import`,
        dataArray,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((response) => {
        console.log("response", response);
        const headerData = response.data.data.headers;

        const previewData = response.data.data.preview_datas;
        const dataTypes = response.data.data.data_types;
        console.log("data_types", dataTypes);
        console.log("previewData", previewData);

        setHeaderData(headerData);
        setPreviewData(previewData);
        setDataTypes(dataTypes);
      })

      .catch((error) => {
        setUploadResponse();
      });
  };

  useEffect(() => {
    setUploadResponse();
  }, []);

  useEffect(() => {
    if (formState.name && file) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, []);

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Import Data - Upload File</CardTitle>
        </CardHeader>

        <Row className="mx-0 mt-1 mb-50">
          <Col sm="6" className="form-inline">
            <Label className="mr-2" for="search-input">
              <FormattedMessage id="Package Name"></FormattedMessage>
            </Label>
            <Input
              className="dataTable-filter"
              type="text"
              id="search-input"
              // value={formState.name}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  [e.target.name]: e.target.value,
                });
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col sm="4">
            <Form className="d-flex">
              <FormGroup>
                <SelectData
                  heading={headerData}
                  body={previewData}
                  dataTypes={dataTypes}
                />
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col sm="4">
            <Form className="d-flex pl-1 mt-1" onSubmit={onSubmit}>
              <FormGroup>
                <Input
                  style={{}}
                  name="file"
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files)}
                />
              </FormGroup>
              <Button
                type="submit"
                disabled={disabled}
                style={{ paddingLeft: "14px", paddingBottom: "10px" }}
                color="primary"
              >
                <FormattedMessage id="Upload"></FormattedMessage>
              </Button>
            </Form>
          </Col>
        </Row>
        <div>
          <BodyTable
            heading={headerData}
            body={previewData}
            dataTypes={dataTypes}
          />
        </div>
        <div>
          <ListData
            heading={headerData}
            body={previewData}
            dataTypes={dataTypes}
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default memo(DataTableServerSide);
