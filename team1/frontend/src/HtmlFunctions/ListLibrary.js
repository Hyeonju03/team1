import React from "react";
import axios from "axios";

class ListLibrary {
    static depCode = [];
    static upDepCode = [];
    static empCode = [];
    static empName = [];
    static empDepCode = [];
    static returnList = "";
    static returnList2 = "";
    static top = ""
    static RClick = false
    static mail = "";
    static PH = "";
    static state = "";
    static data = [];

    //static testData3 = {};


    static WorkerList(code) {
        // 절대 지우지 마시오.
        // const navigation = (topData, parent) => {
        //     this.upDepCode.forEach((v1, i1) => {
        //         if (topData === v1) {
        //             if (this.testData3[this.depCode[i1]] !== parent && parent !== "") {
        //                 this.testData3[this.depCode[i1]] = parent + this.depCode[i1] + ",";
        //             } else {
        //                 this.testData3[this.depCode[i1]] += this.depCode[i1] + ",";
        //             }
        //             navigation(this.depCode[i1], this.testData3[this.depCode[i1]]);
        //         }
        //     });
        // }
        // 절대 지우지 마시오.
        const depLayout = () => {

            let htmlList = {};
            this.top = ""

            this.depCode.forEach((v1, i1) => {
                const htmlTag = new DOMParser().parseFromString(`<li id=${v1} class=${this.upDepCode[i1]} style="list-style-type: none">${v1}<ul class="list-disc pl-5"></ul></li>`, 'text/html').body.firstChild;
                htmlList[htmlTag.id] = htmlTag;
            })

            this.empDepCode.forEach((v1, i1) => {
                htmlList[v1].children[0].appendChild(new DOMParser().parseFromString(`<li class="${this.empDepCode[i1]} worker w-[50px]" data-value=${this.empCode[i1]}>${this.empName[i1]}</li>`, 'text/html').body.firstChild)
            })
            this.depCode.forEach((v1, i1) => {
                this.depCode.forEach((v2, i2) => {
                    if (htmlList[v1].id !== htmlList[v2].id) {
                        if (htmlList[v1].id === htmlList[v2].className) {
                            htmlList[v1].children[0].appendChild(htmlList[v2])
                        }
                    }
                });
                if (this.upDepCode[i1] === "") {
                    this.top = v1
                }
            })

            return htmlList[this.top]
        }

        const listCheck = async () => {
            await axios.get("/chartSelect", code)
                .then(response => {
                    this.depCode = response.data[0]
                    this.upDepCode = response.data[1]
                    this.empCode = response.data[2]
                    this.empName = response.data[3]
                    this.empDepCode = response.data[4]
                })
                .catch(error => console.log(error));
            this.returnList = "";
            // 절대 지우지 마시오.
            //this.testData3 = {};
            // this.depCode.forEach((v1, i1) => {
            //     if (!this.upDepCode[i1]) {
            //         this.depCode.forEach((v2, i2) => {
            //             this.testData3[v2] = v1 + ",";
            //         });
            //         this.testData3[v1] = "";
            //         navigation(v1, this.testData3[v1]);
            //     }
            // });
            // 절대 지우지 마시오.
            this.returnList = depLayout()
        }
        listCheck();
        return (
            <div className="h-[100%] overflow-y-auto">
                <ul className="list-disc pl-5">
                    {<div dangerouslySetInnerHTML={{__html: this.returnList.outerHTML}}/>}
                </ul>
            </div>
        );
    }

    static WorkerList2(code, setBtnCtl) {
        const depLayout = () => {

            let htmlList = {};
            const htmlTags = new DOMParser().parseFromString(`
                    <div class="border h-[210px]">
                        <input class="border w-[100%] h-[25px]" placeholder="제목입력" onchange=""/>
                        <input type="date" class="border w-[100%] h-[25px]"/>
                        <textarea class="border w-[100%] h-[160px] resize-none" placeholder="내용입력"></textarea>
                    </div>
                    <div class="border h-[180px] here overflow-y-auto"><ul class="list-disc pl-5" id="topUL"></ul></div>
            `, 'text/html').body;

            let topParent = ""
            this.upDepCode.map((v1,i1) => {
                if(v1 === "") topParent = this.depCode[i1]
            })

            this.depCode.forEach((v1, i1) => {
                const htmlTag = new DOMParser().parseFromString(`<li id=${v1} class=${this.upDepCode[i1]} style="list-style-type: none">${v1}<input id="${v1}Btn" type="checkbox" onchange="
                    let getParentId = document.getElementById('${v1}');
                    while (!!getParentId.parentNode.parentNode.id){
                        getParentId = getParentId.parentNode.parentNode
                        const getChilds =  Array.from(getParentId.children[1].children);
                        let isTrueCount = [0,0];
                        getChilds.forEach(child => {
                              if (child.children[0].checked) isTrueCount[0]++;
                        });
                        if(isTrueCount[0] === getChilds.length) getParentId.children[0].checked = true;
                        else getParentId.children[0].checked = false
                         console.log('위',isTrueCount[0] === getChilds.length)
                    }
                    
                    
                    "><ul class="list-disc pl-5"></ul></li>`, 'text/html').body.firstChild;
                htmlList[htmlTag.id] = htmlTag;
            })

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
                        
                    "></li>`, 'text/html').body.firstChild)
            })
            this.depCode.forEach((v1, i1) => {
                this.depCode.forEach((v2, i2) => {
                    if (htmlList[v1].id !== htmlList[v2].id) {
                        if (htmlList[v1].id === htmlList[v2].className) {
                            htmlList[v1].children[1].appendChild(htmlList[v2])
                        }
                    }
                });
                if (this.upDepCode[i1] === "") {
                    this.top = v1
                }
            })
            htmlTags.children[1].children[0].appendChild(htmlList[this.top])
            return htmlTags
        }

        const listCheck = async () => {
            await axios.get("/chartSelect", code)
                .then(response => {
                    this.depCode = response.data[0]
                    this.upDepCode = response.data[1]
                    this.empCode = response.data[2]
                    this.empName = response.data[3]
                    this.empDepCode = response.data[4]
                })
                .catch(error => console.log(error));
            this.returnList2 = "";
            this.returnList2 = depLayout()

        }
        listCheck();
        return this.returnList2
    }

    static async RClickWindow(newWindowPosX, newWindowPosY, target) {
        const RClickWindowSelect = async () => {
            const params = {code: target}
            await axios.get("/RClickWindowSelect", {params})
                .then(response => {
                    this.mail = response.data[0]
                    this.PH = response.data[1]
                })
                .catch(error => console.log(error));
        }
        await RClickWindowSelect();
        return [this.mail, this.PH]
    }

    static noticeList(code, setBtnCtl) {
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

    static noticeListCreate(code, setBtnCtl) {
        this.WorkerList2(code, setBtnCtl)
        console.log(this.returnList2)
        if (!this.returnList2) return setBtnCtl(3)
        return <>{<div dangerouslySetInnerHTML={{__html: this.returnList2.outerHTML}}/>}</>
    }
}

export default ListLibrary;
