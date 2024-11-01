import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronRight} from 'lucide-react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import useComCode from "hooks/useComCode";

const Button = ({variant, className, children, ...props}) => {
    const baseClass = "px-4 py-2 rounded text-left";
    const variantClass = variant === "outline" ? "border border-gray-300" : "text-gray-700";
    return (
        <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
            {children}
        </button>
    );
};

const Input = ({className, ...props}) => {
    return <input className={`border rounded px-3 py-2 ${className}`} {...props} />;
};

export default function DocumentDetail() {
    const [isExpanded, setIsExpanded] = useState(true);
    const {id} = useParams(); // 여기서 id는 docNum을 의미
    const [doc, setDoc] = useState(null);
    // const [codeCategory, setCodeCategory] = useState([]); // 카테고리 상태 추가
    const [codeCategory] = useComCode();
    const [loading, setLoading] = useState(true); // 상세 페이지 로딩 상태 추가
    const navigate = useNavigate();

    // const data = {
    //     키:값
    //     키:값
    // }
    // const response = await axios.get(`/documents/${id}`,{params:벨류})
    
    useEffect(() => {
        async function documentDetail() {
            try {
                const response = await axios.get(`/documents/${id}`) // 여기서 id는 docNum 값
                setDoc(response.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false); // 로딩이 끝남
            }
        }

        documentDetail();
    }, [id]);

    // 문서가 로딩 중일 때는 아무것도 표시하지 않음
    if (loading) {
        return null;
    }

    // 문서를 찾을 수 없는 경우의 처리
    if (!doc) {
        return null; // 문서가 없을 경우도 아무것도 표시하지 않음
    }

    const formatDate = (dateString) => {
        return dateString.replace("T", " ").slice(0, 16); // LocalDateTime의 기본 형식을 변경
    };

    const fileDownload = (blobData, fileName) => {
        const url = window.URL.createObjectURL(blobData);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.fileOriginName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
    }

    const handleDocumentDownload = async (doc) => {
        try {
            const response = await axios({
                method: "get",
                url: `/documents/download/${doc.docNum}`,
                responseType: "blob"
            });
            fileDownload(response.data, doc.fileOriginName);
        } catch (e) {
            console.error(e);
        }
        // 2번째 방법
        // axios.get(`/documents/download/${document.docNum}`) // API 엔드포인트를 조정하세요
        //     .then(response => {
        //         console.log(response);
        //     })
        //     .catch(error => console.log(error));
    }

    // 수정
    const handleUpdateClick = () => {
        navigate(`/documents/update/${id}`);  // 수정 버튼 클릭 시 수정 페이지로 이동
    };

    // 삭제
    const handleDeleteClick = async () => {
        try {
            await axios.delete(`/documents/${id}`)
            navigate(`/documents/`); // 삭제 후 문서 리스트로 이동
            alert("성공적으로 삭제되었습니다.")

        } catch (e) {
            console.error(e);
            alert("삭제에 실패했습니다.");
        }
    }

    // 목록 버튼 클릭 시 리스트 페이지로 이동
    const handleHome = () => {
        navigate(`/documents/`);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gray-200 p-4">
                <h1 className="text-2xl font-bold text-center">로고</h1>
            </header>
            <div className="flex-1 flex">
                <aside className="w-64 bg-gray-100 p-4 space-y-2">

                    <div>
                        <Button
                            variant="ghost"
                            className="w-full flex items-center"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                                <ChevronRight className="mr-2 h-4 w-4"/>}
                            {/*<Mail className="mr-2 h-4 w-4"/>*/}
                            문서함
                        </Button>
                        {isExpanded && (
                            <div className="ml-8 space-y-2 pace-y-2 mt-2">
                                {codeCategory && codeCategory.docCateCode && codeCategory.docCateCode.split(',').map((item, index) => (
                                        <Button variant="ghost" className="w-full" key={`${item}`}>
                                            {item}
                                        </Button>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                </aside>
                <main className="flex-1 p-4">
                    <div className="flex justify-start space-x-2 mb-4">
                        <Button variant="outline" onClick={handleHome}>목록</Button>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">문서 상세</h1>

                    <div className="border rounded-lg p-4">
                        <div className="flex items-center space-x-4 mb-4">

                            <div className="text-sm font-bold text-gray-600 text-left">{doc.docCateCode}</div>
                            <h2 className="text-2xl font-bold mb-4 text-left">{doc.title}</h2>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2"></h3>
                            <p className="whitespace-pre-wrap text-left"><span
                                className="font-semibold">등록일 : </span>{formatDate(doc.startDate)}
                            </p>
                        </div>
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2"></h3>
                            <p className="whitespace-pre-wrap text-left"><span
                                className="font-semibold">첨부파일명 : </span>
                                <span onClick={() => handleDocumentDownload(doc)}
                                      className={'cursor-pointer text-indigo-600 hover:text-indigo-500 hover:underline hover:underline-offset-1'}>{doc.fileOriginName}</span>
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2"></h3>
                            <p className="whitespace-pre-wrap text-left"><span
                                className="font-semibold">설명 : </span>{doc.content}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={handleUpdateClick}>수정</Button>
                        <Button variant="outline" onClick={handleDeleteClick}>삭제</Button>
                    </div>
                </main>
            </div>
        </div>
    );
}