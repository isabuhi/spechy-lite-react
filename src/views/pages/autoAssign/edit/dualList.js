import React, { Fragment, useEffect, useState } from "react";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import Avatar from "@components/avatar";
import * as Icons from "react-feather";

const DualList = (props) => {
  const { userList, usersIds } = props;
  //   console.log("hi", props.projectList);
  const list = [];
  if (userList.length != 0) {
    for (let i = 0; i < userList.length; i++) {
      list.push({
        value: userList[i].val,
        label: userList[i].label,
      });
    }
  }
  const [formState, setFormState] = useState({
    selected: [],
  });
  const onChange = (selected) => {
    setFormState({
      ...formState,
      selected: selected,
    });
    usersIds(selected);
  };
  return (
    <DualListBox
      options={list}
      selected={formState.selected}
      onChange={onChange}
      icons={{
        moveLeft: (
          <Avatar
            size="sm"
            className="cursor-pointer"
            icon={<Icons.ArrowLeft size={12} />}
          />
        ),
        moveAllLeft: [
          <Avatar
            size="sm"
            className="cursor-pointer"
            icon={<Icons.ChevronsLeft size={12} />}
          />,
        ],
        moveRight: (
          <Avatar
            size="sm"
            className="cursor-pointer"
            icon={<Icons.ChevronsRight size={12} />}
          />
        ),
        moveAllRight: [
          <Avatar
            size="sm"
            className="cursor-pointer"
            icon={<Icons.ArrowRight size={12} />}
          />,
        ],
      }}
    />
  );
};
export default DualList;
