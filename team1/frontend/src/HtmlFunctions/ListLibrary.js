import React from "react";

class ListLibrary {
    static testData1 = ["배럭", "테란", "마린", "팩토리", "탱크", "벌처", "매딕", "파벳", "고스트", "스타포트", "레이스", "드랍쉽", "프로토스", "스타"];
    static testData2 = ["테란", "스타", "배럭", "테란", "팩토리", "팩토리", "배럭", "배럭", "배럭", "테란", "스타포트", "스타포트","스타",""];
    static testData3 = {};
    static testData4 = ["1234-1234","1234-1234","1234-1234","1234-1234","1234-1234","1234-1234"]
    static testData5 = ["홍길동","아무개","사람인","잡코리아","넥스트","아이티"]
    static testData6 = ["마린","마린","마린","탱크","매딕","탱크"]
    static list1 = "";
    static list2 = "";
    static top = ""
    static WorkerList() {
        // 절대 지우지 마시오.
        // const navigation = (topData, parent) => {
        //     this.testData2.forEach((v1, i1) => {
        //         if (topData === v1) {
        //             if (this.testData3[this.testData1[i1]] !== parent && parent !== "") {
        //                 this.testData3[this.testData1[i1]] = parent + this.testData1[i1] + ",";
        //             } else {
        //                 this.testData3[this.testData1[i1]] += this.testData1[i1] + ",";
        //             }
        //             navigation(this.testData1[i1], this.testData3[this.testData1[i1]]);
        //         }
        //     });
        // }
        // 절대 지우지 마시오.

        const reversePath = () => {
            let htmlList = {};
            this.top = ""
            this.testData1.forEach((v1, i1) => {
                const htmlTag = new DOMParser().parseFromString(`<li id=${v1} class=${this.testData2[i1]}>${v1}<ul class="list-disc pl-5"></ul></li>`, 'text/html').body.firstChild;
                htmlList[htmlTag.id] = htmlTag;
            })
            this.testData6.forEach((v1,i1)=>{
                htmlList[v1].children[0].appendChild(new DOMParser().parseFromString(`<li class=${this.testData6[i1]} value=${this.testData4[i1]}>${this.testData5[i1]}</li>`, 'text/html').body.firstChild)
            })
            this.testData1.forEach((v1, i1) => {
                this.testData1.forEach((v2, i2) => {
                    if (htmlList[v1].id !== htmlList[v2].id) {
                        if (htmlList[v1].id === htmlList[v2].className) {
                            htmlList[v1].children[0].appendChild(htmlList[v2])
                        }
                    }
                });
                if (this.testData2[i1] === "") {
                    this.top = v1
                }
            })

            console.log()

            return htmlList[this.top]
        }

        const listCheck = () => {
            this.list1 = "";
            this.list2 = "";
            this.testData3 = {};

            this.testData1.forEach((v1, i1) => {
                if (!this.testData2[i1]) {
                    this.testData1.forEach((v2, i2) => {
                        this.testData3[v2] = v1 + ",";
                    });
                    // 절대 지우지 마시오.
                    //this.testData3[v1] = "";
                    // navigation(v1, this.testData3[v1]);
                    // 절대 지우지 마시오.
                }
            });
            this.list1 = reversePath()
            console.log(this.testData3);
            return <div dangerouslySetInnerHTML={{__html: this.list1.outerHTML}}/>;
        }

        return (
            <div className="h-[100%] overflow-y-auto">
                <ul className="list-disc pl-5">
                        {listCheck()}
                </ul>
            </div>
        );
    }
}

export default ListLibrary;
