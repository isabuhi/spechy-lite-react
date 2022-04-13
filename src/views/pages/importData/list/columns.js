// // ** React Imports
// import { Link, useRouteMatch } from "react-router-dom";

// // ** Store & Actions
// import { store } from "@store/storeConfig/store";

// // ** Third Party Components
// import {
//   UncontrolledDropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
// } from "reactstrap";
// import {
//   MoreVertical,
//   Trash2,
//   Archive,
//   FileText,
//   Trash,
//   Edit,
// } from "react-feather";

// export const Columns = [
//   {
//     name: "Tag Name",
//     selector: "name",
//     sortable: true,
//     minWidth: "225px",
//     cell: (row) => row.name,
//   },
//   {
//     name: "Source",
//     selector: "templateTopic",
//     sortable: true,
//     minWidth: "250px",
//     cell: (row) => row.source.name,
//   },

//   {
//     name: "Actions",
//     minWidth: "100px",
//     cell: (row) => (
//       <UncontrolledDropdown>
//         <DropdownToggle tag="div" className="btn btn-sm">
//           <MoreVertical size={14} className="cursor-pointer" />
//         </DropdownToggle>
//         <DropdownMenu right>
//           <DropdownItem
//             tag={Link}
//             to={`/tag-management/edit/${row.tag_id}`}
//             className="w-100"
//           >
//             <Archive size={14} className="mr-50" />
//             <span className="align-middle">Edit</span>
//           </DropdownItem>
//           <DropdownItem
//             className="w-100"
//             onClick={() => {
//               store.dispatch({
//                 type: "CLOSE_MODAL",
//                 data: true,
//                 id: row.tag_id,
//               });
//             }}
//           >
//             <Trash2 size={14} className="mr-50" />
//             <span className="align-middle">Delete</span>
//           </DropdownItem>
//         </DropdownMenu>
//       </UncontrolledDropdown>
//     ),
//   },
// ];
