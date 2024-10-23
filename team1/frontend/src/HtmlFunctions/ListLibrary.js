import React, {createContext, useContext, useState} from "react";
import axios from "axios";

const ListLibraryContext = createContext();

export const ListLibrary = ({children}) => {
    const [depCode, setDepCode] = useState([]);
    const [upDepCode, setUpDepCode] = useState([]);
    const [empCode, setEmpCode] = useState([]);
    const [empName, setEmpName] = useState([]);
    const [empDepCode, setEmpDepCode] = useState([]);
    const [returnList, setReturnList] = useState(null);
    const [returnList2, setReturnList2] = useState(null);
    const [top, setTop] = useState("");
    const [RClick, setRClick] = useState(false);
    const [mail, setMail] = useState("");
    const [PH, setPH] = useState("");
    const [state, setState] = useState("");
    const [data, setData] = useState(["", "", "", ""]);

    const WorkerList = (code) => {
        const depLayout = () => {

            let htmlList = {};
            setTop("");

            depCode.forEach((v1, i1) => {
                const htmlTag = new DOMParser().parseFromString(
                    `<li id=${v1} class=${upDepCode[i1]} style="list-style-type: none">${v1}<ul class="list-disc pl-5"></ul></li>`,
                    'text/html'
                ).body.firstChild;
                htmlList[htmlTag.id] = htmlTag;
            });

            empDepCode.forEach((v1, i1) => {
                htmlList[v1].children[0].appendChild(
                    new DOMParser().parseFromString(
                        `<li class="${empDepCode[i1]} worker w-[50px]" data-value=${empCode[i1]}>${empName[i1]}</li>`,
                        'text/html'
                    ).body.firstChild
                );
            });

            depCode.forEach((v1, i1) => {
                depCode.forEach((v2, i2) => {
                    if (htmlList[v1].id !== htmlList[v2].id) {
                        if (htmlList[v1].id === htmlList[v2].className) {
                            htmlList[v1].children[0].appendChild(htmlList[v2]);
                        }
                    }
                });
                if (upDepCode[i1] === "") {
                    setTop(v1);
                }
            });

            return htmlList[top];
        }

        const listCheck = async () => {
            await axios.get("/chartSelect", code)
                .then(response => {
                    setDepCode(response.data[0]);
                    setUpDepCode(response.data[1]);
                    setEmpCode(response.data[2]);
                    setEmpName(response.data[3]);
                    setEmpDepCode(response.data[4]);
                })
                .catch(error => console.log(error));
            setReturnList(depLayout())
        }

        listCheck();

        return (
            <div className="h-[100%] overflow-y-auto">
                <ul className="list-disc pl-5">
                    {returnList && <div dangerouslySetInnerHTML={{__html: returnList.outerHTML}}/>}
                </ul>
            </div>
        );
    }

    const findChildren = (getChildList, isCheck) => {
        getChildList = getChildList.children[1].children;
        Array.from(getChildList).forEach((child) => {
            child.children[0].checked = isCheck;
            child.querySelectorAll("input").forEach((tag) => {
                tag.checked = isCheck;
            });
        });
    };

    const WorkerList2 = (code) => {
        const depLayout = () => {
            setData(["", "", "", ""]);
            let htmlList = {};
            const htmlTags = new DOMParser().parseFromString(`
                    <div class="border h-[210px]">
                        <input class="border w-[100%] h-[25px]" placeholder="제목입력" onchange="{setData(v => [this.value, v[1], v[2], v[3]])}"/>
                        <input type="date" class="border w-[100%] h-[25px]" onchange="{setData(v => [v[0], this.value, v[2], v[3]])}"/>
                        <textarea class="border w-[100%] h-[160px] resize-none" placeholder="내용입력" onchange="{setData(v => [v[0], v[1], this.value, v[3]])}"></textarea>
                    </div>
                    <div class="border h-[180px] here overflow-y-auto"><ul class="list-disc pl-5" id="topUL"></ul></div>
            `, 'text/html').body;

            let topParent = ""
            upDepCode.forEach((v1, i1) => {
                if (v1 === "") topParent = depCode[i1];
            });

            depCode.forEach((v1, i1) => {
                const htmlTag = new DOMParser().parseFromString(`
                    <li id=${v1} class=${upDepCode[i1]} style="list-style-type: none">${v1}<input id="${v1}Btn" type="checkbox" onChange="{(e) => {
                        let getParentId = document.getElementById('${v1}');
                        findChildren(getParentId, e.target.checked);
                        
                        while (!!getParentId.parentNode.parentNode.id) {
                            getParentId = getParentId.parentNode.parentNode;
                            const getChilds = Array.from(getParentId.children[1].children);
                            const isTrueCount = getChilds.filter(child => child.children[0].checked).length;
                            getParentId.children[0].checked = isTrueCount === getChilds.length;
                        }
                    }}"/>
                    <ul class="list-disc pl-5"></ul></li>`, 'text/html').body.firstChild;
                htmlList[htmlTag.id] = htmlTag;
            });

            empDepCode.forEach((v1, i1) => {
                htmlList[v1].children[1].appendChild(
                    new DOMParser().parseFromString(`
                    <li class="${empDepCode[i1]} worker w-[65px]" data-value=${empCode[i1]}>${empName[i1]}<input type="checkbox" onChange="{() => {
                            let getParentId = document.getElementById('${v1}');
                            const getChilds = Array.from(getParentId.getElementsByClassName('${v1}'));
                            const isTrueCount = getChilds.filter(child => child.children[0].checked).length;
                            getParentId.children[0].checked = isTrueCount === getChilds.length;
                            
                            while (!!getParentId.parentNode.parentNode.id) {
                                getParentId = getParentId.parentNode.parentNode;
                                const getChilds = Array.from(getParentId.children[1].children);
                                const isTrueCount = getChilds.filter(child => child.children[0].checked).length;
                                getParentId.children[0].checked = isTrueCount === getChilds.length;
                            }
                        }}"/>
                    </li>`, 'text/html').body.firstChild
                );
            });

            depCode.forEach((v1, i1) => {
                depCode.forEach((v2, i2) => {
                    if (htmlList[v1].id !== htmlList[v2].id) {
                        if (htmlList[v1].id === htmlList[v2].className) {
                            htmlList[v1].children[1].appendChild(htmlList[v2]);
                        }
                    }
                });
                if (upDepCode[i1] === "") {
                    setTop(v1);
                }
            });
            htmlTags.children[1].children[0].appendChild(htmlList[top]);
            return htmlTags;
        };

        const listCheck = async () => {
            await axios.get("/chartSelect", code)
                .then(response => {
                    setDepCode(response.data[0]);
                    setUpDepCode(response.data[1]);
                    setEmpCode(response.data[2]);
                    setEmpName(response.data[3]);
                    setEmpDepCode(response.data[4]);
                })
                .catch(error => console.log(error));
            setReturnList2(depLayout());
        }
        listCheck();
        return returnList2;
    };

    const RClickWindow = async (newWindowPosX, newWindowPosY, target) => {
        const RClickWindowSelect = async () => {
            const params = {code: target}
            await axios.get("/RClickWindowSelect", {params})
                .then(response => {
                    setMail(response.data[0]);
                    setPH(response.data[1]);
                })
                .catch(error => console.log(error));
        }
        await RClickWindowSelect();
        return [mail, PH];
    }

    const noticeList = (code, setBtnCtl) => {
        // await axios.get("/noticeListSelect", code)
        //     .then(response => {
        //         setDepCode(response.data[0]);
        //         setUpDepCode(response.data[1]);
        //         setEmpCode(response.data[2]);
        //         setEmpName(response.data[3]);
        //         setEmpDepCode(response.data[4]);
        //     })
        //     .catch(error => console.log(error));

        return (
            <>
                <div className="h-[390px] overflow-y-auto">
                    <div className="text-xs border break-words" onClick={() => console.log("좌클릭")}>
                        <p>제목</p>
                        <p>시작기간~종료기간</p>
                        <p>확인여부</p>
                    </div>
                </div>
                <div>
                    <button className="text-center border w-full h-[45px]" onClick={() => setBtnCtl(6)}> 공지사항 추가하기
                    </button>
                </div>
            </>
        );
    }

    const noticeWritePage = (code, setBtnCtl) => {
        WorkerList2(code)
        if (!returnList2) return setBtnCtl(3)
        return <>{<div dangerouslySetInnerHTML={{__html: returnList2.outerHTML}}/>}</>
    }

    const noticeInsert = (code) => {
        let isNotNull = 0;
        if (data.length === 0) {
            alert("공지사항을 입력해주세요");
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i] === "") {
                    switch (i) {
                        case 0:
                            alert("제목을 입력해주세요");
                            isNotNull++;
                            break;
                        case 1:
                            alert("종료일을 입력해주세요");
                            isNotNull++;
                            break;
                        case 2:
                            alert("내용을 입력해주세요");
                            isNotNull++;
                            break;
                    }
                    break;
                }
            }
            if (isNotNull === 0) {
                const topParent = document.getElementById('topUL');

                topParent.querySelectorAll("input").forEach((tag) => {
                    if (tag.checked && !!tag.parentNode.getAttribute('data-value')) {
                        setData(v => [v[0], v[1], v[2], v[3] + tag.parentNode.getAttribute('data-value') + ":0,"]);
                    }

                })
                const jsonData = {
                    empCode: code,
                    title: data[0],
                    content: data[2],
                    targets: data[3],
                    endTime: new Date(data[1]).toISOString()
                }
                axios.post("/noticeInsert", jsonData)
                    .then(response => {
                    })
                    .catch(error => console.log(error));
            }
        }
    }

    const value = {
        depCode,
        upDepCode,
        empCode,
        empName,
        empDepCode,
        returnList,
        returnList2,
        top,
        RClick,
        mail,
        PH,
        state,
        data,
        setDepCode,
        setUpDepCode,
        setEmpCode,
        setEmpName,
        setEmpDepCode,
        setReturnList,
        setReturnList2,
        setTop,
        setRClick,
        setMail,
        setPH,
        setState,
        setData,
        WorkerList,
        WorkerList2,
        RClickWindow,
        noticeList,
        noticeWritePage,
        noticeInsert,
    };

    return (
        <ListLibraryContext.Provider value={value}>
            {children}
        </ListLibraryContext.Provider>
    );
}
export const useListLibrary = () => {
    return useContext(ListLibraryContext);
};