import axios from "axios";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoaderStatus } from "../../LoaderReducer/LoaderSlice";
import { searchListingData } from "../../SearchListingReducer/SearchListingSlice";
import debounce from "debounce";

type SearchInput = {
  searchString: String;
};
export const SearchListingBar = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [showCross, setShowCross] = useState(false);
  const dispatch = useDispatch();

  const { register, handleSubmit, setValue } = useForm<SearchInput>();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<SearchInput> = (data) => {
    // console.log("data", data)
    dispatch(LoaderStatus(true));
    var body = {
      searchString: data.searchString,
    };

    // console.log(data)
    axios({
      method: "post",

      url: "/api/search",

      data: body,
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }).then((res) => {
      //  console.log("Search data", res.data)
      // setValue("searchString","")
      setSearchResults([]);

      if (res.data) {
        dispatch(searchListingData(res.data));
        dispatch(LoaderStatus(false));
        localStorage.setItem("SearchString", JSON.stringify(data.searchString));
        return navigate("/searchListing");
      }
    });
  };

  return (
    <>
      <form
        className="d-flex justify-content-center"
        role="search"
        onSubmit={handleSubmit(onSubmit)}
        style={{ alignSelf: "normal" }}
      >
        <div className="searchResultsContainer">
          <div className="customCross d-flex align-items-center">
            <input
              className="form-control"
              type="text"
              placeholder="Search"
              autoComplete="off"
              aria-label="Search"
              id="searchField"
              spellCheck="false"
              {...register("searchString")}
              onChange={debounce(async (e: any) => {
                let str = e.target.value;
                // console.log("str check", str)
                if (str.length > 0) {
                  setShowCross(true);
                } else {
                  setShowCross(false);
                }
                let data = {
                  searchString: str,
                  title: "title",
                };
                setValue("searchString", str);
                if (str.length > 1) {
                  axios({
                    method: "post",
                    url: "/api/search",
                    data: data,
                  })
                    .then(function (response) {
                      // console.log(response.data);
                      if (response.data?.newData.length > 0) {
                        setSearchResults(response.data?.newData);
                      } else {
                        setSearchResults([]);
                      }
                    })
                    .catch(function (error) {
                      console.log("Error block", error);
                    });
                }
              }, 274)}
            />
            {showCross ? (
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => {
                  setValue("searchString", "");
                  setSearchResults([]);
                  setShowCross(false);
                }}
                style={{ position: "absolute", right: "13px", border: "none" }}
              ></button>
            ) : (
              ""
            )}
          </div>
          {searchResults?.length > 0 ? (
            <div className="searchResults">
              {searchResults?.length > 0
                ? searchResults.map((result: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className="searchItem p-2 d-flex justify-content-between"
                        onClick={() => {
                          setValue("searchString", result.name);
                          // // @ts-ignore
                          // document.getElementById("searchField").setValue = result.name;
                          // @ts-ignore
                          document.getElementById("searchField").focus();
                          setSearchResults([]);
                        }}
                      >
                        <div className="customEllipse" style={{maxWidth:"70%"}}>
                          
                            <i style={{fontSize:"1rem"}}>{result.name}</i>
                          
                        </div>
                        <div className="customEllipse">
                          <b style={{fontSize:"1rem"}}>{result?.address?.country}</b>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          ) : (
            ""
          )}
        </div>
        <button
          className="btn btn-dark btn-outline-primary px-3 ms-2"
          data-bs-toggle="collapse"
          data-bs-target=".navbar-collapse.show"
          type="submit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-search searchSvg"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </button>
      </form>
    </>
  );
};
