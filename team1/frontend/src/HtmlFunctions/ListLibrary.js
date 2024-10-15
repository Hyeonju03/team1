class ListLibrary {
    static testData1 = ["배럭", "테란", "마린", "팩토리", "탱크", "벌처", "매딕", "파벳", "고스트","스타포트","레이스","드랍쉽"];
    static testData2 = ["테란", "", "배럭", "테란", "팩토리", "팩토리", "배럭", "배럭", "배럭","테란","스타포트","스타포트"];
    static testData3 = {};
    static comName = "스타";
    static list1 = "";
    static list2 = "";

    static WorkerList() {
        const findFun = (topData, parent) => {
            this.testData2.forEach((v1, i1) => {
                if (topData === v1) {
                    if (this.testData3[this.testData1[i1]] !== parent && parent !== "") {
                        this.testData3[this.testData1[i1]] = parent + this.testData1[i1] + ",";
                    } else {
                        this.testData3[this.testData1[i1]] += this.testData1[i1] + ",";
                    }
                    findFun(this.testData1[i1], this.testData3[this.testData1[i1]]);
                }
            });
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
                    this.testData3[v1] = ""; // 초기값 설정
                    findFun(v1, this.testData3[v1]);
                }
            });

            console.log(this.testData3);
            return <div dangerouslySetInnerHTML={{ __html: this.list1 }} />;
        }

        return (
            <div className="h-[100%] overflow-y-auto">
                <ul className="list-disc pl-5">
                    <li>{this.comName}
                        {listCheck()}
                    </li>
                </ul>
            </div>
        );
    }
}

export default ListLibrary;
