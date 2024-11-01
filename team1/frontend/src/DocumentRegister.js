import React, {useState} from 'react';
import {ChevronDown, ChevronRight, Paperclip} from 'lucide-react';
import {useLocation, useNavigate} from "react-router-dom";
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

export default function DocumentRegister() {
    const [isExpanded, setIsExpanded] = useState(true);
    const location = useLocation(); // location 객체를 사용하여 이전 페이지에서 전달된 데이터 수신
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(location.state?.selectedCategory || ''); // location.state : 이전페이지에서 전달된 상태 객체
    const [codeCategory] = useComCode();
    const [content, setContent] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [categories, setCategories] = useState([]); // 카테고리 상태 추가
    const navigate = useNavigate();
    const [empCode, setEmpCode] = useState(process.env.REACT_APP_COM_CODE);

    const handleFileChange = (event) => {
        setAttachment(event.target.files[0]); // 선택한 파일 상태 업데이트
    }

    // 유효성체크
    const validateForm = () => {
        if (!category) {
            alert("카테고리를 선택해주세요.");
            return false;
        }
        if (!title) {
            alert("제목을 입력해주세요.");
            return false;
        }
        if (!attachment) {
            alert("첨부파일을 선택해주세요.");
            return false;
        }
        if (!content) {
            alert("설명을 입력해주세요.");
            return false;
        }
        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('content', content);
        if (attachment) {
            formData.append('attachment', attachment);
        }
        formData.append('empCode', empCode);

        axios.post('/documents', formData)
            .then(response => {
                console.log(response.data);
                // 성공시 문서 리스트로 이동
                navigate('/documents');
            })
            .catch(error => {
                console.error('Error fetching documents:', error);
            });
    };

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
                            문서함
                        </Button>
                        {isExpanded && (
                            <div className="ml-8 shandleDelete pace-y-2 mt-2">
                                {codeCategory && codeCategory.docCateCode && codeCategory.docCateCode.split(',').map((item, index) => (
                                        <Button variant="ghost" className="w-full" key={`${item}`}
                                                onClick={() => setCategory(item)}>
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
                                            {codeCategory && codeCategory.docCateCode && codeCategory.docCateCode.split(',').map((item, index) => (
                                                <option key={`${item}`} value={item}>
                                                    {item}
                                                </option>
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
                            <Button variant="outline" onClick={handleHome}>취소</Button>
                            <Button variant="outline" type="submit">등록</Button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}