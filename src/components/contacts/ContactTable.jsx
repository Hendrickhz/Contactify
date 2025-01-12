import React, { useEffect, useState } from "react";
import {
  useDeleteContactMutation,
  useGetAllContactsQuery,
} from "../../redux/api/contactApi";
import { BsFillPersonPlusFill, BsThreeDotsVertical } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Table } from "@mantine/core";
import { FaEye, FaTrash } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import "./contactTable.css";
import Swal from "sweetalert2";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import {
  addContacts,
  removeFavorite,
  setFavorite,
  setSearchTerm,
  setVisit,
} from "../../redux/feature/contactSlice";
import { Input } from "@material-tailwind/react";
import { MdOutlineFavorite } from "react-icons/md";
import Cookies from "js-cookie";
import { notifications } from "@mantine/notifications";
import Pagination_bar from "./Pagination_bar";

const ContactTable = () => {
  const token = Cookies.get("token");

  //pagination code start here//
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  //checkParam for checking 'page' search param in url, there is or not?
  const checkParam = queryParams.has("page"); //

  //getParam for getting query value from url to refetch query again//
  const page = checkParam ? queryParams.get("page") : 1; //
  //pagination end

  const { data, isLoading, isError, isSuccess, refetch } =
    useGetAllContactsQuery({ token, page });
  const [deleteContact] = useDeleteContactMutation();
  const nav = useNavigate();

  useEffect(() => {
    refetch();
  }, [page, refetch]);
  // console.log(data);

  const deleteHandler = (contact, id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const data = await deleteContact({ id, token });
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        notifications.show({
          title: "Contact Notification",
          message: `${contact?.name} is successfully deleted from the Contact List !`,
        });
      }
    });
  };
  const contactsData = useSelector((state) => state.contactSlice.contacts);
  const favorite = useSelector((state) => state.contactSlice.favorite);
  const searchTerm = useSelector((state) => state.contactSlice.searchTerm);

  // console.log(favorite);
  console.log(contactsData);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(addContacts(data?.contacts.data));
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isSuccess) {
    if (contactsData?.length > 0) {
      const displayContactsData =
        searchTerm.trim() === ""
          ? contactsData
          : contactsData.filter((contact) =>
              contact.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

      const rows =
        displayContactsData.length === 0 ? (
          <tr>
            <td className=" text-center" colSpan={4}>
              No contacts found{" "}
            </td>
          </tr>
        ) : (
          displayContactsData.map((contact) => (
            <tr key={contact.id} className=" parent">
              <td>
                <p>{contact.name}</p>
                <span className=" text-gray-600">{contact.email}</span>
              </td>
              <td className="hide-on-mobile">{contact.phone}</td>
              <td className="hide-on-mobile">{contact.address}</td>
              <td className=" ">
                <div className="child flex items-center gap-3">
                <MdOutlineFavorite
                    onClick={() => {
                      if (contact.isFavourite) {
                        dispatch(removeFavorite(contact));
                      } else {
                        dispatch(setFavorite(contact));
                      }
                    }}
                    size={"1.5rem"}
                    className={`cursor-pointer ${
                      contact?.isFavourite ? "text-orange-500" : "text-gray-500"
                    }`}
                  />
                  <Menu width={200} shadow="md">
                    <Menu.Target>
                      <button className=" p-2 border bg-white shadow-sm">
                        <BsThreeDotsVertical />
                      </button>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        icon={<FaEye />}
                        component="a"
                        onClick={() => {
                          dispatch(setVisit(contact));
                          nav(`/contacts/${contact.id}`);
                        }}
                      >
                        View
                      </Menu.Item>

                      <Menu.Item
                        icon={<MdModeEditOutline />}
                        component="a"
                        onClick={() => nav(`/contacts/edit/${contact.id}`)}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        icon={<FaTrash />}
                        component="a"
                        onClick={() => deleteHandler(contact, contact.id)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </div>
              </td>
            </tr>
          ))
        );
      return (
        <div>
          <div className="my-2">
            <div className="relative flex w-full gap-2 md:w-max ">
              <Input
                type="search"
                label="Search here..."
                className="pr-20"
                icon={<BiSearchAlt />}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                containerProps={{
                  className: "min-w-[288px]",
                }}
              />
            </div>
          </div>
          <Table highlightOnHover className="select-none mb-5">
          <colgroup><col style={{ width: "30%" }} /> {/* Always show the name column */}<col style={{ width: "30%" }} className="hide-on-mobile" /> {/* Hide on mobile */}<col style={{ width: "30%" }} className="hide-on-mobile" /> {/* Hide on mobile */}<col style={{ width: "10%" }} /> {/* Hide on mobile */}</colgroup>
            <thead>
              <tr>
                <th>Name</th>
                <th className="hide-on-mobile">Phone Number</th> {/* Hide on mobile */}
                <th className="hide-on-mobile">Address</th> {/* Hide on mobile */}
                <th className=""></th> {/* Hide on mobile */}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
          <Pagination_bar 
            total_pages={data?.contacts?.last_page}
            checkParam={checkParam}
          />
        </div>
      );
    } else if (contactsData?.length == 0) {
      return (
        <div className=" w-full min-h-[80vh] flex justify-center items-center">
          <div className="">
            <img
              className="w-[150px] mx-auto"
              src="public\empty-box.png"
              alt="empty-contact=img"
            />
            <div className=" mt-5 flex items-center flex-col gap-3">
              <p className=" text-color">
                Looks like you haven't added any contacts yet.
              </p>
              <button
                onClick={() => nav("/contacts/create")}
                className="  btn-color px-4 py-2 flex items-center gap-2 rounded tracking-wider shadow-sm hover:bg-orange-700 duration-300"
              >
                {" "}
                <BsFillPersonPlusFill /> Create Contact
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
};

export default ContactTable;
