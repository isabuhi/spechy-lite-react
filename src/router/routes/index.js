import { lazy } from "react";

// ** Document title
const TemplateTitle = "Spechy CRN";

// ** Default Route
const DefaultRoute = "/home";
const DynamicRoutesBreadCrumbs = ({ match }) => {
  if (match.params.templateID) {
    return <span>Editing Template</span>;
  }

  return <span>Edit Template</span>;
};
// ** Merge Routes
const Routes = [
  {
    path: "/login",
    component: lazy(() => import("../../views/pages/authentication/Login")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/register",
    component: lazy(() => import("../../views/pages/authentication/Register")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  // {
  //   path: "/verify",
  //   component: lazy(() => import("../../views/pages/authentication/Verify")),
  //   path: "/register",
  //   component: lazy(() => import("../../views/pages/authentication/Register")),
  //   layout: "BlankLayout",
  //   meta: {
  //     authRoute: true,
  //   },
  // },
  {
    path: "/verify",
    component: lazy(() => import("../../views/pages/authentication/Verify")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/forgot-password",
    component: lazy(() =>
      import("../../views/pages/authentication/ForgotPasswordV2")
    ),
    layout: "BlankLayout",

    meta: {
      authRoute: true,
    },
  },
  {
    path: "/submit-password",
    component: lazy(() =>
      import("../../views/pages/authentication/passwordSubmited")
    ),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/forget-password/:token",
    component: lazy(() =>
      import("../../views/pages/authentication/ResetPasswordV2")
    ),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/reset-password",
    component: lazy(() =>
      import("../../views/pages/authentication/ResetPasswordV2")
    ),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/home",
    component: lazy(() => import("../../views/dashboard/ecommerce/index")),
    breadcrumb: "Dashboard",
  },

  {
    path: "/conversations",
    appLayout: true,
    className: "chat-application",
    component: lazy(() => import("../../views/apps/chat/index")),
    breadcrumb: "Conversations",
  },
  {
    path: "/datatables/basic",
    component: lazy(() => import("../../views/tables/data-tables/basic")),
  },
  {
    path: "/chat-widget/list",
    component: lazy(() => import("../../views/chat-widget/list")),
  },
  {
    path: "/chat-widget/edit/:id",
    component: lazy(() => import("../../views/chat-widget/edit/index")),
  },
  {
    path: "/chat-widget/js/:id/:file",
    component: lazy(() => import("../../views/chat-widget/js/index")),
  },
  {
    path: "/chat-widget/window/:id",
    component: lazy(() => import("../../views/chat-widget/window/index")),
  },
  {
    path: "/chat-widget/button/:id",
    component: lazy(() => import("../../views/chat-widget/button/index")),
  },
  {
    path: "/chat-widget/offline/:id",
    component: lazy(() => import("../../views/chat-widget/offline/index")),
  },
  {
    path: "/chat-widget/contact/:id",
    component: lazy(() => import("../../views/chat-widget/contact/index")),
  },
  {
    path: "/chat-widget/form/:id",
    component: lazy(() => import("../../views/chat-widget/form/index")),
  },
  {
    path: "/vedio-chat-widget/list",
    component: lazy(() => import("../../views/video-chat-widget/list")),
  },
  {
    path: "/vedio-chat-widget/edit/:id",
    component: lazy(() =>
      import("../../views/video-chat-widget/editVedioCallButton/index")
    ),
  },
  {
    path: "/vedio-chat-widget/js/:id/:file",
    component: lazy(() => import("../../views/video-chat-widget/js/index")),
  },
  {
    path: "/vedio-chat-widget/window/:id",
    component: lazy(() => import("../../views/video-chat-widget/window/index")),
  },
  {
    path: "/vedio-chat-widget/offline/:id",
    component: lazy(() =>
      import("../../views/video-chat-widget/offline/index")
    ),
  },
  {
    path: "/vedio-chat-widget/button/:id",
    component: lazy(() =>
      import("../../views/video-chat-widget/onlineChatButton/index")
    ),
  },
  {
    path: "/vedio-chat-widget/form/:id",
    component: lazy(() =>
      import("../../views/video-chat-widget/offlineForm/index")
    ),
  },

  {
    path: "/social/whatsapp/index",
    component: lazy(() => import("../../views/social/whatsapp/list/index")),
  },
  {
    path: "/media/reactfacebook",
    component: lazy(() => import("../../views/social/facebook/list/index")),
  },
  {
    path: "/media/instagram/list",
    component: lazy(() =>
      import("../../views/social/facebook/instagram/index")
    ),
  },
  {
    path: "/social/whatsapp/add",
    component: lazy(() => import("../../views/social/whatsapp/add/index")),
  },
  {
    path: "/social/whatsapp/edit/:id",
    component: lazy(() => import("../../views/social/whatsapp/edit/index")),
  },
  {
    path: "/social/whatsapp/qr/:id",
    component: lazy(() => import("../../views/social/whatsapp/connect/index")),
  },
  {
    path: "/email",
    component: lazy(() => import("../../views/pages/email/list")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/email/add",
    component: lazy(() => import("../../views/pages/email/add")),
    breadcrumb: "Add Template",
  },

  {
    path: "/email/edit/:templateID",
    component: lazy(() => import("../../views/pages/email/edit")),
    exact: true,
    breadcrumb: DynamicRoutesBreadCrumbs,
  },
  {
    path: "/reasoncode/list",
    component: lazy(() => import("../../views/pages/reasoncode/list")),
  },
  // {
  //   path: "/social/whatsapp/add",
  //   component: lazy(() => import("../../views/social/whatsapp/add/index")),
  // },
  {
    path: "/social/whatsapp/edit/:id",
    component: lazy(() => import("../../views/social/whatsapp/edit/index")),
  },
  {
    path: "/social/whatsapp/qr/:id",
    component: lazy(() => import("../../views/social/whatsapp/connect/index")),
  },
  {
    path: "/settings/emailtemplates",
    component: lazy(() => import("../../views/pages/email/list")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/email/add",
    component: lazy(() => import("../../views/pages/email/add")),
    breadcrumb: "Add Template",
  },
  {
    path: "/email/edit",
    component: lazy(() => import("../../views/pages/email/edit")),
    exact: true,
    breadcrumb: null,
  },
  {
    path: "/email/edit/:templateID",
    component: lazy(() => import("../../views/pages/email/edit")),
    exact: true,
    breadcrumb: DynamicRoutesBreadCrumbs,
  },
  {
    path: "/settings/conversationsreasons",
    component: lazy(() => import("../../views/pages/reasoncode/list")),
    exact: true,
    breadcrumb: "Conversations Reasons Code",
  },
  {
    path: "/auto-assign/list",
    component: lazy(() => import("../../views/pages/autoAssign/list")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/auto-assign/add",
    component: lazy(() => import("../../views/pages/autoAssign/add")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/auto-assign/edit/:id",
    component: lazy(() => import("../../views/pages/autoAssign/edit")),
  },
  {
    path: "/reasoncode/add",
    component: lazy(() => import("../../views/pages/reasoncode/add")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/reasoncode/edit/:id",
    component: lazy(() => import("../../views/pages/reasoncode/edit")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/settings/ticketreasons",
    component: lazy(() => import("../../views/pages/ticketreasoncode/list")),
    exact: true,
    breadcrumb: "Ticket Reasons",
  },
  {
    path: "/ticketreasoncode/add",
    component: lazy(() => import("../../views/pages/ticketreasoncode/add")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/ticketreasoncode/list",
    component: lazy(() => import("../../views/pages/ticketreasoncode/list")),
  },
  {
    path: "/ticketreasoncode/edit/:id",
    component: lazy(() => import("../../views/pages/ticketreasoncode/edit")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/projects/list",
    component: lazy(() => import("../../views/pages/projects/list")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/projects/add",
    component: lazy(() => import("../../views/pages/projects/add")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/projects/edit/:id",
    component: lazy(() => import("../../views/pages/projects/edit")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/settings/readyanswers",
    component: lazy(() => import("../../views/pages/readyanswer/list")),
    exact: true,
    breadcrumb: "Ready Answers",
  },
  {
    path: "/readyanswer/add",
    component: lazy(() => import("../../views/pages/readyanswer/add")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/readyanswer/edit/:id",
    component: lazy(() => import("../../views/pages/readyanswer/edit")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/settings/users",
    component: lazy(() => import("../../views/pages/users/list")),
    exact: true,
    breadcrumb: "Users",
  },
  {
    path: "/users/edit/:id",
    component: lazy(() => import("../../views/pages/users/edit")),
    exact: true,
    breadcrumb: "Users",
  },
  {
    path: "/settings/users/add",
    component: lazy(() => import("../../views/pages/users/add")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/settings/smstemplates",
    component: lazy(() => import("../../views/pages/smstemplate/list")),
    exact: true,
    breadcrumb: "SMS Templates",
  },
  {
    path: "/settings/smstemplates/add",
    component: lazy(() => import("../../views/pages/smstemplate/add")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/smstemplate/edit/:id",
    component: lazy(() => import("../../views/pages/smstemplate/edit")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/role/list",
    component: lazy(() => import("../../views/pages/rolemanagement/list")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/role/add",
    component: lazy(() => import("../../views/pages/rolemanagement/add")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/smstemplate/add",
    component: lazy(() => import("../../views/pages/smstemplate/add")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/role/edit/:id",
    component: lazy(() => import("../../views/pages/rolemanagement/edit")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/settings/ticketcategories",
    component: lazy(() => import("../../views/pages/ticketcategory/list")),
    exact: true,
    breadcrumb: "Ticket Categories",
  },
  {
    path: "/ticketcategory/add",
    component: lazy(() => import("../../views/pages/ticketcategory/add")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/ticketcategory/edit/:id",
    component: lazy(() => import("../../views/pages/ticketcategory/edit")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/reopentickets",
    component: lazy(() => import("../../views/pages/tickets/reopenList")),
    exact: true,
    breadcrumb: "Reopen Tickets",
  },
  {
    path: "/resolvedtickets",
    component: lazy(() => import("../../views/pages/tickets/resolvedList")),
    exact: true,
    breadcrumb: "Resolved Tickets",
  },
  {
    path: "/opentickets",
    component: lazy(() => import("../../views/pages/tickets/openTicketList")),
    exact: true,
    breadcrumb: "Open Tickets",
  },
  {
    path: "/unresolvedtickets",
    component: lazy(() => import("../../views/pages/tickets/unresolvedList")),
    exact: true,
    breadcrumb: "Unresolved Tickets",
  },
  {
    path: "/tickets/add",
    component: lazy(() => import("../../views/pages/tickets/add")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/tickets/edit/:id",
    component: lazy(() => import("../../views/pages/tickets/edit")),
    exact: true,
    breadcrumb: "Email Templates",
  },

  {
    path: "/settings/tagmanagement",
    component: lazy(() => import("../../views/tagManagement/list")),
    exact: true,
    breadcrumb: "Tag management",
  },
  {
    path: "/tag-management/add",
    component: lazy(() => import("../../views/tagManagement/add")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/tag-management/edit/:id",
    component: lazy(() => import("../../views/tagManagement/edit")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/call/list",
    component: lazy(() => import("../../views/pages/callList/list")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/settings/importdata",
    component: lazy(() => import("../../views/pages/importData/list")),
    exact: true,
    breadcrumb: "Import Data",
  },
  {
    path: "/form/add",
    component: lazy(() => import("../../views/pages/form/add")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/form/design/:id",
    component: lazy(() => import("../../views/pages/form/design")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/form/list",
    component: lazy(() => import("../../views/pages/form/list")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/form/edit/:id",
    component: lazy(() => import("../../views/pages/form/edit")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/companies/add",
    component: lazy(() => import("../../views/companies/addCompanies")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/companies/",
    component: lazy(() => import("../../views/companies/listCompanies")),
    exact: true,
    breadcrumb: "Companies",
  },
  {
    path: "/companies/edit-company/:id",
    component: lazy(() => import("../../views/companies/editCompanies")),
    exact: true,
    breadcrumb: "Email Templates",
  },
  {
    path: "/settings/usergroups",
    component: lazy(() => import("../../views/pages/userGroups/list")),
    exact: true,
    breadcrumb: "User Groups",
  },
  {
    path: "/settings/usergroups/add",
    component: lazy(() => import("../../views/pages/userGroups/add")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/settings/usergroups/edit/:id",
    component: lazy(() => import("../../views/pages/userGroups/edit")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/contacts",
    component: lazy(() =>
      import("../../views/customerManagement/listCustomer")
    ),
    exact: true,
    breadcrumb: "Contacts",
  },
  {
    path: "/customers/edit-customer/:id",
    component: lazy(() =>
      import("../../views/customerManagement/editCustomer")
    ),
    exact: true,
    breadcrumb: "Contacts",
  },
  {
    path: "/contacts/add-contact",
    component: lazy(() => import("../../views/customerManagement/addCustomer")),
    exact: true,
    breadcrumb: "Contacts",
  },
  {
    path: "/wallboard",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/resolvedtickets",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/opentickets",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/survey",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/reports/conversations/livesupports",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/reports/conversations/whatsapp",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/reports/conversations/facebook",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/reports/conversations/instagram",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/reports/conversations/phone",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/reports/conversations/mail",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/reports/conversations/video",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/reports/ticketreports/userreports",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/reports/ticketreports/sourcereports",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/reports/ticketreports/statusreports",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/reports/cxreports",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/knowledgebase/articles",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/knowledgebase/categories",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/settings/plansandbillings",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/settings/security",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/settings/localization",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/settings/integrations",
    component: lazy(() => import("../../views/pages/404")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/settings/dash",
    component: lazy(() => import("../../views/dashboard/ecommerce")),
    exact: true,
    breadcrumb: "call list",
  },
  {
    path: "/settings/mail-management",
    component: lazy(() => import("../../views/pages/mailManagement/list")),
    exact: true,
    breadcrumb: "mail management",
  },
  {
    path: "/settings/mail-management/add",
    component: lazy(() => import("../../views/pages/mailManagement/add")),
    exact: true,
    breadcrumb: "mail management",
  },
  {
    path: "/pages/profile",
    component: lazy(() => import("../../views/pages/account-settings")),
    exact: true,
  },
  {
    path: "/apps/email",
    exact: true,
    appLayout: true,
    className: "email-application",
    component: lazy(() => import("../../views/apps/email")),
  },
  {
    path: "/pages/account-settings",
    component: lazy(() => import("../../views/pages/account-settings")),
    exact: true,
    appLayout: true,
  },
  {
    path: "/pages/faq",
    component: lazy(() => import("../../views/pages/faq")),
  },

  {
    path: "/media",
    component: lazy(() =>
      import("../../views/ui-elements/cards/advance/index")
    ),
    breadcrumb: "Channels",
  },
  {
    path: "/facebook/edit/:id",
    component: lazy(() => import("../../views/social/facebook/edit")),
    exact: true,
    breadcrumb: "call list",
  },
];

export { DefaultRoute, TemplateTitle, Routes };
