// import { Fragment, useState } from "react";
// import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
// import {
//   Phone,
//   Delete,
//   Video,
//   Users,
//   Calendar,
//   PhoneCall,
//   PhoneOff,
//   MicOff,
//   Voicemail,
//   PhoneForwarded,
//   Lock,
//   Speaker,
//   Airplay,
// } from "react-feather";
// import Iframe from "react-iframe";

// const PillBasic = () => {
//   const [active, setActive] = useState("1");
//   const roomName = "spechy";
//   const userFullName = "Joseph Strawberry";
//   const toggle = (tab) => {
//     setActive(tab);
//   };
//   const iframe = () => {
//     return (
//       <iframe
//         src="https://www.example.com/show?data..."
//         width="540"
//         height="450"
//       ></iframe>
//     );
//   };
//   return (
//     <Fragment>
//       <TabContent className="py-50" activeTab={active}>
//         <TabPane tabId="1">
//           <div align="center" id="dial" className="form-signin-content">
//             <div className="row">
//               <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                 <div id="webphone_body">
//                   <div id="webphone_display">
//                     <h4>
//                       <span id="whoami"></span>
//                     </h4>
//                     <div id="dialadv1"></div>
//                     <div className="numberOne">
//                       <input
//                         id="ext"
//                         type="number"
//                         className="form-control input-lg"
//                         placeholder="number to dial"
//                       ></input>
//                       <button
//                         className="btn btn-sm btn-primary btn-danger removetype"
//                         data-inline="true"
//                         id="delcallbtn"
//                       >
//                         <Delete size={14} className="cursor-pointer" />
//                       </button>
//                       <br />
//                       <h2 className="numberDail">
//                         <span id="calling">...</span>
//                       </h2>
//                       <input
//                         id="calling_input"
//                         className="form-control input-sm numberTwo"
//                         type="hidden"
//                         placeholder="number to dial"
//                       ></input>
//                     </div>
//                   </div>
//                   <div id="isIncomingcall">
//                     <div className="row">
//                       <div className="col-3 col-sm-4 col-md-3 col-lg-3 col-xl-3">
//                         &nbsp;
//                       </div>
//                       <div
//                         className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"
//                         id="webphone_keypad"
//                       >
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                         >
//                           1
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                         >
//                           2
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                         >
//                           3
//                         </button>
//                         <br />
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                         >
//                           4
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                         >
//                           5
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                         >
//                           6
//                         </button>
//                         <br />
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                         >
//                           7
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                         >
//                           8
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                         >
//                           9
//                         </button>
//                         <br />
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                         >
//                           *
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                         >
//                           0
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                         >
//                           #
//                         </button>
//                         <br />
//                         <button
//                           className="btn btn-sm btn-primary btn-success callbtn"
//                           id="anscallbtn"
//                           data-inline="true"
//                         >
//                           <PhoneCall size={14} className="cursor-pointer" />
//                         </button>
//                         <button
//                           className="btn btn-sm btn-primary btn-danger callbtn"
//                           id="rejcallbtn"
//                           data-inline="true"
//                         >
//                           <PhoneOff size={14} className="cursor-pointer" />
//                         </button>
//                         <br />
//                         <br />
//                       </div>
//                       <div className="col-3 col-sm-4 col-md-3 col-lg-3 col-xl-3">
//                         &nbsp;
//                       </div>
//                     </div>
//                   </div>
//                   <div id="isNotIncomingcall">
//                     <div className="row">
//                       <div className="col-3 col-sm-4 col-md-3 col-lg-3 col-xl-3">
//                         &nbsp;
//                       </div>
//                       <div
//                         className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"
//                         id="webphone_keypad"
//                       >
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="ext1btn"
//                         >
//                           1
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="ext2btn"
//                         >
//                           2
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="ext3btn"
//                         >
//                           3
//                         </button>
//                         <br />
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="ext4btn"
//                         >
//                           4
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="ext5btn"
//                         >
//                           5
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="ext6btn"
//                         >
//                           6
//                         </button>
//                         <br />
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="ext7btn"
//                         >
//                           7
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="ext8btn"
//                         >
//                           8
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="ext9btn"
//                         >
//                           9
//                         </button>
//                         <br />
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="extstarbtn"
//                         >
//                           *
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="ext0btn"
//                         >
//                           0
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="extpoundbtn"
//                         >
//                           #
//                         </button>
//                         <br />
//                         <button
//                           className="btn btn-sm btn-primary btn-success callbtn"
//                           data-inline="true"
//                           id="callbtn"
//                         >
//                           <PhoneCall size={14} className="cursor-pointer" />
//                         </button>
//                         <br />
//                         <br />
//                         <br />
//                         <button
//                           className="btn btn-lg btn-primary btn-warning inComeOne"
//                           data-inline="true"
//                           id="redialbtn"
//                         >
//                           <PhoneForwarded
//                             size={14}
//                             className="cursor-pointer"
//                           />
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-success inComeOne"
//                           data-inline="true"
//                           id="dndbtn"
//                         >
//                           <Lock size={14} className="cursor-pointer" />
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-info inComeOne"
//                           data-inline="true"
//                           id="checkvmailbtn"
//                         >
//                           <Voicemail size={14} className="cursor-pointer" />
//                         </button>
//                         <br />
//                       </div>
//                       <div className="col-3 col-sm-4 col-md-3 col-lg-3 col-xl-3">
//                         &nbsp;
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div align="center" id="incall" className="form-signin-content">
//             <div className="row">
//               <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                 <div id="webphone_body">
//                   <div id="webphone_display">
//                     <h2 className="">
//                       Speaking with:
//                       <br />
//                       <br />
//                       <span id="speakingwith">...</span>
//                     </h2>
//                   </div>
//                   <div id="dialpad">
//                     <div className="row">
//                       <div className="col-3 col-sm-4 col-md-3 col-lg-3 col-xl-3">
//                         &nbsp;
//                       </div>
//                       <div
//                         className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"
//                         id="webphone_keypad"
//                       >
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="dtmf1btn"
//                           onclick="audio1.play ( )"
//                         >
//                           1
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="dtmf2btn"
//                           onclick="audio2.play ( )"
//                         >
//                           2
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="dtmf3btn"
//                           onclick="audio3.play ( )"
//                         >
//                           3
//                         </button>
//                         <br />
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="dtmf4btn"
//                           onclick="audio4.play ( )"
//                         >
//                           4
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="dtmf5btn"
//                           onclick="audio5.play ( )"
//                         >
//                           5
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="dtmf6btn"
//                           onclick="audio6.play ( )"
//                         >
//                           6
//                         </button>
//                         <br />
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="dtmf7btn"
//                           onclick="audio7.play ( )"
//                         >
//                           7
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="dtmf8btn"
//                           onclick="audio8.play ( )"
//                         >
//                           8
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="dtmf9btn"
//                           onclick="audio9.play ( )"
//                         >
//                           9
//                         </button>
//                         <br />
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="dtmfstarbtn"
//                           onclick="audio_star.play ( )"
//                         >
//                           .*
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="dtmf0btn"
//                           onclick="audio0.play ( )"
//                         >
//                           0
//                         </button>
//                         <button
//                           className="btn btn-lg btn-primary btn-default inComeOne"
//                           data-inline="true"
//                           id="dtmfpoundbtn"
//                           onclick="audio_hash.play ( )"
//                         >
//                           #
//                         </button>
//                         <br />
//                         <button
//                           className="btn btn-sm btn-primary btn-danger callbtn"
//                           data-inline="true"
//                           id="hangupbtn"
//                         >
//                           <PhoneOff size={14} className="cursor-pointer" />
//                         </button>
//                         <br />
//                         <br />
//                         <br />
//                       </div>
//                       <div className="col-3 col-sm-4 col-md-3 col-lg-3 col-xl-3">
//                         &nbsp;
//                       </div>
//                     </div>
//                     <div
//                       align="center"
//                       id="video1"
//                       class="embed-responsive embed-responsive-16by9"
//                     >
//                       <video
//                         id="audio"
//                         width="1"
//                         autoplay="autoplay"
//                         playsinline
//                         class="embed-responsive-item"
//                       >
//                         {" "}
//                       </video>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </TabPane>
//         <TabPane tabId="2">
//           <div style={{ padding: "10px", marginTop: "-20px" }}>
//             <Iframe
//               url="https://meet.jit.si/spechy"
//               width="100%"
//               height="560px"
//               id="myId"
//               className="iframe"
//               display="initial"
//               position="relative"
//             />
//           </div>
//         </TabPane>
//         <TabPane tabId="3">
//           <p>Phone Book</p>
//         </TabPane>
//         <TabPane tabId="4">
//           <p>TODO List</p>
//         </TabPane>
//       </TabContent>
//       <hr style={{ position: "absolute", bottom: "40px", width: "100%" }} />
//       <Nav
//         pills
//         style={{ position: "absolute", bottom: "-4px", width: "100%" }}
//       >
//         <hr />
//         <NavItem style={{ width: "25%" }}>
//           <NavLink
//             active={active === "1"}
//             onClick={() => {
//               toggle("1");
//             }}
//           >
//             <Phone size={14} className="cursor-pointer" />
//           </NavLink>
//         </NavItem>
//         <NavItem style={{ width: "25%" }}>
//           <NavLink
//             active={active === "2"}
//             onClick={() => {
//               toggle("2");
//             }}
//           >
//             <Video size={14} className="cursor-pointer" />
//           </NavLink>
//         </NavItem>
//         <NavItem style={{ width: "25%" }}>
//           <NavLink
//             active={active === "3"}
//             onClick={() => {
//               toggle("3");
//             }}
//           >
//             <Users size={14} className="cursor-pointer" />
//           </NavLink>
//         </NavItem>
//         <NavItem style={{ width: "25%" }}>
//           <NavLink
//             active={active === "4"}
//             onClick={() => {
//               toggle("4");
//             }}
//           >
//             <Calendar size={14} className="cursor-pointer" />
//           </NavLink>
//         </NavItem>
//       </Nav>
//     </Fragment>
//   );
// };
// export default PillBasic;
