import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useMutation, useQuery } from "react-query";
import { Field, Formik } from "formik";
import { BsPencil } from "react-icons/bs";
import * as Yup from "yup";
import userService from "@services/user.service";
import Button_submit from "@ui-library/Button";
import { Spinner, Row, Col } from "react-bootstrap";
import { useAuthUser } from "@contexts/AuthContext";
import { FaExternalLinkAlt } from "react-icons/fa";
import Tooltip from "@ui-library/Tooltip";
import Select from "react-select";
import { FaCircle } from "react-icons/fa";
import Bus from "@utils/Bus";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import dynamic from "next/dynamic";
const ReactFileReader = dynamic(() => import("react-file-reader"), {
  ssr: false,
});

function ProfileDetailsForm({ list, refetchProfile }) {
  const imgRef = useRef();
  const { auth, refetchAuthUser } = useAuthUser();
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState();
  const [croppedImage, setCroppedImage] = useState();
  const [crop, setCrop] = useState({
    unit: "px",
    x: 25,
    y: 25,
    width: 100,
    height: 100,
  });

  const mutation = useMutation((id, data) => userService.update(id, data), {
    onSuccess: () => {
      refetchAuthUser();
      refetchProfile();
    },
    onError: (error) => {
      Bus.emit("error", { operation: "open", error: error.response });
    },
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const [fileValid, setFileValid] = useState(0);
  // fileValid state value 1 is for file size and state value 2 is for unsupported format
  const [selectOptions, setSelectOptions] = useState([
    { value: "", label: "Select" },
  ]);

  useQuery(["departments"], () => userService.getdepartment(), {
    enabled: !!list,
    onSuccess: (res) => {
      if (res?.data.length > 0) {
        const mainOption = [];
        res?.data.map((item) => {
          let obj = {
            value: item.id,
            label: (
              <>
                <FaCircle color={item.colorCode} />
                <span style={{ paddingLeft: "5px" }}>
                  {item.groupName}: {item.departmentName}
                </span>
              </>
            ),
          };
          setSelectOptions((old) => [...old, obj]);
          mainOption.push(obj);
        });
        let setOption = mainOption
          ? mainOption.find((option) => option.value === list?.department)
          : { value: "", label: "Select" };
        setSelectedOption(setOption);
      }
    },
    onError: (error) => {
      Bus.emit("error", { operation: "open", error: error.response });
    },
  });

  const initialValues = {
    profile_pic: list?.avtarUrl || "",
    firstname: list?.firstName || "",
    lastname: list?.lastName || "",
    preferredname: list?.preferredName || "",
    title_role: list?.title || "",
    department: selectedOption || null,
    linkedin_url: list?.linkedinUrl || "",
    image: null,
  };

  const handleCompletedCrop = (c, formik) => {
    onSubmitCrop(c, formik);
  };
  const onSubmitCrop = (completedCrop, formik) => {
    if (completedCrop) {
      // create a canvas element to draw the cropped image
      const canvas = document.createElement("canvas");

      // get the image element
      const image = imgRef.current;

      // draw the image on the canvas
      if (image) {
        const crop = completedCrop;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext("2d");
        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        if (ctx) {
          ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          ctx.imageSmoothingQuality = "high";

          ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
          );
        }

        const base64Image = canvas.toDataURL("image/jpeg"); // can be changed to jpeg/png etc
        if (base64Image !== "data:,") {
          setCroppedImage(base64Image);
        }

        if (base64Image) {
          const fileType = base64Image.split(";")[0].split(":")[1];

          const buffer = Buffer.from(
            base64Image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          );
          const file = new File([buffer], "profile-image.jpg", {
            type: fileType,
          });
          if (base64Image !== "data:,") {
            formik.setFieldValue("profile_pic", file);
          }
        }
      }
    }
  };
  const handleCancel = (formik) => {
    formik.setFieldValue("profile_pic", list?.avtarUrl);
    setImage("");
    setCroppedImage("");
    setIsEdit(false);
  };
  return (
    <>
    <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Yup.object({
          firstname: Yup.string()
            .min(2, "Too short")
            .max(50, "Must be 50 characters or less")
            .trim()
            .required("Required"),
          lastname: Yup.string()
            .min(2, "Too Short")
            .max(50, "Must be 50 characters or less")
            .trim()
            .required("Required"),

          preferredname: Yup.string()
            .min(2, "Too short")
            .max(50, "Must be 50 characters or less")
            .trim(),
          title_role: Yup.string()
            .min(2, "Too short")
            .max(50, "Must be 50 characters or less")
            .trim(),
          department: Yup.object().nullable().required("Required"),
          linkedin_url: Yup.string()
            .min(2, "Too short")
            .max(100, "Invalid URL")
            .trim(),
        })}
        onSubmit={(values) => {
          mutation
            .mutateAsync({
              id: list.id,
              data: {
                personalDetails: {
                  firstName: values.firstname,
                  lastName: values.lastname,
                  preferredName: values.preferredname,
                  title: values.title_role,
                  department: values.department.value,
                  linkedinUrl: values.linkedin_url,
                  deletedAvtarUrl: "",
                },
                userImage: values.profile_pic,
              },
            })
            .then(() => {
              setCroppedImage("");
              setImage("");
              setIsEdit(false);
              setSelectedOption(values.department);
            });
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            
              <MyProfile className="mb-5">My Profile</MyProfile>
              <Row className=" align-item-center">
                <Col lg={2}>
                  <Image_item>
                    {formik.values.profile_pic !== "" ? (
                      <ProfileImage
                        id="profile_pic"
                        name="profile_pic"
                        src={
                          isEdit
                            ? croppedImage || image
                            : formik.values.profile_pic ||
                              image ||
                              "/images/default-user-avatar.jpg"
                        }
                        alt="profile_pic"
                        width={140}
                        height={140}
                      />
                    ) : (
                      <LetterSection>
                        <Letter>{list && list?.firstName.charAt(0)}</Letter>
                      </LetterSection>
                    )}
                    <Pencildiv>
                      <ReactFileReader
                        base64={true}
                        fileTypes={[".jpg", ".jpeg", ".png"]}
                        handleFiles={(file) => {
                          if (
                            file.fileList[0].type == "image/jpeg" ||
                            file.fileList[0].type == "image/jpg" ||
                            file.fileList[0].type == "image/png"
                          ) {
                            let base64String = file.base64;
                            let stringLength =
                              base64String.length -
                              "data:image/png;base64,".length;
                            let sizeInBytes =
                              4 *
                              Math.ceil(stringLength / 3) *
                              0.5624896334383812;
                            let sizeInKb = sizeInBytes / 1024;
                            if (sizeInKb <= 1000) {
                              setFileValid(0);
                              setCroppedImage("");
                              setCrop({
                                unit: "px",
                                x: 25,
                                y: 25,
                                width: 100,
                                height: 100,
                              });
                              setImage(base64String);
                              setIsEdit(true);
                              formik.setFieldValue(
                                "profile_pic",
                                file.fileList[0]
                              );
                            } else {
                              setFileValid(1);
                              handleCancel(formik);
                            }
                          } else {
                            setFileValid(2);
                            handleCancel(formik);
                          }
                        }}
                      >
                        <BsPencil color="#ffffff" size={25} />
                      </ReactFileReader>
                    </Pencildiv>
                  </Image_item>

                  {(fileValid == 1 || fileValid == 2) && (
                    <p
                      className="mt-2 text-center"
                      style={{
                        maxWidth: "200px",
                        margin: "0 auto",
                        color: "red",
                      }}
                    >
                      {fileValid == 1
                        ? "Warning: Image size should be less than 1MB"
                        : "Warning: File format unsupported"}
                    </p>
                  )}
                </Col>
                <Col lg={10}>
                  {image && isEdit && (
                    <ImageCroppedSection>
                      <div>
                        <ReactCrop
                          aspect={1}
                          circularCrop={true}
                          crop={crop}
                          onChange={(c) => setCrop(c)}
                          onComplete={(c) => handleCompletedCrop(c, formik)}
                        >
                          <ProfileImageCrop
                            ref={imgRef}
                            src={image || "/images/default-user-avatar.jpg"}
                          />
                        </ReactCrop>
                        <div>
                          <CancelUploading onClick={() => handleCancel(formik)}>
                            Cancel Upload
                          </CancelUploading>
                        </div>
                      </div>
                    </ImageCroppedSection>
                  )}
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <ProfileGrid className="col-lg-12">
                    <div className="d-flex flex-column align-self-stretch mt-3 mt-lg-0 mx-2">
                      <Styledlabel htmlFor="firstname">First Name</Styledlabel>
                      <Field
                        type="text"
                        id="firstname"
                        name="firstname"
                        as={StyledInput}
                      />
                      {formik.touched.firstname && formik.errors.firstname ? (
                        <div>{formik.errors.firstname}</div>
                      ) : null}
                    </div>
                    <div className="d-flex flex-column align-self-stretch mt-3 mt-lg-0 mx-2">
                      <Styledlabel htmlFor="lastname">Last Name</Styledlabel>
                      <Field
                        type="text"
                        id="lastname"
                        name="lastname"
                        as={StyledInput}
                      />
                      {formik.touched.lastname && formik.errors.lastname ? (
                        <div>{formik.errors.lastname}</div>
                      ) : null}
                    </div>
                    <div className="d-flex flex-column align-self-stretch mt-3 mt-lg-0 mx-2">
                      <Styledlabel htmlFor="preferredname">
                        Preferred Name
                      </Styledlabel>
                      <Field
                        type="text"
                        id="preferredname"
                        name="preferredname"
                        as={StyledInput}
                      />
                      {formik.touched.preferredname &&
                      formik.errors.preferredname ? (
                        <div>{formik.errors.preferredname}</div>
                      ) : null}
                    </div>
                    <div className="d-flex flex-column align-self-stretch mt-3 mt-lg-0 mx-2">
                      <Styledlabel htmlFor="title_role">Title/Role</Styledlabel>
                      <Field
                        type="text"
                        id="title_role"
                        name="title_role"
                        as={StyledInput}
                      />
                      {formik.touched.title_role && formik.errors.title_role ? (
                        <div>{formik.errors.title_role}</div>
                      ) : null}
                    </div>
                    <div className="d-flex flex-column align-self-stretch mt-3 mt-lg-0 mx-2">
                      <Styledlabel htmlFor="department">Department</Styledlabel>
                      <Select
                        defaultValue={selectedOption}
                        value={formik.values.department}
                        options={selectOptions}
                        isSearchable={false}
                        inputId="department"
                        className="inputSelect"
                        classNamePrefix="inputSelect"
                        onChange={(selectedOption) => {
                          if (selectedOption.value == "") {
                            formik.setFieldValue("department", null);
                          } else {
                            formik.setFieldValue("department", selectedOption);
                          }
                        }}
                      />
                      {formik.touched.department && formik.errors.department ? (
                        <div>{formik.errors.department}</div>
                      ) : null}
                    </div>
                    <div className="d-flex flex-column align-self-stretch mt-3 mt-lg-0 mx-2">
                      <Styledlabel htmlFor="linkedin_url" className="d-flex">
                        LinkedIn Url
                        {formik.values.linkedin_url && (
                          <Tooltip text="Open Link">
                            <LinkedInUrl
                              href={formik.values.linkedin_url}
                              target="_blank"
                            >
                              <FaExternalLinkAlt />
                            </LinkedInUrl>
                          </Tooltip>
                        )}
                      </Styledlabel>
                      <Field
                        type="text"
                        id="linkedin_url"
                        name="linkedin_url"
                        as={StyledInput}
                      />
                      {formik.touched.linkedin_url &&
                      formik.errors.linkedin_url ? (
                        <div>{formik.errors.linkedin_url}</div>
                      ) : null}
                    </div>
                  </ProfileGrid>
                </Col>
              </Row>
              <Submit>
                <SaveButton
                  type="submit"
                  disabled={!formik.dirty || mutation.isLoading}
                >
                  {mutation.isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-1"
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </SaveButton>
              </Submit>
          </form>
        )}
      </Formik>
      
    </>
  );
}

export default ProfileDetailsForm;

const Container = styled.div`
  width: 80%;
  margin: auto;
  .inputSelect {
    .inputSelect__control {
      border: 1px solid #003647;
      min-height: 40px;
      outline: none;
      box-shadow: none;
    }
    .inputSelect__menu {
      margin: 0;
    }
  }
`;

const LinkedInUrl = styled.a`
  &&& {
    margin-left: 0.6rem;
    padding-bottom: 1.85px;
    font-size: 15px;
    color: #81c2c0;
  }
`;

const MyProfile = styled.div`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 600;
  font-size: 50px;
  line-height: 25px;

  color: #81c2c0;
`;

const ProfileGrid = styled(Col)`
  margin-top: 20px;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-template-rows: 100px 80px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 992px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Image_item = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  margin: auto;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  height: 140px;
  width: 140px;
`;
const ProfileImageCrop = styled.img`
  height: 150px;
  width: 150px;
`;
const LetterSection = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  background-color: #94cbc9;
`;
const Letter = styled.p`
  color: #003647;
  position: absolute;
  font-size: 100px;
  font-weight: bold;
  top: 45%;
  left: 22%;
`;

const Pencildiv = styled.div`
  cursor: pointer;
  transition: 0.5s ease;
  z-index: 2;
  background: #81c2c0;
  border: 1px solid #ffffff;

  justify-content: center;
  align-items: center;
  display: flex;
  width: 40px;
  height: 40px;

  position: absolute;
  bottom: 0;
  right: 0;

  border-radius: 50%;
`;

const Styledlabel = styled.label`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.02em;
  color: #003647;
`;

const StyledInput = styled.input`
  height: 40px;
  padding: 0 0.45rem;
  // background-color: transparent;
  // border: 0px solid;
  outline: none;

  background: #ffffff;
  border: 1px solid #003647;
  box-sizing: border-box;
  border-radius: 5px;

  @media (max-width: 992px) {
    width: auto;
  }
`;

const SaveButton = styled(Button_submit)`
  &&& {
    align-self: end;
    margin-bottom: 25px;
    margin-top: 25px;
    float: right;
    &:active {
      /* background: #003647; */
      /* transition: 0.5s ease; */
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      margin-top: 20px;
      align-self: center;
    }
  }
`;
const Submit = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const ImageCroppedSection = styled.div`
  display: flex;
`;
const CancelUploading = styled.span`
  cursor: pointer;
  color: red;
  margin-left: 15%;
`;
