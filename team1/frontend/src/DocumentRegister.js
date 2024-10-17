import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronRight, Paperclip, Search, Mail} from 'lucide-react';
import {useNavigate} from "react-router-dom";
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

export default function DocumentRegister() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [categories, setCategories] = useState([]); // 카테고리 상태 추가
    const nevigate = useNavigate();

    useEffect(() => {
        // code 테이블에서 카테고리 가져오기
        axios.get(`/code`) // API 엔드포인트를 조정하세요
            .then(response => {
                console.log(response.data);
                // 응답이 카테고리 배열이라고 가정할 때
                const uniqueCategories = [...new Set(response.data.map(category => category.docCateCode))]; // 중복 제거
                setCategories(uniqueCategories); // 카테고리 상태에 저장
            })
            .catch(error => console.log(error));
    }, []);

    const handleFileChange = (event) => {
        setAttachment(event.target.files[0]); // 선택한 파일 상태 업데이트
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('content', content);
        if (attachment) {
            formData.append('attachment', attachment);
        }

        axios.post('/documents', formData)
            .then(response => {
                console.log(response.data);
                // 성공시 문서 리스트로 이동
                nevigate('/documents');
            })
            .catch(error => {
                console.error('Error fetching documents:', error);
            });
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
                            <div className="ml-8 shandleDelete pace-y-2 mt-2">
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
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex flex-1 max-w-xl">
                            <Input type="text" placeholder="문서 검색 칸" className="pl-10 pr-4 w-full"/>
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                        </div>
                        <Button variant="outline">검색</Button>
                    </div>

                    <h1 className="text-2xl font-bold mb-4">문서 등록</h1>
                    <form onSubmit={handleSubmit}>
                        <div key={document.id} className="border rounded-lg p-4">
                            <div className="flex items-center space-x-4 mb-4">
                                <fieldset>
                                    {/*<legend>카테고리</legend>*/}
                                    <div>
                                        <select name="category" value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="border rounded p-2">
                                            <option value="">카테고리</option>
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
                                </fieldset>

                                <input type="text" className="w-full p-2 border rounded mb-2"
                                       placeholder="제목을 입력하세요" value={title}
                                       onChange={(e) => setTitle(e.target.value)}/>
                            </div>
                            <div className="flex justify-between mb-4 w-full p-2 border rounded">
                                <div className="flex items-center">
                                    <Paperclip className="h-5 w-5 mr-2"/>
                                    <span className="whitespace-nowrap">첨부파일</span>
                                    <input type="file" className="m-1" onChange={handleFileChange}/>
                                </div>
                                <div> {attachment ?
                                    `${(attachment.size / 1024).toFixed(2)} KB / 10 MB` :
                                    '0 KB / 10 MB'}</div>
                            </div>
                            <textarea

                                className="w-full h-64 p-2 border rounded"
                                placeholder="설명을 입력하세요"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" type="submit">등록</Button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}