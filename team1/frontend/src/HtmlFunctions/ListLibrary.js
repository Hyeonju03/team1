import React from "react";
import axios from "axios";

class ListLibrary {
    static depCode = [];
    static upDepCode = [];
    static empCode = [];
    static empName = [];
    static empDepCode = [];
    static returnList = "";
    static top = ""

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

        const reversePath = () => {
            let htmlList = {};
            this.top = ""
            this.depCode.forEach((v1, i1) => {
                const htmlTag = new DOMParser().parseFromString(`<li id=${v1} class=${this.upDepCode[i1]} style="list-style-type: none">${v1}<ul class="list-disc pl-5"></ul></li>`, 'text/html').body.firstChild;
                htmlList[htmlTag.id] = htmlTag;
            })

            this.empDepCode.forEach((v1, i1) => {
                //console.log(this.depCode, this.upDepCode, this.empCode, this.empName,this.empDepCode)
                htmlList[v1].children[0].appendChild(new DOMParser().parseFromString(`<li class=${this.empDepCode[i1]} value=${this.empCode[i1]}>${this.empName[i1]}</li>`, 'text/html').body.firstChild)
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
            //this.testData3 = {};

            this.depCode.forEach((v1, i1) => {
                if (!this.upDepCode[i1]) {
                    this.depCode.forEach((v2, i2) => {
                        //this.testData3[v2] = v1 + ",";
                    });
                    // 절대 지우지 마시오.
                    //this.testData3[v1] = "";
                    // navigation(v1, this.testData3[v1]);
                    // 절대 지우지 마시오.
                }
            });
            this.returnList = reversePath()
        }
        listCheck()
        return (
            <div className="h-[100%] overflow-y-auto">
                <ul className="list-disc pl-5">
                    {<div dangerouslySetInnerHTML={{__html: this.returnList.outerHTML}}/>}
                </ul>
            </div>
        );
    }
}

export default ListLibrary;
