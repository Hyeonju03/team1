import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import {ChevronDown, ChevronRight, Paperclip} from "lucide-react";

export default function SignDetail() {
    const navigate = useNavigate();
    const [isToggled, setIsToggled] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const {id} = useParams();
    const [sign, setSign] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState([]); // useState로 변경
    const [user, setUser] = useState(null);

    const empCode = "3118115625-jys1902";
    const comCode = "3118115625";

    useEffect(() => {
        // 결재선에 본인꺼 띄우기
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`/${empCode}`);
                if (!response.data) {
                    return;
                }
                setUser(response.data); // user 상태 업데이트
            } catch (error) {
                console.error(error);
            }
        };

        const fetchSignDetail = async () => {
            try {
                const response = await axios.get(`/sign/detail/${id}`);
                setSign(response.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            const response = await axios.get(`/code/${comCode}`);
            const uniqueCategories = [...new Set(response.data.map(category => category.signCateCode))];
            setCategories(uniqueCategories);
        };

        fetchUserInfo();
        fetchCategories();
        fetchSignDetail();
    }, [id]);

    useEffect(() => {
        if (!sign || !sign.target) {
            return;
        }

        const fetchUserDetails = async () => {
            const signUsers = sign.target.split(",");

            for (const signUser of signUsers) {
                const empUser = signUser.split(":")[0];
                const signList = signUser.split(":")[1].split("_")[1];

                try {
                    const response = await axios.get(`/${empUser}`);
                    const newUser = {
                        empCode: response.data.empCode,
                        name: response.data.empName,
                        dep: response.data.depCode,
                        pos: response.data.posCode,
                        sign: signList,
                    };

                    // userInfo에 새로운 사용자 추가
                    setUserInfo(prevUserInfo => {
                        // 중복 체크
                        if (!prevUserInfo.find(user => user.name === newUser.name)) {
                            return [...prevUserInfo, newUser];
                        }
                        return prevUserInfo; // 중복일 경우 이전 상태 반환
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        };

        fetchUserDetails();
    }, [sign]);


    if (loading) {
        return null;
    }

    if (!sign) {
        return null;
    }

    const formatDate = (dateString) => {
        return dateString.replace("T", " ").slice(0, 16);
    };

    const fileDownload = (blobData, fileName) => {
        const url = window.URL.createObjectURL(blobData);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
    };

    const handleDocumentDownload = async (sign) => {
        try {
            const response = await axios({
                method: "get",
                url: `/sign/download/${sign.signNum}`,
                responseType: "blob"
            });
            fileDownload(response.data, sign.fileOriginalName);
        } catch (e) {
            console.error(e);
        }
    };

    const consoleSignBtn = () => {
        let index;

        axios.get(`/sign/detail/${id}`)
            .then(response => {
                const targetList = response.data.target.split(",");
                targetList.map((target, targetIndex) => {
                    if(target.contains(empCode)) {
                        index = targetIndex;
                        target.split("")
                    }
                })
            })
            .catch(error => console.log(error));

        // axios.get(`/sign/update/${id}`)
        //     .then(response => {
        //         console.log("된건가")
        //     })
        //     .catch(error => console.log(error));
    };

    const handleHome = () => {
        navigate(`/sign`);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gray-200 p-4">
                <h1 className="text-2xl font-bold text-center">로고</h1>
            </header>

            <div className="flex-1 flex">
                <aside className="w-64 bg-gray-100 p-4 space-y-2">
                    <div>
                        <button
                            className="w-full flex items-center"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                                <ChevronRight className="mr-2 h-4 w-4"/>}
                            결재함
                        </button>
                        {isExpanded && (
                            <div className="ml-8 space-y-2 mt-2">
                                {categories.map((category, index) => (
                                    category.split(',').map((item, subIndex) => (
                                        <button className="w-full" key={`${index}-${subIndex}`}>
                                            {item}
                                        </button>
                                    ))
                                ))}
                            </div>
                        )}
                    </div>
                </aside>
                <main className="flex-1 p-4">
                    <div className="flex justify-start space-x-2 mb-4">
                        <button className="w-[80px] h-[40px] bg-gray-200 hover:bg-gray-400 rounded"
                                onClick={handleHome}>목록
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">결재 문서 상세</h1>

                    <div className="border border-black rounded p-2 mt-[63px]">
                        <div className="flex">
                            <div>
                                <div className="flex">
                                    <div
                                        className="border rounded text-center p-2 mr-2 mb-2 w-[70px] text-sm font-bold text-gray-600 text-left">{sign.signCateCode}</div>
                                    <input type="text" className="w-[1087px] p-2 border rounded mb-2"
                                           value={sign.title} readOnly/>
                                </div>
                                {isToggled ? (
                                    <form>
                                        {/* ... form content ... */}
                                        {/* Rest of your form elements go here */}
                                    </form>
                                ) : (
                                    <div className="flex mb-2">
                                        <textarea className="p-1 w-[1200px] h-[400px] border border-black rounded"
                                                  value={sign.content} readOnly/>
                                    </div>
                                )}
                                <div>
                                    <div className="flex justify-between mb-4 w-[1200px] p-2 border rounded">
                                        <div className="flex items-center">
                                            <Paperclip className="h-5 w-5 mr-2"/>
                                            <span className="whitespace-nowrap mr-1">첨부파일: </span>
                                            <span onClick={() => handleDocumentDownload(sign)}
                                                  className={'cursor-pointer text-indigo-600 hover:text-indigo-500 hover:underline hover:underline-offset-1'}>
                                                  {sign.fileOriginalName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col ml-2">
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
                                        <tr>
                                            <td>1</td>
                                            <td>{user.empName}</td>
                                            <td>{user.depCode}</td>
                                            <td>{user.posCode}</td>
                                            <td>기안</td>
                                        </tr>
                                    {userInfo.map((user, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 2}</td>
                                                <td>{user.name}</td>
                                                <td>{user.dep}</td>
                                                <td>{user.pos}</td>
                                                <td>{user.sign}</td>
                                            </tr>
                                        )

                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-[5px]"
                                onClick={consoleSignBtn}
                        >
                            결재승인
                        </button>
                        <button className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 ml-[5px]">
                            목록으로
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
