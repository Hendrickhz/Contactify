import { Badge } from "@mantine/core";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsFillPersonFill, BsTrash } from "react-icons/bs";
import { MdRecentActors, MdOutlineFavorite,MdOutlineAutoFixHigh } from "react-icons/md";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <>
      <div className=" w-full h-[80vh] lg:h-[85vh] flex flex-col py-5 gap-5 lg:gap-10">
        <div className=" w-full px-0 lg:px-2 flex">
          <div className=" flex items-center gap-5 shadow-xl bg-orange-100 text-xl py-2 px-3 justify-center rounded-full">
            <AiOutlinePlus size={"2rem"} />
            <button className="">Create contact</button>
          </div>
        </div>
        <div className=" w-full  lg:px-0">
          <NavLink
            to={"/"}
            className={
              "flex items-center justify-between rounded-full text-md py-2 lg:rounded-none lg:rounded-e-full px-5 menu_hover"
            }
          >
            <div className="flex gap-5 items-center">
              <BsFillPersonFill />
              <button>Contacts</button>
            </div>
            <Badge color="yellow">20</Badge>
          </NavLink>
          <NavLink
            to={"/recently_search"}
            className="flex items-center justify-between rounded-full text-md py-2 lg:rounded-none lg:rounded-e-full px-5 menu_hover"
          >
            <div className="flex gap-5 items-center">
              <MdRecentActors />
              <button>Recently search</button>
            </div>
          </NavLink>
          <NavLink
            to={"/favourite"}
            className="flex items-center justify-between rounded-full text-md py-2 lg:rounded-none lg:rounded-e-full px-5 menu_hover"
          >
            <div className="flex gap-5 items-center">
              <MdOutlineFavorite />
              <button>Favourite contacts</button>
            </div>
          </NavLink>
        </div>
        <div className=" w-full">
          <h1 className=" text-xl px-5 py-2 font-semibold">Fix and manage</h1>
          <NavLink
            to={"/Merge_fix"}
            className="flex items-center justify-between rounded-full text-md py-2 lg:rounded-none lg:rounded-e-full px-5 menu_hover"
          >
            <div className="flex gap-5 items-center">
              <MdOutlineAutoFixHigh />
              <button>Merge and fix</button>
            </div>
          </NavLink>
          <NavLink
            to={"/trash"}
            className="flex items-center justify-between rounded-full text-md py-2 lg:rounded-none lg:rounded-e-full px-5 menu_hover"
          >
            <div className="flex gap-5 items-center">
              <BsTrash />
              <button>Bin</button>
            </div>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
