import React, { useEffect, useState } from "react";
import "./App.css";
import SignTarget from "./SignTarget";
import axios from "axios";
import { ChevronDown, ChevronRight, Paperclip } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ListLibrary from "./HtmlFunctions/ListLibrary";
import { useListLibrary } from "./Context/ListLibraryContext";
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";

export default function SignRegister() {
  const navigate = useNavigate();
  const location = useLocation(); // location 객체를 사용하여 이전 페이지에서 전달된 데이터 수신

  // 로그인
  const {isLoggedIn, empCode, logout} = useAuth();
  const [prevLogin, setPrevLogin] = useState(undefined);   // 이전 로그인 상태를 추적할 변수

  // 슬라이드 부분
  const [isRClick, setIsRClick] = useState(false);
  const [newWindowPosY, setNewWindowPosY] = useState(500);
  const [newWindowPosX, setNewWindowPosX] = useState(500);
  const [newWindowData, setNewWindowData] = useState([]);
  const [noticeNum, setNoticeNum] = useState("");
  const { btnCtl, setBtnCtl } = useListLibrary();
  const [user, setUser] = useState(empCode);
  const [com, setCom] = useState(empCode.split("-")[0]);

  /* 공지사항 내용 가져오기 */
  const [noticeHtml, setNoticeHtml] = useState("");
  const [loadNoticeHtml, setLoadNoticeHtml] = useState("");
  const [addressBookHtml, setAddressBookHtml] = useState("");
  const fetchData = async () => {
    const result1 = await ListLibrary.noticeList(user, btnCtl);
    setNoticeHtml(result1);
    const result2 = await ListLibrary.loadNotice(noticeNum);
    setLoadNoticeHtml(result2);
    const result3 = await ListLibrary.addressBook(user, "");
    setAddressBookHtml(result3);

    //ListLibrary.dataTest1('3118115625-abcc')
    //ListLibrary.dataTest2('3118115625-qwer')
    //ListLibrary.dataTest3('3118115625-abcc','3118115625-qwer')
    //ListLibrary.dataTest4('3118115625-abcc','3118115625-qwer')
  };


  useEffect(() => {
    fetchData();
  }, [btnCtl]);

  useEffect(() => {
    const elements = document.querySelectorAll(".testEvent");

    const handleClick = (event) => {
      setBtnCtl(5);
      setNoticeNum(event.currentTarget.id);
      ListLibrary.noticeUpdate(event.currentTarget.id, user);
    };

    elements.forEach((element) => {
      element.addEventListener("click", handleClick);
    });

    return () => {
      elements.forEach((element) => {
        element.removeEventListener("click", handleClick);
      });
    };
  }, [noticeHtml, btnCtl]);

  useEffect(() => {
    const elements = document.querySelectorAll(".AddBtn");
    const btnElement = document.querySelector(".BtnAddressBookAdd");
    const InputAddressBookAdd = document.querySelectorAll(".InputAddressBookAdd");
    const InputAddressBookSearch = document.querySelector(".InputAddressBookSearch");
    let keyWord = "";
    const keyWordSet = async (e) => {
      if (e.key === "Enter") {
        keyWord = e.currentTarget.value;
        setAddressBookHtml(await ListLibrary.addressBook(user, keyWord));
      }
    };

    const addBtnClick = async (e) => {
      if (await ListLibrary.addressTargetSelect(InputAddressBookAdd[0].value, InputAddressBookAdd[1].value)) {
        if (!(await ListLibrary.addressEmpAddSelect(user, InputAddressBookAdd[0].value))) {
          await ListLibrary.addressBookAdd(InputAddressBookAdd[0].value, user);
        } else {
          alert("이미 존재하는 아이디 입니다");
        }
        setAddressBookHtml(await ListLibrary.addressBook(user, keyWord));
      } else {
        alert("정보가 일치하지 않습니다");
      }
    };

    const handleClick = async (e) => {
      await ListLibrary.addressBookDelete(e.currentTarget.parentNode.parentNode.id.replace("Add", ""), user);
      setAddressBookHtml(await ListLibrary.addressBook(user, keyWord));
    };
    elements.forEach((element) => {
      element.addEventListener("click", handleClick);
    });
    if (btnElement) {
      btnElement.addEventListener("click", addBtnClick);
    } else {
      //첫 로딩 거르기(주소록 누르기전 방지)
    }
    if (InputAddressBookSearch) {
      InputAddressBookSearch.addEventListener("keydown", keyWordSet);
    }
    return () => {
      elements.forEach((element) => {
        element.removeEventListener("click", handleClick);
      });
      if (btnElement) {
        btnElement.removeEventListener("click", addBtnClick);
      }
      if (InputAddressBookSearch) {
        InputAddressBookSearch.removeEventListener("keydown", keyWordSet);
      }
    };
  }, [addressBookHtml, btnCtl]);


  // 왼쪽 카테고리
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [rejectedCount, setRejectedCount] = useState(0); // 반려 문서 수 상태 추가
  const [isCategoriExpanded, setIsCategoriExpanded] = useState(false);

  // 카테고리
  const [category, setCategory] = useState(location.state?.selectCategory || "");
  const [categories, setCategories] = useState([]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [openTarget, setOpenTarget] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [userInfo, setUserInfo] = useState([]);

  // 양식 사용하면
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyTel, setCompanyTel] = useState("");
  const [companyFax, setCompanyFax] = useState("");
  const [docNum, setDocNum] = useState("");
  const [docReception, setDocReception] = useState("");
  const [docReference, setDocReference] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [docOutline, setDocOutline] = useState("");
  const [docContent, setDocContent] = useState("");
  const [docAttached1, setDocAttached1] = useState("");
  const [docAttached2, setDocAttached2] = useState("");
  const [docAttached3, setDocAttached3] = useState("");
  const [docDate, setDocDate] = useState("");
  const [docCeo, setDocCeo] = useState("");

  const today = new Date();
  const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

  // 오른쪽 슬라이드 관련
  const windowRClick = async (e) => {
    e.preventDefault();
    if (e.target.className.includes("worker")) {
      await setNewWindowPosY(e.target.getBoundingClientRect().y + 24);
      await setNewWindowPosX(50);
      setIsRClick(true);
      ListLibrary.RClickWindow(newWindowPosX, newWindowPosY, e.target.getAttribute("data-value")).then((data) =>
        setNewWindowData([data[0], data[1]])
      );
    }
  };

  // 카테고리 불러오기
  useEffect(() => {
    if(isLoggedIn) {
      try {
        axios
            .get(`/code/${com}`) // API 엔드포인트를 조정하세요
            .then((response) => {
              console.log(response.data.signCateCode);
              const uniqueCategories = [...new Set(response.data.signCateCode.split(",").map((category) => category))];
              console.log("uniqueCategories::", uniqueCategories);
              setCategories(uniqueCategories);
            })
            .catch((error) => console.log(error));

        axios.get(`/emp/${empCode}`).then((response) => {
          console.log(response.data);
          const user = response.data;
          setUserInfo([
            {
              empCode: user.empCode,
              name: user.empName,
              dep: user.depCode,
              pos: user.posCode,
              sign: "기안",
            },
          ]);
        });

        axios.get(`/sign/${empCode}`)
            .then(response => {
              let count = 0;
              response.data.map((data, index) => {
                if (data.empCode === empCode) {
                  if (data.target.includes("반려")) {
                    count += 1;
                  }
                }
              })
              setRejectedCount(count)
            })
            .catch(error => console.log(error));
      } catch (error) {
        console.error(error);
      }
    }
  }, [isLoggedIn, empCode]);

  useEffect(() => {
    if (isToggled) {
      // 양식이 사용될 때 content 업데이트
      const newContent =
        "양식_companyName:" +
        companyName +
        "_companyAddress:" +
        companyAddress +
        "_companyTel:" +
        companyTel +
        "_companyFax:" +
        companyFax +
        "_docNum:" +
        docNum +
        "_docReception:" +
        docReception +
        "_docReference:" +
        docReference +
        "_docTitle:" +
        docTitle +
        "_docOutline:" +
        docOutline +
        "_docContent:" +
        docContent +
        `${docAttached1 ? "_docAttached1:" + docAttached1 : ""}` +
        `${docAttached2 ? "_docAttached2:" + docAttached2 : ""}` +
        `${docAttached3 ? "_docAttached3:" + docAttached3 : ""}` +
        "_docDate:" +
        docDate +
        "_docCeo:" +
        docCeo;

      setContent(newContent);
    }
  }, [
    isToggled,
    companyName,
    companyAddress,
    companyTel,
    companyFax,
    docNum,
    docReception,
    docReference,
    docTitle,
    docOutline,
    docContent,
    docAttached1,
    docAttached2,
    docAttached3,
    docDate,
    docCeo,
  ]);

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await axios.post('/api/employ/logout');
      logout(); // 로그아웃 호출
      navigate("/"); // 로그아웃 후 홈으로 이동
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  const handleFileChange = (event) => {
    setAttachment(event.target.files[0]); // 선택한 파일 상태 업데이트
  };

  const goClose = (param) => {
    setOpenTarget(false);
    if (param) {
      setUserInfo([userInfo[0] ,...param]);
    }
  };

  // 문서 작성 버튼 클릭 시
  const handleSubmit = async () => {
    const formData = new FormData();

    // 결재선
    if (userInfo.length == 1) {
      alert("결재선을 추가해야 합니다."); // 길이가 1인 경우 알림
      return; // DB와 연결하지 않음
    }
    // 카테고리
    if (category == "") {
      alert("카테고리 입력은 필수입니다.");
      return;
    }
    // 제목
    if (title == "") {
      alert("제목을 입력해주세요.");
      return;
    }
    // 양식 사용 여부
    if (isToggled) {
      // 양식 사용하면
      if (companyName == "") {
        alert("회사명 칸이 비어 있습니다.");
        return;
      }

      if (docNum == "") {
        alert("문서번호 칸이 비어 있습니다.");
        return;
      }

      if (docTitle == "") {
        alert("문서제목 칸이 비어 있습니다.");
        return;
      }

      if (docOutline == "") {
        alert("개요 칸이 비어 있습니다.");
        return;
      }

      if (docContent == "") {
        alert("문서내용 칸이 비어 있습니다.");
        return;
      }

      if (docDate == "") {
        alert("날짜 칸이 비어 있습니다.");
        return;
      }

      if (docCeo == "") {
        alert("대표작성 칸이 비어 있습니다.");
        return;
      }
    } else if (content == "") {
      alert("전체 내용이 비어있습니다. 다시 확인해 주세요.");
      return;
    }

    // 결재선 구성
    let target = `${userInfo[0].empCode}:확인_기안,`;
    for (let i = 1; i < userInfo.length; i++) {
      target += `${userInfo[i].empCode}:미확인_미승인`; // 첫 번째 인덱스 제외
      if (i < userInfo.length - 1) {
        target += ","; // 마지막 인덱스가 아니면 쉼표 추가
      }
    }

    formData.append("empCode", empCode); // 사용자 코드
    formData.append("title", title); // 제목
    formData.append("category", category); // 카테고리
    formData.append("content", content); // 내용
    formData.append("target", target); // 결재선

    // 첨부파일이 있는 경우 추가
    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      const response = await axios.post("/sign/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const success = window.confirm("정말 저장 하시겠습니까? 수정이 불가하니 양식을 사용한다면 다시 한번 확인하는것을 권장드립니다."); // 성공 메시지

      if (success) {
        // 성공 시 문서 리스트로 이동
        alert("성공적으로 저장되었습니다.")
        navigate("/sign");
      } else {
        return;
      }
    } catch (error) {
      console.error("Error creating sign:", error);
      // 오류 처리: 사용자에게 알림 추가 가능
    }
  };

  // 목록 버튼 클릭 시 리스트 페이지로 이동
  const handleHome = () => {
    navigate("/sign");
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleToggle = () => {
    setIsToggled((prevState) => !prevState);

    console.log(isToggled);
  };

  return (
      <div className="min-h-screen flex flex-col" onContextMenu={windowRClick}>
        {/* Header with logo */}
        <header className="flex justify-end items-center border-b shadow-md h-[6%] bg-white">
          <div className="flex mr-6">
            <div className="font-bold mr-1">{formattedDate}</div>
            <Clock
                format={'HH:mm:ss'}
                ticking={true}
                timezone={'Asia/Seoul'}/>
          </div>
          <div className="mr-5">
            <img width="40" height="40" src="https://img.icons8.com/windows/32/f87171/home.png"
                 alt="home" onClick={()=>navigate("/main")}/>
          </div>
          <div className="mr-16">
            <img width="45" height="45"
                 src="https://img.icons8.com/ios-glyphs/60/f87171/user-male-circle.png"
                 alt="user-male-circle" onClick={togglePanel}/>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 flex">
          <aside className="w-64 bg-red-200 p-4 space-y-2">
            <ol>
              <li>
                <div>
                  <button
                      className={`w-full flex items-center transition-colors duration-300`}
                      onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                        <ChevronRight className="mr-2 h-4 w-4"/>}
                    <span className="hover:underline">결재함</span>

                  </button>
                  {isExpanded && (
                      <div className="ml-8 space-y-2 pace-y-2 mt-2">
                        <li>
                          <div>
                            <button className="w-full flex items-center">
                              <ChevronRight className="mr-2 h-4 w-4"/>
                              <div className="hover:underline" onClick={() => navigate("/sign")}>전체 보기</div>
                            </button>
                          </div>
                        </li>
                        <li>
                          <div>
                            <button className="w-full flex items-center"
                                    onClick={() => setIsCategoriExpanded(!isCategoriExpanded)}>
                              {isCategoriExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                                  <ChevronRight className="mr-2 h-4 w-4"/>}
                              <div className="hover:underline">카테고리</div>
                            </button>
                            {isCategoriExpanded && (
                                categories.map((category, index) => (
                                    // 각 카테고리를 ','로 나누고 각 항목을 한 줄씩 출력
                                    category.split(',').map((item, subIndex) => (
                                        <li className={`text-left transition-colors duration-300`}>
                                          <div className="flex">
                                            <ChevronRight className="ml-4 mr-2 h-4 w-4"/>
                                            <button key={`${index}-${subIndex}`}
                                                    className="hover:underline">
                                              {item}
                                            </button>
                                          </div>
                                        </li>
                                    ))
                                ))
                            )}
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <button className="w-full flex items-center">
                              <ChevronRight className="mr-2 h-4 w-4"/>
                              <div className="hover:underline">내 결재함</div>
                            </button>
                            {rejectedCount > 0 &&
                                <span
                                    className="bg-red-700 text-white rounded-full w-6">{rejectedCount}</span>}
                          </div>
                        </li>
                      </div>
                  )}
                </div>
              </li>
            </ol>
          </aside>
          <main className="flex-1 p-4">
            <div className="flex justify-start space-x-2 mb-4">
              <button className="w-[80px] h-[40px] bg-gray-200 hover:bg-gray-400 rounded" onClick={handleHome}>
                목록
              </button>
            </div>
            <h1 className="text-2xl font-bold mb-4">결재 문서 작성</h1>

            <div className="flex justify-center">
              <div className="flex justify-between w-[350px] mb-4">
                <div className={`${isToggled ? "" : "font-bold"}`}>파일만 첨부하기</div>
                <p
                    className={`w-[60px] h-[30px] rounded-[30px] border-blue-600 border-2 flex items-center cursor-pointer relative ${
                        isToggled ? "on bg-blue-300" : "off"
                    }`}
                    onClick={handleToggle}
                >
                  <div
                      className={`w-[25px] h-[23px] rounded-full bg-blue-600 absolute top-[1px] ${
                          isToggled ? "right-[3px]" : "left-[3px] border-blue-600"
                      }`}
                  ></div>
                </p>
                <div className={`${isToggled ? "font-bold" : ""}`}>제공된 양식 사용하기</div>
              </div>
            </div>

            <div className="border border-black rounded p-2">
              <div className="flex">
                <div>
                  <div className="flex">
                    <fieldset className="mr-2">
                      {/*<legend>카테고리</legend>*/}
                      <div>
                        <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}
                                className="border rounded p-2">
                          <option value="">카테고리</option>
                          {categories.map((category, index) =>
                              category.split(",").map((item, subIndex) => (
                                  <option key={subIndex} value={item}>
                                    {item}
                                  </option>
                              ))
                          )}
                        </select>
                      </div>
                    </fieldset>

                    <input
                        type="text"
                        className="w-[1087px] p-2 border rounded mb-2"
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  {openTarget ? <SignTarget onClose={goClose} empCode={empCode}/> : null}

                  {isToggled ? (
                      <form>
                        <div
                            className="h-[1697px] w-[1200px] flex flex-col justify-center items-center border-black border-2 px-6 py-12 mb-4">
                          {/* 내용 추가 가능 */}
                          {/*  회사명, 결재라인  */}
                          <table className="h-[178px]">
                            <tr>
                              <td className="w-[500px] text-2xl">
                                <input
                                    name="companyName"
                                    type="text"
                                    placeholder="기업명"
                                    className="text-center h-[100px] w-[450px] text-2xl"
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                              </td>
                              <td className="w-[500px] flex flex-row justify-center mt-5">
                                {userInfo.map((user, index) => {
                                  return (
                                      <div className="flex flex-col justify-center w-[80px] border-2 border-black">
                                        <div
                                            className="h-[30px] bg-gray-200">{user.sign == "미승인" ? "승인" : user.sign}</div>
                                        <div
                                            className="h-[90px] border-t-2 border-black p-2 flex flex-col justify-around">
                                          <div>{user.name}</div>
                                          <div>{user.sign}</div>
                                        </div>
                                        {/*  결재자 있으면 추가 작성되게 하기  */}
                                      </div>
                                  );
                                })}
                              </td>
                            </tr>
                          </table>
                          {/*    */}
                          <div className="mt-[20px]">
                            <input
                                name="companyAddress"
                                type="text"
                                placeholder="주소"
                                className="text-center h-[50px] w-[900px] text-lg"
                                onChange={(e) => setCompanyAddress(e.target.value)}
                            />
                          </div>
                          {/*    */}
                          <table className="mb-[40px] border-t-2 border-b-4 border-black">
                            <tr>
                              <td className="w-[500px] border-r-2 border-black">
                                <input
                                    name="companyTel"
                                    type="tel"
                                    placeholder="TEL: (000)0000-0000"
                                    className="text-center h-[50px] w-[400px] text-lg"
                                    onChange={(e) => setCompanyTel(e.target.value)}
                                />
                              </td>
                              <td className="w-[500px] border-l-2 border-black">
                                <input
                                    name="companyFax"
                                    type="tel"
                                    placeholder="FAX: (000)0000-0000"
                                    className="text-center h-[50px] w-[400px] text-lg"
                                    onChange={(e) => setCompanyFax(e.target.value)}
                                />
                              </td>
                            </tr>
                          </table>
                          {/*    */}
                          <table className="border-t-4 border-b-4 border-black mb-[20px]">
                            <tr className="border-b-2 border-black">
                              <td className="w-[200px] border-r-2 border-black">
                                <div>문 서 번 호</div>
                              </td>
                              <td className="w-[800px]">
                                <input
                                    name="docNum"
                                    type="text"
                                    className="text-center h-[50px] w-[700px] text-lg"
                                    onChange={(e) => setDocNum(e.target.value)}
                                />
                              </td>
                            </tr>
                            <tr className="border-b-2 border-black">
                              <td className="w-[200px] border-r-2 border-black">
                                <div>수 신</div>
                              </td>
                              <td className="w-[800px]">
                                <input
                                    name="docReception"
                                    type="text"
                                    className="text-center h-[50px] w-[700px] text-lg"
                                    onChange={(e) => setDocReception(e.target.value)}
                                />
                              </td>
                            </tr>
                            <tr className="border-b-2 border-black">
                              <td className="w-[200px] border-r-2 border-black">
                                <div>참 조</div>
                              </td>
                              <td className="w-[800px]">
                                <input
                                    name="docReference"
                                    type="text"
                                    className="text-center h-[50px] w-[700px] text-lg"
                                    onChange={(e) => setDocReference(e.target.value)}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="w-[200px] border-r-2 border-black">
                                <div>제 목</div>
                              </td>
                              <td className="w-[800px]">
                                <input
                                    name="docTitle"
                                    type="text"
                                    className="text-center h-[50px] w-[700px] text-lg"
                                    onChange={(e) => setDocTitle(e.target.value)}
                                />
                              </td>
                            </tr>
                          </table>
                          {/*    */}
                          <div>
                        <textarea
                            name="docOutline"
                            className="w-[950px] h-[300px]"
                            placeholder="문서의 개요를 작성하세요."
                            onChange={(e) => setDocOutline(e.target.value)}
                        />
                          </div>
                          {/*    */}
                          <table>
                            <tr>
                              <td className="h-[50px]">
                                <div>- 아 래 -</div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div>
                              <textarea
                                  name="docContent"
                                  className="w-[950px] h-[400px]"
                                  placeholder="문서의 내용을 작성하세요."
                                  onChange={(e) => setDocContent(e.target.value)}
                              />
                                </div>
                              </td>
                            </tr>
                          </table>
                          {/*    */}
                          <table className="w-[950px]">
                            <tr>
                              <td rowSpan="3">
                                <div>※ 붙임</div>
                              </td>
                              <td>
                                1.{" "}
                                <input
                                    name="docAttached1"
                                    type="text"
                                    className="w-[700px] h-[50px]"
                                    placeholder="내용을 입력해주세요."
                                    onChange={(e) => setDocAttached1(e.target.value)}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                2.{" "}
                                <input
                                    name="docAttached2"
                                    type="text"
                                    className="w-[700px] h-[50px]"
                                    placeholder="내용을 입력해주세요."
                                    onChange={(e) => setDocAttached2(e.target.value)}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                3.{" "}
                                <input
                                    name="docAttached3"
                                    type="text"
                                    className="w-[700px] h-[50px]"
                                    placeholder="내용을 입력해주세요."
                                    onChange={(e) => setDocAttached3(e.target.value)}
                                />
                              </td>
                            </tr>
                          </table>
                          <div>
                            <input
                                name="docDate"
                                className="text-center h-[50px] w-[200px]"
                                placeholder="20oo.  oo.  oo."
                                onChange={(e) => setDocDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <input
                                name="docCeo"
                                type="textbox"
                                className="text-center h-[100px] w-[300px] text-2xl"
                                placeholder="대표이사   ○ ○ ○"
                                onChange={(e) => setDocCeo(e.target.value)}
                            />
                          </div>
                        </div>
                      </form>
                  ) : (
                      <div className="flex mb-2">
                    <textarea
                        className="p-1 w-[1200px] h-[400px] border border-black rounded"
                        placeholder="파일과 함께 보낼 내용을 작성해주세요."
                        onChange={(e) => setContent(e.target.value)}
                    />
                      </div>
                  )}
                  <div>
                    <div className="flex justify-between mb-4 w-[1200px] p-2 border rounded">
                      <div className="flex items-center">
                        <Paperclip className="h-5 w-5 mr-2"/>
                        <span className="whitespace-nowrap">첨부파일</span>
                        <input type="file" className="m-1" onChange={handleFileChange}/>
                      </div>
                      <div> {attachment ? `${(attachment.size / 1024).toFixed(2)} KB / 10 MB` : "0 KB / 10 MB"}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col ml-2">
                  <button
                      className="bg-amber-500 text-white px-6 py-2 rounded hover:bg-amber-600 mr-[5px]"
                      onClick={() => {
                        setOpenTarget(true);
                      }}
                  >
                    결재선 정하기
                  </button>
                  <table className="table-auto mt-2 border rounded w-[400px]">
                    <thead>
                    <tr className="bg-gray-200">
                      <td>순서</td>
                      <td>성명</td>
                      <td>부서</td>
                      <td>직급</td>
                      <td>승인</td>
                    </tr>
                    </thead>
                    <tbody>
                    {userInfo.map((user, index) => {
                      return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.dep}</td>
                            <td>{user.pos}</td>
                            <td>{user.sign}</td>
                          </tr>
                      );
                    })}
                    </tbody>
                  </table>
                  <div>
                    <div className="rounded bg-amber-100 mt-2 p-3 text-left">
                      <div className="mb-2">
                        <span className="font-bold">필수 입력 요소</span>
                        <br/>- 결재선(본인 제외 최대 3명), 카테고리, 제목, 내용
                      </div>
                      <div>
                        <span className="font-bold">양식 사용시 필수 입력 요소</span>
                        <br/>- 회사명, 문서번호, 문서제목, 개요, 내용, 날짜, 대표자
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-[5px]"
                      onClick={handleSubmit}>
                문서 만들기
              </button>
              <button className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 ml-[5px]"
                      onClick={handleHome}>
                취소
              </button>
            </div>
          </main>
        </div>

        {/* Slide-out panel with toggle button */}
        <div
            className={`fixed top-0 right-0 mt-[50px] h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                isPanelOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Panel toggle button */}
          {/*<button*/}
          {/*    onClick={togglePanel}*/}
          {/*    className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-blue-500 text-white w-6 h-12 flex items-center justify-center rounded-l-md hover:bg-blue-600"*/}
          {/*>*/}
          {/*  {isPanelOpen ? ">" : "<"}*/}
          {/*</button>*/}

          <div className="p-4">
            {isLoggedIn ? <button onClick={handleLogout}>로그아웃</button>
                : (<><h2 className="text-xl font-bold mb-4">로그인</h2>
                      <input
                          type="text"
                          placeholder="아이디"
                          className="w-full p-2 mb-2 border rounded"
                      />
                      <input
                          type="password"
                          placeholder="비밀번호"
                          className="w-full p-2 mb-4 border rounded"
                      />
                      <button
                          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">
                        로그인
                      </button>
                    </>
                )}
            <div className="text-sm text-center mb-4">
              <a href="#" className="text-blue-600 hover:underline">
                공지사항
              </a>
              <span className="mx-1">|</span>
              <a href="#" className="text-blue-600 hover:underline">
                문의사항
              </a>
            </div>
            <div className="h-[600px]">
              <h3 className="font-semibold mb-2 h-[25px]">메신저</h3>
              <div className="h-[138px]">
                <div className="flex">
                  <div className="w-1/3 border">
                    <img src="/logo192.png"/>
                  </div>
                  <div className="w-2/3 text-left border">
                    <p>사내 이메일:</p>
                    <p>전화번호:</p>
                    <p>상태:</p>
                  </div>
                </div>
                <div className="flex">
                  <button className="border w-1/5 text-sm" onClick={() => setBtnCtl(0)}>
                    조직도
                  </button>
                  <button className="border w-1/5 text-sm" onClick={() => setBtnCtl(1)}>
                    대화방
                  </button>
                  <button className="border w-1/5 text-sm" onClick={() => setBtnCtl(2)}>
                    주소록
                  </button>
                  <button className="border w-2/5 text-sm" onClick={() => setBtnCtl(3)}>
                    공지사항
                  </button>
                </div>
              </div>
              <div className="border text-left h-[435px] blue">
                {btnCtl === 0 ? (
                    ListLibrary.WorkerList(com)
                ) : btnCtl === 1 ? (
                    <>
                      <div className="h-[100%] overflow-y-auto">
                        <div className="border flex justify-between">
                          <button>대화방</button>
                          <button>나가기</button>
                        </div>
                      </div>
                    </>
                ) : btnCtl === 2 ? (
                    <>
                      <div dangerouslySetInnerHTML={{__html: addressBookHtml}}/>
                    </>
                ) : btnCtl === 3 ? (
                    <>
                      <div dangerouslySetInnerHTML={{__html: noticeHtml}}/>
                      <div>
                        <button className="text-center border w-full h-[45px]" onClick={() => setBtnCtl(6)}>
                          {" "}
                          공지사항 추가하기
                        </button>
                      </div>
                    </>
                ) : btnCtl === 4 ? (
                    <>
                      <div className="h-[480px] overflow-y-auto">
                        <ul className="pb-2">
                          상대방이름 <li className="pl-4">대화내용 </li>
                        </ul>
                        <ul className="text-right pb-2">
                          사용자이름 <li className="pr-4">대화내요ㅛㅛㅛㅛㅛㅇ </li>
                        </ul>
                        <ul className="pb-2">
                          상대방이름 <li className="pl-4">대화내용 </li>
                        </ul>
                        <ul className="pb-2">
                          상대방이름 <li className="pl-4">대화내용 </li>
                        </ul>
                        <ul className="pb-2">
                          상대방이름 <li className="pl-4">대화내용 </li>
                        </ul>
                        <ul className="pb-2">
                          상대방이름 <li className="pl-4">대화내용 </li>
                        </ul>
                        <ul className="pb-2">
                          상대방이름 <li className="pl-4">대화내용 </li>
                        </ul>
                        <ul className="pb-2">
                          상대방이름 <li className="pl-4">대화내용 </li>
                        </ul>
                        <ul className="pb-2">
                          상대방이름 <li className="pl-4">대화내용 </li>
                        </ul>
                        <ul className="pb-2">
                          상대방이름 <li className="pl-4">대화내용 </li>
                        </ul>
                        <ul className="pb-2">
                          상대방이름 <li className="pl-4">대화내용 </li>
                        </ul>
                        <ul className="pb-2">
                          상대방이름 <li className="pl-4">대화내용 </li>
                        </ul>
                      </div>
                    </>
                ) : btnCtl === 5 ? (
                    <>
                      <div dangerouslySetInnerHTML={{__html: loadNoticeHtml}}/>
                      <div>
                        <button className="text-center border w-full h-[45px]" onClick={() => setBtnCtl(3)}>
                          목록으로
                        </button>
                      </div>
                    </>
                ) : btnCtl === 6 ? (
                    <>
                      {ListLibrary.noticeWritePage(com, setBtnCtl)}
                      <button
                          className="text-center border w-full h-[45px]"
                          onClick={() => {
                            setBtnCtl(3);
                            ListLibrary.noticeInsert(user);
                          }}
                      >
                        공지사항 등록
                      </button>
                    </>
                ) : (
                    <></>
                )}
              </div>
            </div>
            {isRClick === true ? (
                <div className={`flex absolute`} style={{top: `${newWindowPosY}px`, right: `${newWindowPosX}px`}}>
                  <div className="w-1/3 border">
                    <img src="/logo192.png"/>
                  </div>
                  <div className="w-2/3 text-left border">
                    <p>사내 이메일:{newWindowData[0]}</p>
                    <p>전화번호:{newWindowData[1]}</p>
                    <p>상태:</p>
                    <button
                        onClick={() => {
                          setIsRClick(false);
                          setNewWindowData([]);
                        }}
                    >
                      닫기
                    </button>
                  </div>
                </div>
            ) : (
                <></>
            )}
          </div>
        </div>
      </div>
  );
}
