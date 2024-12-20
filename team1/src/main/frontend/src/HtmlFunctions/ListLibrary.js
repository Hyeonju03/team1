import React, {useEffect, useState} from "react";
import axios from "axios";
import {useListLibrary} from "Context/ListLibraryContext";
import {json} from "react-router-dom";

class ListLibrary {
    static depCode = [];
    static upDepCode = [];
    static empCode = [];
    static empName = [];
    static empDepCode = [];
    static returnList = "";
    static returnList2 = "";
    static returnList3 = "";
    static top = "";
    static mail = "";
    static PH = "";
    static data = [];
    static noticeNum = [];
    static title = [];
    static content = [];
    static targets = [];
    static startDate = [];
    static endDate = [];
    static targetState = [];
    static codeList = [];

    static WorkerList(code) {
        const depLayout = () => {
            let htmlList = {};
            this.top = "";

            this.depCode.forEach((v1, i1) => {
                const htmlTag = new DOMParser().parseFromString(`<li id=${v1} class=${this.upDepCode[i1]} style="list-style-type: none">${v1}<ul class="list-disc pl-5"></ul></li>`, "text/html").body.firstChild;
                htmlList[htmlTag.id] = htmlTag;
            });

            this.empDepCode.forEach((v1, i1) => {
                htmlList[v1].children[0].appendChild(new DOMParser().parseFromString(`<li class="${this.empDepCode[i1]} worker w-[50px]" data-value=${this.empCode[i1]}>${this.empName[i1]}</li>`, "text/html").body.firstChild);
            });
            this.depCode.forEach((v1, i1) => {
                this.depCode.forEach((v2, i2) => {
                    if (htmlList[v1].id !== htmlList[v2].id) {
                        if (htmlList[v1].id === htmlList[v2].className) {
                            htmlList[v1].children[0].appendChild(htmlList[v2]);
                        }
                    }
                });
                if (this.upDepCode[i1] === "") {
                    this.top = v1;
                }
            });

            return htmlList[this.top];
        };

        const listCheck = async () => {
            await axios
                .get("/chartSelect", {params: {code}})
                .then((response) => {
                    this.depCode = response.data[0];
                    this.upDepCode = response.data[1];
                    this.empCode = response.data[2];
                    this.empName = response.data[3];
                    this.empDepCode = response.data[4];
                })
                .catch((error) => console.log(error));
            this.returnList = "";
            this.returnList = depLayout();
        };

        listCheck();
        return (<div className="h-[100%] overflow-y-auto">
            <ul className="list-disc pl-5">{<div
                dangerouslySetInnerHTML={{__html: this.returnList.outerHTML}}/>}</ul>
        </div>);
    }

    static findChildren(getChildList, isCheck) {
        getChildList = getChildList.children[1].children;
        const getChilds = Array.from(getChildList);
        for (let i = 0; i < getChildList.length; i++) {
            //getChilds[i].children[0].checked = isCheck; //하위 부서가 없을 경우만 정상작동
            getChilds[i].querySelectorAll("input").forEach((tag) => {
                //하위부서가 있어도 정상작동
                if (!tag.disabled){
                    tag.checked = isCheck;
                }
            });
        }
    }

    static WorkerList2(code) {
        const depLayout = () => {
            this.data = ["", "", "", ""];
            let htmlList = {};
            const htmlTags = new DOMParser().parseFromString(`
                    <div class="border h-[210px]">
                        <input class="border w-[100%] h-[25px]" placeholder="제목입력" onchange="ListLibrary.data[0] = this.value"/>
                        <input type="date" class="border w-[100%] h-[25px]" onchange="ListLibrary.data[1] = this.value"/>
                        <textarea class="border w-[100%] h-[160px] resize-none" placeholder="내용입력" onchange="ListLibrary.data[2] = this.value"></textarea>
                    </div>
                    <div class="border h-[180px] here overflow-y-auto"><ul class="list-disc pl-5" id="topUL"></ul></div>
            `, "text/html").body;

            let topParent = "";
            this.upDepCode.map((v1, i1) => {
                if (v1 === "") topParent = this.depCode[i1];
            });

            this.depCode.forEach((v1, i1) => {
                const htmlTag = new DOMParser().parseFromString(`<li id=${v1} class=${this.upDepCode[i1]} style="list-style-type: none">${v1}<input id="${v1}Btn" type="checkbox" onchange="
                    let getParentId = document.getElementById('${v1}');
                    let getChildList = document.getElementById('${v1}');
                    ListLibrary.findChildren(getChildList,getParentId.children[0].checked);
                    
                    while (!!getParentId.parentNode.parentNode.id){
                        getParentId = getParentId.parentNode.parentNode
                        const getChilds =  Array.from(getParentId.children[1].children);
                        let isTrueCount = [0,0];
                        getChilds.forEach(child => {
                              if (child.children[0].checked) isTrueCount[0]++;
                        });
                        if(isTrueCount[0] === getChilds.length) getParentId.children[0].checked = true;
                        else getParentId.children[0].checked = false
                    }
                    
                    
                    "><ul class="list-disc pl-5"></ul></li>`, "text/html").body.firstChild;
                htmlList[htmlTag.id] = htmlTag;
            });

            this.empDepCode.forEach((v1, i1) => {
                htmlList[v1].children[1].appendChild(new DOMParser().parseFromString(`<li class="${this.empDepCode[i1]} worker w-[65px]" data-value=${this.empCode[i1]}>${this.empName[i1]}<input type="checkbox" onchange="
                    let getParentId = document.getElementById('${v1}')
                    const getChilds = Array.from(getParentId.getElementsByClassName('${v1}'));
                    let isTrueCount = [0,0];
                    getChilds.forEach(child => {
                          if (child.children[0].checked) isTrueCount[0]++;
                    });
                    if(isTrueCount[0] === getChilds.length) getParentId.children[0].checked = true
                    else getParentId.children[0].checked = false
                    while (!!getParentId.parentNode.parentNode.id){
                        getParentId = getParentId.parentNode.parentNode
                        const getChilds =  Array.from(getParentId.children[1].children);
                        let isTrueCount = [0,0];
                        getChilds.forEach(child => {
                              if (child.children[0].checked) isTrueCount[0]++;
                        });
                        if(isTrueCount[0] === getChilds.length) getParentId.children[0].checked = true;
                        else getParentId.children[0].checked = false
                    }
                        
                    "></li>`, "text/html").body.firstChild);
            });
            this.depCode.forEach((v1, i1) => {
                this.depCode.forEach((v2, i2) => {
                    if (htmlList[v1].id !== htmlList[v2].id) {
                        if (htmlList[v1].id === htmlList[v2].className) {
                            htmlList[v1].children[1].appendChild(htmlList[v2]);
                        }
                    }
                });
                if (this.upDepCode[i1] === "") {
                    this.top = v1;
                }
            });
            htmlTags.children[1].children[0].appendChild(htmlList[this.top]);
            return htmlTags;
        };

        const listCheck = async () => {
            await axios
                .get("/chartSelect", {params: {code}})
                .then((response) => {
                    this.depCode = response.data[0];
                    this.upDepCode = response.data[1];
                    this.empCode = response.data[2];
                    this.empName = response.data[3];
                    this.empDepCode = response.data[4];
                })
                .catch((error) => console.log(error));
            this.returnList2 = "";
            this.returnList2 = depLayout();
        };
        listCheck();
        return this.returnList2;
    }

    static async RClickWindow(newWindowPosX, newWindowPosY, target) {
        const RClickWindowSelect = async () => {
            const params = {code: target};
            await axios
                .get("/RClickWindowSelect", {params})
                .then((response) => {
                    this.mail = response.data[0];
                    this.PH = response.data[1];
                })
                .catch((error) => console.log(error));
        };
        await RClickWindowSelect();
        return [this.mail, this.PH];
    }

    static async noticeList(code) {
        const dataSet = async () => {
            await axios
                .get("/noticeListSelect1", {params: {code}})
                .then((response) => {
                    this.noticeNum = response.data[0];
                    this.title = response.data[1];
                    this.content = response.data[2];
                    this.startDate = response.data[3];
                    this.targetState = response.data[4];
                    this.endDate = response.data[5];
                    //console.log(this.noticeNum,this.title,this.content,this.startDate,this.endDate,this.targetState)
                })
                .catch((error) => console.log(error));

            await axios
                .get("/noticeListSelect2", {params: {code}})
                .then((response) => {
                    this.targets = response.data;
                })
                .catch((error) => console.log(error));

            return {
                noticeNum: this.noticeNum,
                title: this.title,
                content: this.content,
                startDate: this.startDate,
                targetState: this.targetState,
                endDate: this.endDate,
                targets: this.targets,
            };
        };
        const res = await dataSet();
        let htmlList = "";
        let index = 0;

        for (const item of this.noticeNum) {
            if (typeof this.startDate[index] === "string") {
                htmlList += `<div id="${item}" class="text-xs border break-words testEvent"><p>${res.title[index]}</p><p>${res.startDate[index].split("T")[0]}~${res.endDate[index].split("T")[0]}</p><p>${res.targetState[index] === "0" ? "확인안함" : "확인함"}</p></div>`;
            }
            index++;
        }
        this.returnList3 = htmlList;
        return `<div class="h-[390px] overflow-y-auto">
                ${this.returnList3}
            </div>`;
    }

    static async loadNotice(code) {
        this.title = "";
        this.startDate = "";
        this.endDate = "";
        this.content = "";
        this.targets = "";
        if (!!code) {
            await axios
                .get("/loadNoticeSelect", {params: {code}})
                .then((response) => {
                    this.title = response.data[0];
                    this.startDate = response.data[1][0].split("T")[0];
                    this.endDate = response.data[2][0].split("T")[0];
                    this.content = response.data[3];
                    this.targets = response.data[4];
                    //console.log(this.title, this.startDate,this.endDate, this.content, this.targets)
                })
                .catch((error) => console.log(error));
        }
        return `
            <div class = "border h-[210px]" >
                <div class = "border w-[100%] h-[25px]">${this.title}</div>
                <div class="border w-[100%] h-[25px]">${this.startDate}~${this.endDate}</div>
                <div class="border w-[100%] h-[160px]">${this.content}</div>
            </div>
            <div class="border h-[180px]"></div>
            `;
    }

    static noticeWritePage(code, setBtnCtl) {
        this.WorkerList2(code);
        if (!this.returnList2) return setBtnCtl(3);
        return <>{<div dangerouslySetInnerHTML={{__html: this.returnList2.outerHTML}}/>}</>;
    }

    static noticeInsert(code) {
        let isNotNull = 0;
        if (this.data.length === 0) {
            alert("공지사항을 입력해주세요");
        } else {
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i] === "") {
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
                const topParent = document.getElementById("topUL");

                topParent.querySelectorAll("input").forEach((tag) => {
                    if (tag.checked && !!tag.parentNode.getAttribute("data-value")) {
                        this.data[3] += tag.parentNode.getAttribute("data-value") + ":0,";
                    }
                });
                if (this.data[3] === "") {
                    alert("대상자가 없습니다");
                    isNotNull++;
                }
                if (isNotNull === 0) {
                    console.log(this.data);
                    const jsonData = {
                        empCode: code,
                        title: this.data[0],
                        content: this.data[2],
                        targets: this.data[3],
                        endDate: new Date(this.data[1]).toISOString(),
                    };
                    axios
                        .post("/noticeInsert", jsonData)
                        .then((response) => {
                        })
                        .catch((error) => console.log(error));
                }
            }
        }
    }

    static async noticeUpdate(noticeNum, code) {
        const jsonData = {
            noticeNum: noticeNum, empCode: code, state: "1",
        };
        await axios
            .post("/noticeUpdate", jsonData)
            .then((response) => {
            })
            .catch((error) => {
            });
    }

    static async addressBook(code, keyWord) {
        let depCode = [];
        let empName = [];
        let posCode = [];
        let PH = [];
        let mail = [];
        const userAddListSet = async () => {
            await axios
                .get("/addressBookListSelect", {params: {code}})
                .then((response) => {
                    this.codeList = response.data[0];
                })
                .catch((error) => console.log(error));
        };
        let nonCompliant = [];
        const ListDataSet = async () => {
            for (const v1 of this.codeList) {
                await axios
                    .get("/addressBookSelect", {params: {code: v1, keyWord: keyWord}})
                    .then((response) => {
                        if (response.data[0][0]) {
                            nonCompliant.push(v1);
                        }
                        depCode.push(response.data[0]);
                        empName.push(response.data[1]);
                        posCode.push(response.data[2]);
                        PH.push(response.data[3]);
                        mail.push(response.data[4]);
                    })
                    .catch((error) => console.log(error));
            }
        };
        await userAddListSet();
        await ListDataSet();
        let htmlList = "";

        this.codeList.forEach((v1, i1) => {
            if (nonCompliant.includes(v1)) {
                htmlList += `<div id="Add${v1}" class="text-xs border break-words"><p>부서: ${depCode[i1]}</p><p>이름: ${empName[i1]}</p><p class="flex justify-between">직급: ${posCode[i1]}<button class="AddBtn">삭제</button></p><p>전화번호: ${PH[i1]}</p><p>메일: ${mail[i1]}</p></div>`;
            }
        });
        return `
            <div>
                <input class="border w-[100%] h-[30px] InputAddressBookSearch" placeholder="여기에 키워드 검색" value="${keyWord}">
            </div>
            <div class="h-[325px] overflow-y-auto">
                ${htmlList}
            </div>
            <div class="h-[80px]">
                <div class="flex">
                    <div
                        class="border text-xs flex items-center pl-1 w-[30%]"> 아이디
                    </div>
                    <input class="border w-[70%] InputAddressBookAdd"/>
                </div>
                <div class="flex">
                    <div
                        class="border text-xs flex items-center pl-1 w-[30%]"> 연락처
                    </div>
                    <input class="border w-[70%] InputAddressBookAdd"/>
                </div>
                <button class="text-center border w-full BtnAddressBookAdd">주소록에 추가 하기
                </button>
            </div>
        `;
    }

    static async addressBookDelete(target, code) {
        const jsonData = {
            target: target, code: code,
        };
        await axios
            .post("/addressBookDelete", jsonData)
            .then((response) => {
            })
            .catch((error) => {
            });
    }

    static async addressBookAdd(target, code) {
        const jsonData = {
            target: target, code: code,
        };
        await axios
            .post("/addressBookAdd", jsonData)
            .then((response) => {
            })
            .catch((error) => {
            });
    }

    static async addressTargetSelect(code, ph) {
        let isFound = false;
        await axios
            .get("/addressBookSelect", {params: {code}})
            .then((response) => {
                if (response.data[3][0] === ph) {
                    isFound = true;
                }
            })
            .catch((error) => console.log(error));
        return isFound;
    }

    static async addressEmpAddSelect(code, target) {
        let isTrue = false;
        await axios
            .get("/addressBookListSelect", {params: {code}})
            .then((response) => {
                response.data[0].forEach((v1, i1) => {
                    if (v1 === target) {
                        isTrue = true;
                    }
                });
            })
            .catch((error) => console.log(error));
        return isTrue;
    }

    static WorkerList3(code) {
        const depLayout = () => {
            let htmlList = {};
            this.top = "";

            this.depCode.forEach((v1, i1) => {
                const htmlTag = new DOMParser().parseFromString(`<li id=${v1} class=${this.upDepCode[i1]} style="list-style-type: none">${v1}<ul class="list-disc pl-5"></ul></li>`, "text/html").body.firstChild;
                htmlList[htmlTag.id] = htmlTag;
            });

            this.empDepCode.forEach((v1, i1) => {
                htmlList[v1].children[0].appendChild(new DOMParser().parseFromString(`<li class="${this.empDepCode[i1]} worker2 w-[65px]" data-value=${this.empCode[i1]}><span>${this.empName[i1]}</span></li>`, "text/html").body.firstChild);
            });
            this.depCode.forEach((v1, i1) => {
                this.depCode.forEach((v2, i2) => {
                    if (htmlList[v1].id !== htmlList[v2].id) {
                        if (htmlList[v1].id === htmlList[v2].className) {
                            htmlList[v1].children[0].appendChild(htmlList[v2]);
                        }
                    }
                });
                if (this.upDepCode[i1] === "") {
                    this.top = v1;
                }
            });

            return htmlList[this.top];
        };

        const listCheck = async () => {
            await axios
                .get("/chartSelect", {params: {code}})
                .then((response) => {
                    this.depCode = response.data[0];
                    this.upDepCode = response.data[1];
                    this.empCode = response.data[2];
                    this.empName = response.data[3];
                    this.empDepCode = response.data[4];
                })
                .catch((error) => console.log(error));
            this.returnList = "";
            this.returnList = depLayout();
        };

        listCheck();
        return (<div className="h-[100%] overflow-y-auto">
            <ul className="list-disc pl-5">{<div
                dangerouslySetInnerHTML={{__html: this.returnList.outerHTML}}/>}</ul>
        </div>);
    }

    static async chatListLoad(code){
        let chatNum = []
        let lastChat = []
        let chatList = []
        await axios
            .get("/myChatList", {params: {code}})
            .then((response) => {
                chatNum = response.data[0]
                lastChat = response.data[1]
            })
            .catch((error) => console.log(error));


        chatNum.forEach((v1,i1)=>{
            chatList += `<div class="border flex justify-between chatListDiv"><button class="chatInBtn w-[300px]" data-value=${v1}>${lastChat[i1]}</button><button class="chatDeleteBtn w-[50px]" data-value=${v1}>나가기</button></div>`
        })

        const chatInviteList = await ListLibrary.chatMemList1(code);

        const chatInviteListHtml = chatInviteList.outerHTML;
        return `
            <div class="h-[100%]">
                <div class="h-[390px] overflow-y-auto chatListFrameDiv">
                   ${chatList}
                </div>
                <div class="h-[390px] overflow-y-auto chatInviteListDiv hidden">
                   ${chatInviteListHtml}
                </div>
                <div class="flex h-[30px] w-[100%] chatInviteListInput hidden"><input class="border h-[100%] w-[70%]"><button class="border h-[100%] w-[30%]">id로초대</button></div>
                <button class="border w-[100%] h-[45px] chatListAddBtn1">대화방 추가</button>
                <button class="border w-[100%] h-[45px] chatListAddBtn2 hidden">대화인원 추가</button>
            </div>
        `;
    }

    static async chatIn(code, chatNum) {
        if (chatNum !== "") {

            let htmlList = ""
            if (htmlList === "") {
                return await this.chatLoad(code, chatNum)
            } else {
                return htmlList
            }
        }else{
            console.log("stop")
        }
    }

    static async chatLoad(code, chatNum) {
        let messages = []
        let writer = []
        let writerInfo = []
        const dataSet1 = async () => {
            await axios
                .get("/chatInSelect1", {params: {chatNum: chatNum}})
                .then((response) => {
                    //content
                    writer = response.data[0]
                    messages = response.data[1];
                })
                .catch((error) => console.log(error));
        }
        const dataSet2 = async () => {
            if (writer !== null) {
                for (const v1 of writer) {
                    await axios
                        .get("/chatInSelect4", {params: {code: v1[0]}})
                        .then((response) => {
                            writerInfo.push(response.data)
                        })
                        .catch((error) => console.log(error));
                }
            }
        }
        await dataSet1();
        await dataSet2();
        let htmlList = "";
        messages.forEach((v1, i1) => {
            if (writer[i1][0] === code) {
                htmlList += `<ul class="pb-2 flex flex-col justify-start items-end"><li>${writerInfo[i1][0][0]} ${writerInfo[i1][0][1]}</li><li class="mr-5 inline-block border px-3 py-2 max-w-max">${v1}</li></ul>`
            } else {
                htmlList += `<ul class="pb-2 flex flex-col justify-start"><li>${writerInfo[i1][0][0]} ${writerInfo[i1][0][1]}</li><li class="ml-5 inline-block border px-3 py-2 max-w-max">${v1}</li></ul>`;
            }
        });
        return htmlList
    }

    static async chatinput(code, value, chatNum) {
        const chatAdd = async () => {
            await axios
                .post("/chatInUpdate1", {
                    chatNum: chatNum,
                    chatContent: `${code}:${value}_${new Date().toISOString().replace('T', ' ').replace('Z', '').slice(0, 23)}_1_0`
                })
                .then((response) => {
                })
                .catch((error) => console.log(error));
        }
        await chatAdd();
    }

    static async chatMemList1(code){
        const depLayout = () => {
            let htmlList = {};
            const htmlTags = new DOMParser().parseFromString(`
                    <div class="border h-[390px] here overflow-y-auto"><ul class="list-disc pl-5"></ul></div>
            `, "text/html").body;

            this.depCode.forEach((v1, i1) => {
                const htmlTag = new DOMParser().parseFromString(`<li id=${v1} class=${this.upDepCode[i1]} style="list-style-type: none">${v1}<input id="${v1}Btn" type="checkbox" onchange="
                    let getParentId = document.getElementById('${v1}');
                    let getChildList = document.getElementById('${v1}');
                    ListLibrary.findChildren(getChildList,getParentId.children[0].checked);
                    
                    while (!!getParentId.parentNode.parentNode.id){
                        getParentId = getParentId.parentNode.parentNode
                        const getChilds =  Array.from(getParentId.children[1].children);
                        let isTrueCount = [0];
                        getChilds.forEach(child => {
                              if (child.children[0].checked) isTrueCount[0]++;
                        });
                        if(isTrueCount[0] === getChilds.length) getParentId.children[0].checked = true;
                        else getParentId.children[0].checked = false
                    }
                    "><ul class="list-disc pl-5"></ul></li>`, "text/html").body.firstChild;
                htmlList[htmlTag.id] = htmlTag;
            });

            this.empDepCode.forEach((v1, i1) => {
                htmlList[v1].children[1].appendChild(new DOMParser().parseFromString(`<li class="${this.empDepCode[i1]} worker w-[65px]" data-value=${this.empCode[i1]}>${this.empName[i1]}<input type="checkbox"${this.empCode[i1] === code ? 'checked="checked"' : ''} ${this.empCode[i1] === code ? 'disabled="disabled"' : ''} onchange="
                    let getParentId = document.getElementById('${v1}')
                    const getChilds = Array.from(getParentId.getElementsByClassName('${v1}'));
                    let isTrueCount = [0];
                    getChilds.forEach(child => {
                          if (child.children[0].checked) isTrueCount[0]++;
                    });
                    if(isTrueCount[0] === getChilds.length) getParentId.children[0].checked = true
                    else getParentId.children[0].checked = false
                    while (!!getParentId.parentNode.parentNode.id){
                        getParentId = getParentId.parentNode.parentNode
                        const getChilds =  Array.from(getParentId.children[1].children);
                        let isTrueCount = [0];
                        getChilds.forEach(child => {
                              if (child.children[0].checked) isTrueCount[0]++;
                        });
                        if(isTrueCount[0] === getChilds.length) getParentId.children[0].checked = true;
                        else getParentId.children[0].checked = false
                    }
                    "></li>`, "text/html").body.firstChild);
            });
            this.depCode.forEach((v1, i1) => {
                this.depCode.forEach((v2, i2) => {
                    if (htmlList[v1].id !== htmlList[v2].id) {
                        if (htmlList[v1].id === htmlList[v2].className) {
                            htmlList[v1].children[1].appendChild(htmlList[v2]);
                        }
                    }
                });
                if (this.upDepCode[i1] === "") {
                    this.top = v1;
                }
            });
            htmlTags.children[0].appendChild(htmlList[this.top]);
            return htmlTags;
        };


        const listCheck = async () => {
            await axios.get("/chartSelect", { params: { code } })
                .then((response) => {
                    this.depCode = response.data[0];
                    this.upDepCode = response.data[1];
                    this.empCode = response.data[2];
                    this.empName = response.data[3];
                    this.empDepCode = response.data[4];
                })
                .catch((error) => console.log());
            return depLayout();
        };

        return await listCheck();
    }

    static async chatMemList2(code,chatNum){
        let memList = new Map();
        const memListSet = async () => {
            await axios
                .get("/chatInSelect2", {params: {chatNum}})
                .then((response) => {
                    //memList
                    memList = new Map(response.data.map(item => [item, ""]));
                })
                .catch((error) => console.log(error));
        }
        await memListSet()
        const depLayout = () => {
            let htmlList = {};
            const htmlTags = new DOMParser().parseFromString(`
                    <div class="border h-[390px] here overflow-y-auto chatMemList2Div"><ul class="list-disc pl-5"></ul></div>
            `, "text/html").body;

            this.depCode.forEach((v1, i1) => {
                const htmlTag = new DOMParser().parseFromString(`<li id=${v1} class=${this.upDepCode[i1]} style="list-style-type: none">${v1}<input id="${v1}Btn" type="checkbox" onchange="
                    let getParentId = document.getElementById('${v1}');
                    let getChildList = document.getElementById('${v1}');
                    ListLibrary.findChildren(getChildList,getParentId.children[0].checked);
                    
                    while (!!getParentId.parentNode.parentNode.id){
                        getParentId = getParentId.parentNode.parentNode
                        const getChilds =  Array.from(getParentId.children[1].children);
                        let isTrueCount = [0];
                        getChilds.forEach(child => {
                              if (child.children[0].checked) isTrueCount[0]++;
                        });
                        if(isTrueCount[0] === getChilds.length) getParentId.children[0].checked = true;
                        else getParentId.children[0].checked = false
                    }
                    "><ul class="list-disc pl-5"></ul></li>`, "text/html").body.firstChild;
                htmlList[htmlTag.id] = htmlTag;
            });

            this.empDepCode.forEach((v1, i1) => {
                htmlList[v1].children[1].appendChild(new DOMParser().parseFromString(`<li class="${this.empDepCode[i1]} worker w-[65px]" data-value=${this.empCode[i1]}>${this.empName[i1]}<input ${memList.get(this.empCode[i1]) === "" ? 'checked="checked"' : ''}
                ${memList.get(this.empCode[i1])=== ""  ? 'disabled="disabled"' : ''}  type="checkbox" onchange="
                    let getParentId = document.getElementById('${v1}')
                    const getChilds = Array.from(getParentId.getElementsByClassName('${v1}'));
                    let isTrueCount = [0];
                    getChilds.forEach(child => {
                          if (child.children[0].checked) isTrueCount[0]++;
                    });
                    if(isTrueCount[0] === getChilds.length) getParentId.children[0].checked = true
                    else getParentId.children[0].checked = false
                    while (!!getParentId.parentNode.parentNode.id){
                        getParentId = getParentId.parentNode.parentNode
                        const getChilds =  Array.from(getParentId.children[1].children);
                        let isTrueCount = [0];
                        getChilds.forEach(child => {
                              if (child.children[0].checked) isTrueCount[0]++;
                        });
                        if(isTrueCount[0] === getChilds.length) getParentId.children[0].checked = true;
                        else getParentId.children[0].checked = false
                    }
                    "></li>`, "text/html").body.firstChild);
            });
            this.depCode.forEach((v1, i1) => {
                this.depCode.forEach((v2, i2) => {
                    if (htmlList[v1].id !== htmlList[v2].id) {
                        if (htmlList[v1].id === htmlList[v2].className) {
                            htmlList[v1].children[1].appendChild(htmlList[v2]);
                        }
                    }
                });
                if (this.upDepCode[i1] === "") {
                    this.top = v1;
                }
            });
            htmlTags.children[0].appendChild(htmlList[this.top]);
            return htmlTags.outerHTML;
        };


        const listCheck = async () => {
            await axios.get("/chartSelect", { params: { code } })
                .then((response) => {
                    this.depCode = response.data[0];
                    this.upDepCode = response.data[1];
                    this.empCode = response.data[2];
                    this.empName = response.data[3];
                    this.empDepCode = response.data[4];
                })
                .catch((error) => console.log(error));
            return depLayout();
        };

        return await listCheck();
    }

    static async chatAdd1(code,members){
        const chatData = {
            members : members,
            code: code,
        }

        await axios
            .post("/chatAdd1", chatData)
            .then((response) => {
            })
            .catch((error) => console.log(error));
    }
    static async chatAdd2(chatNum,members){
        const chatData = {
            members : members,
            chatNum: chatNum,
        }

        await axios
            .post("/chatAdd2", chatData)
            .then((response) => {
            })
            .catch((error) => console.log(error));
    }
    static async chatOut(code,chatNum){
        const chatData = {
            code : code,
            chatNum: chatNum,
        }

        await axios
            .post("/chatOut", chatData)
            .then((response) => {
            })
            .catch((error) => console.log(error));
    }

    static async empCodeCheck(code){
        let empCode = "";
        const dataSet = async () => {
            await axios
                .get("/empCodeCheck", { params: { code } })
                .then((response) => {
                    empCode = response.data
                    console.log(response.data)
                })
                .catch((error) => console.log(error));
        }
        await dataSet();

        return empCode;
    }
    static async empCodeCheck2(code,chatNum){
        let isTrue = false;
        const dataSet = async () => {
            await axios
                .get("/empCodeCheck2", { params: { code: code, chatNum: chatNum} })
                .then((response) => {
                    isTrue = response.data
                    console.log(response.data)
                })
                .catch((error) => console.log(error));
        }
        await dataSet();
        return isTrue;
    }

    static async chatDataSet(chatNum) {
        await axios
            .get("/chatInSelect1", {params: {chatNum}})
            .then((response) => {
                //content
                console.log(response.data)
            })
            .catch((error) => console.log(error));
        await axios
            .get("/chatInSelect2", {params: {chatNum}})
            .then((response) => {
                //memList
                console.log(response.data)
            })
            .catch((error) => console.log(error));
        await axios
            .get("/chatInSelect3", {params: {chatNum}})
            .then((response) => {
                //speaker
                console.log(response.data)
            })
            .catch((error) => console.log(error));
    }

    static async dataTest1(code) {
        await axios
            .get("/addressBookSelect", {params: {code}})
            .then((response) => {
            })
            .catch((error) => console.log(error));
        return "";
    }

    static async dataTest2(code) {
        await axios
            .get("/addressBookListSelect", {params: {code}})
            .then((response) => {
            })
            .catch((error) => console.log(error));
        return "";
    }

    static async dataTest3(target, code) {
        const jsonData = {
            target: target, code: code,
        };
        await axios
            .post("/addressBookAdd", jsonData)
            .then((response) => {
            })
            .catch((error) => {
            });
        return "";
    }

    static async dataTest4(target, code) {
        const jsonData = {
            target: target, code: code,
        };
        await axios
            .post("/addressBookDelete", jsonData)
            .then((response) => {
            })
            .catch((error) => {
            });
        return "";
    }
}

window.ListLibrary = ListLibrary;
export default ListLibrary;
