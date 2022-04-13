import React, { Fragment, useEffect, useState } from "react";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import Avatar from "@components/avatar";
import * as Icons from "react-feather";

const DualList = (props) => {
  const { projectList, projectIds } = props;

  const projectListProfile = props.projectList.map((pro) => {
    return pro.profile;
  });
  console.log(projectListProfile);

  const list = [];
  if (projectListProfile.length != 0) {
    for (let i = 0; i < projectListProfile.length; i++) {
      list.push({
        value: projectListProfile[i].user_id,
        label: projectListProfile[i].name_surname,
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
    projectIds(selected);
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
