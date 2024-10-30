import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertTriangle } from 'lucide-react';

export default function SignUpForm() {
    const [empNum, setEmpNum] = useState("");
    const [comCode, setComCode] = useState("");
    const [comInfo, setComInfo] = useState([]);
    const navigate = useNavigate();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [showMessage,setShowMessage] = useState(false)

    useEffect(() => {
        // 로그인 후 empCode를 설정하는 로직
        const fetchEmpCode = async () => {
            const loggedInEmpCode = "3118115625-cjm"; // 로그인 후 받아온 empCode
            const comCode = loggedInEmpCode.split("-")[0];
            setComCode(comCode);
        };
        fetchEmpCode();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/selectComList", { params: { comCode: comCode } });
                console.log(response);
                setComInfo(response.data);
                const userNum = response.data.map(v=>v.empNum)
                setEmpNum(userNum)
            } catch (error) {
                console.error(error);
            }
        };
        if (comCode) {
            fetchData();
        }
    }, [comCode]);

    useEffect(() => {
        const fetchData = async ()=>{
            try {
                const response = await axios.get("/selectStatus", {params: {comCode: comCode}});
                console.log("우엥?",response);

                if (response.data === 1) {
                    setShowMessage(false);
                }else {
                    setShowMessage(true)
                }
            } catch (error){
                console.error(error)
            }
        }
        if(comCode){
            fetchData();
        }
    }, [comCode]);

    // 날짜 변환
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = String(date.getFullYear());
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // YYYY-MM-DD 형식으로 반환
    };

    // 전화번호
    const handlePhoneNumberChange = (index, value) => {
        const formattedValue = value
            .replace(/[^0-9]/g, '') // 숫자 이외의 문자 제거
            .replace(/(\d{3})(\d)/, '$1-$2') // 첫 3자리 뒤에 대시 추가
            .replace(/(\d{4})(\d)/, '$1-$2') // 다음 3자리 뒤에 대시 추가
            .replace(/(-\d{4})\d+/, '$1'); // 마지막 4자리 제한
        const newComInfo = [...comInfo];
        newComInfo[index].contectPhone = formattedValue;
        setComInfo(newComInfo);
    };

    // 이메일
    const handleEmailChange = (index, value) => {
        const newComInfo = [...comInfo];
        newComInfo[index].comEmail = value;

        // 이메일 유효성 검사
        if (!emailRegex.test(value)) {
            console.warn("유효하지 않은 이메일 주소입니다.");
        }

        setComInfo(newComInfo);
    };

    const goUpdate = async (e) => {
        e.preventDefault();

        // 업데이트할 데이터 준비
        const updatedData = comInfo.map(v => ({
            comName: v.comName,
            ceoName: v.ceoName,
            contectPhone: v.contectPhone,
            comEmail: v.comEmail,
            comCode: v.comCode
        }));

        console.log(updatedData)

        try {
            await axios.put("/updateInfo", updatedData);
            console.log("업데이트 성공!");
        } catch (error) {
            console.error("업데이트 실패:", error);
        }
    };

    console.log(comCode)
    const goPayMent =()=>{
        navigate("/PaymentCom",{state:{empNum:empNum , comCode:comCode}});
    }
    return (
        <form onSubmit={goUpdate}>
            <div className="w-full">
                <h2 className="text-2xl font-bold text-center bg-gray-200 py-2"
                    style={{marginBottom: "30px"}}>로고</h2>
            </div>
            <div className=" max-w-4xl mx-auto p-4 rounded-lg">
                <div style={{marginBottom: "30px"}}>
                    <p className="text-sm text-left">회사정보 관리</p>
                    <p className="text-sm text-left">회사 정보를 확인하고 수정합니다.</p>
                </div>
                {comInfo.map((v, i) => (
                    <div className="text-left" key={i} style={{marginBottom: "30px"}}>
                        <p className="flex" style={{marginBottom: "30px"}}>회사명:
                            <input
                                id="comName"
                                name="comName"
                                placeholder={v.comName}
                                className="border"
                                style={{marginLeft: "83px", width: "80%"}}
                                value={v.comName}
                                onChange={(e) => {
                                    const newComInfo = [...comInfo];
                                    newComInfo[i].comName = e.target.value;
                                    setComInfo(newComInfo);
                                }}
                            />
                        </p>
                        <div className="flex">
                            <p style={{marginBottom: "30px"}}>사업자등록번호: </p>
                            <p style={{marginLeft: "20px"}}>{v.comCode}</p>
                        </div>
                        <p style={{marginBottom: "30px"}}>대표자:
                            <input
                                id="ceoName"
                                name="ceoName"
                                placeholder={v.ceoName}
                                className="border"
                                style={{marginLeft: "83px", width: "80%"}}
                                value={v.ceoName}
                                onChange={(e) => {
                                    const newComInfo = [...comInfo];
                                    newComInfo[i].ceoName = e.target.value;
                                    setComInfo(newComInfo);
                                }}
                            />
                        </p>
                        <p className="flex" style={{marginBottom: "30px"}}>대표번호:
                            <p style={{marginLeft: "70px"}}>{v.ceoPhone}</p>
                        </p>
                        <p style={{marginBottom: "30px"}}>전화번호:
                            <input
                                id="contectPhone"
                                name="contectPhone"
                                placeholder={v.contectPhone}
                                className="border"
                                style={{marginLeft: "65px", width: "80%"}}
                                onChange={(e) => handlePhoneNumberChange(i, e.target.value)}
                                value={v.contectPhone}
                            />
                        </p>
                        <p style={{marginBottom: "30px"}}>이메일:
                            <input
                                id="comEmail"
                                name="comEmail"
                                placeholder={v.comEmail}
                                className="border"
                                style={{marginLeft: "80px", width: "80%"}}
                                onChange={(e) => handleEmailChange(i, e.target.value)}
                                value={v.comEmail}
                            />
                        </p>
                        <div className="flex items-center mb-4">
                            <p>직원수:</p>
                            <p style={{marginLeft: "80px"}} className="ml-4">{v.empNum}</p>
                            {v.empNum > 10 && showMessage && (
                                <div
                                    className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-md ml-4 flex items-center">
                                    <AlertTriangle className="h-5 w-5 mr-2"/>
                                    <span onClick={goPayMent} className="cursor-pointer">주의: 직원 수가 10명을 초과하였습니다. 계속하려면 결제가 필요합니다.</span>
                                </div>
                            )}
                        </div>

                        <p className="flex" style={{marginBottom: "20px"}}>등록일자:
                            <p style={{marginLeft: "65px"}}>{formatDate(v.registerDate)}</p>
                        </p>
                    </div>
                ))}
                <div className="flex justify-center">
                    <button type="submit" style={{marginLeft: "10px"}} className="border rounded-md px-4 py-2">저장
                    </button>
                </div>
            </div>
        </form>
    );
}
