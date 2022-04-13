// ** Redux Imports
import { combineReducers } from "redux";

// ** Reducers Imports
import auth from "./auth";
import navbar from "./navbar";
import layout from "./layout";
import menu from "./sidebarMenu";
import chat from "@src/views/apps/chat/store/reducer";
import todo from "@src/views/apps/todo/store/reducer";
import users from "../../views/pages/users/store/reducers";

import invoice from "@src/views/apps/invoice/store/reducer";
import calendar from "@src/views/apps/calendar/store/reducer";
import ecommerce from "@src/views/apps/ecommerce/store/reducer";
import dataTables from "@src/views/tables/data-tables/store/reducer";
import emailTemplate from "../../../src/views/pages/email/store/reducers";
import smstemplateReducer from "../../../src/views/pages/smstemplate/store/reducers/index";

import readyAnswer from "../../../src/views/pages/readyanswer/store/reducers";
import reasonCode from "../../../src/views/pages/reasoncode/store/reducers";
import ticketReasonCode from "../../../src/views/pages/ticketreasoncode/store/reducers";

import autoAssign from "../../views/pages/autoAssign/store/reducers";
import roleReducer from "../../views/pages/rolemanagement/store/reducers";
import chatWidget from "../../views/chat-widget/store/reducers";

import userGroups from "../../views/pages/userGroups/store/reducers";
import ticketcategory from "../../views/pages/ticketcategory/store/reducers";

import customers from "../../views/customerManagement/store/Reducers";
import tagManagement from "../../views/tagManagement/store/reducer";
import projectReducer from "../../views/pages/projects/store/reducers";

import companies from "../../views/companies/store/Reducers";
import mailManagement from "../../views/pages/mailManagement/store/reducers";
import facebookReducer from "../../views/social/facebook/store/reducers";
import whatsapp from "../../views/social/whatsapp/store/reducers";
import callList from "../../views/pages/callList/store/reducers";

const rootReducer = combineReducers({
  auth,
  menu,
  todo,
  chat,
  users,
  navbar,
  layout,
  invoice,
  calendar,
  ecommerce,
  dataTables,
  whatsapp,
  emailTemplate,
  autoAssign,
  userGroups,
  ticketcategory,
  tagManagement,
  customers,
  companies,
  mailManagement,
  facebookReducer,
  roleReducer,
  projectReducer,
  readyAnswer,
  reasonCode,
  ticketReasonCode,
  chatWidget,
  callList,
  smstemplateReducer,
});

export default rootReducer;
