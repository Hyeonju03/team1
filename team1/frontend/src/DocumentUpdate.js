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

export default function DocumentUpdate() {
    const [doc, setDoc] = useState({
        docCateCode: '',
        title: '',
        content: '',
        filename: '',
        fileOriginName: '',
        filesize: '',
        filepath: ''
    });
    const {id} = useParams(); // 여기서 id는 docNum을 의미
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]); // 카테고리 상태 추가
    const [isExpanded, setIsExpanded] = useState(false);
    const [attachment, setAttachment] = useState(null); // 새로운 첨부파일 상태 추가


    // 문서 정보 및 카테고리 가져오기
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

    // 입력된 값 변경하는 것
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setDoc({
            ...doc, [name]: value // 입력된 값을 수정된 상태에 반영
        });
    };

    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        setAttachment(e.target.files[0]);
    };

    // 수정 요청
    const handleUpdate = () => {
        const formData = new FormData();
        formData.append("title", doc.title);
        formData.append("category", doc.docCateCode);
        formData.append("content", doc.content);
        if (attachment) {
            formData.append("attachment", attachment); // 새로운 파일 추가
        }

        // doc 객체의 내용을 출력하여 확인
        console.log("Document to update:", {
            title: doc.title,
            category: doc.docCateCode,
            content: doc.content,
            attachment: attachment ? attachment.name : "No attachment" // 첨부파일 이름 또는 "No attachment" 출력
        });

        axios.put(`/documents/${id}`, formData, {headers: {"Content-Type": "multipart/form-data"}})
            .then((response) => {
                console.log("response 콘솔 찍은거: ", response)
                alert("성공적으로 수정되었습니다.");
                navigate(`/documents/${id}`); // 수정 후 상세 페이지로 이동
            })
            .catch(error => console.log(error));
    };

    // 취소 버튼 클릭 시 상세 페이지로 이동
    const handleCancel = () => {
        navigate(`/documents/${id}`); // 상세 페이지로 이동
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
                    <h1 className="text-2xl font-bold mb-4">문서 수정</h1>

                    <div className="border rounded-lg p-4">


                        <div className="flex items-center space-x-4 mb-4">
                            <div className="mb-4">
                                <label className="flex justify-start block text-sm font-bold mb-2">카테고리</label>
                                <select
                                    name="docCateCode"
                                    value={doc.docCateCode}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    {/*<option value="">카테고리를 선택하세요</option>*/}
                                    {categories.map((cate, index) => (
                                        // 카테고리가 ','로 구분된 경우 이를 개별적으로 렌더링
                                        cate.split(',').map((item, subIndex) => (
                                            <option key={`${index}-${subIndex}`} value={item}>
                                                {item}
                                            </option>
                                        ))
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="flex justify-start block text-sm font-bold mb-2">제목</label>
                                <Input
                                    type="text"
                                    name="title"
                                    value={doc.title}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="flex justify-start block text-sm font-bold mb-2">첨부파일명</label>
                            <input type="file" onChange={handleFileChange}
                                   className="w-full border rounded px-3 py-2"/>
                        </div>
                        <div className="mb-4">
                            <label className="flex justify-start block text-sm font-bold mb-2">내용</label>
                            <textarea
                                name="content"
                                value={doc.content}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={handleCancel}>취소</Button>
                        <Button variant="outline" onClick={handleUpdate}>수정</Button>
                    </div>
                </main>
            </div>
        </div>
    );
}