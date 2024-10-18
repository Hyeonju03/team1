import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronRight} from 'lucide-react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

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
    const [isExpanded, setIsExpanded] = useState(false);
    const {id} = useParams(); // 여기서 id는 docNum을 의미
    const [doc, setDoc] = useState(null);
    const [categories, setCategories] = useState([]); // 카테고리 상태 추가
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/documents/${id}`) // 여기서 id는 docNum 값
            .then(response => {
                setDoc(response.data);
            })
            .catch(error => console.log(error));

        // code 테이블에서 카테고리 가져오기
        axios.get(`/code`) // API 엔드포인트를 조정하세요
            .then(response => {
                // console.log(response.data);
                // 응답이 카테고리 배열이라고 가정할 때
                const uniqueCategories = [...new Set(response.data.map(category => category.docCateCode))]; // 중복 제거
                setCategories(uniqueCategories); // 카테고리 상태에 저장
            })
            .catch(error => console.log(error));

    }, [id]);

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

    if (!doc) {
        return <div>문서를 찾을 수 없습니다.</div>; // 문서를 찾을 수 없는 경우의 처리

    }

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
                                {categories.map((category, index) => (
                                    // 각 카테고리를 ','로 나누고 각 항목을 한 줄씩 출력
                                    category.split(',').map((item, subIndex) => (
                                        <Button variant="ghost" className="w-full" key={`${index}-${subIndex}`}>
                                            {item}
                                        </Button>
                                    ))
                                ))}
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