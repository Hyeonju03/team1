import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronRight, Paperclip, Search, Mail} from 'lucide-react';
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

export default function EmailSend() {
    const [empCode,setEmpCode] = useState("")
    const [isExpanded, setIsExpanded] = useState(false);
    const [errors, setErrors] = useState({});
    const [attachment, setAttachment] = useState(null);

    const emailData = {
        sender: 'sender@example.com',
        recipient: 'recipient@example.com',
        subject: '회의 일정 안내',
        attachments: ['회의안건.pdf', '참석자명단.xlsx'],
        content: '안녕하세요,\n\n내일 오후 2시에 회의가 예정되어 있습니다. 첨부된 파일을 확인해 주시기 바랍니다.\n\n감사합니다.',
    };

    const [formData, setFormData] = useState({
        to: '',
        cc:'',
        title: '',
        file:null,
        content: '',
        fileName: '',
        fileSize: '',
        attachment: null,
    });

    //로그인시 empcode를 일단 가져오는코드
    useEffect(() => {
        // 로그인 후 empCode를 설정하는 로직
        const fetchEmpCode = async () => {
            // 여기에서 실제 empCode를 설정
            const loggedInEmpCode = "2048209555-dffdsfd"; // 로그인 후 받아온 empCode
            setEmpCode(loggedInEmpCode);
        };
        fetchEmpCode();
    }, []);


    useEffect(() => {
        const fetchData = async ()=> {
            if (empCode) { // empCode가 설정된 경우에만 호출
                try {
                    const response = await axios.get(`/selectEmpCode?empCode=${empCode}`); // 공백 제거
                    console.log(response.data);


                } catch (error) {
                    console.error(error.response ? error.response.data : error.message);
                }
            }
        }
        fetchData();
    }, [empCode]);

    const handleChange = (e)=>{
        const { name, value, type, files } = e.target;


        if (type === 'file') {
            const file = files[0];
            console.log(file.name);

            setAttachment(file);
            setFormData(prev => ({
                ...prev,
                [name]: file,
                fileName: file.name,
                fileSize: file.size,
            }));
        } else {
            // 일반 입력인 경우
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        setErrors(prev => ({ ...prev, [name]: '' })); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData);

        const dataToSubmit = new FormData();
        dataToSubmit.append('empCode', empCode); // empCode 추가
        dataToSubmit.append('mailTarget', formData.to); // 받는 사람
        dataToSubmit.append('mailRef', formData.cc); // 참조
        dataToSubmit.append('title', formData.title); // 제목
        dataToSubmit.append('content', formData.content); // 내용
        dataToSubmit.append('fileName', formData.fileName); // 파일 이름

        // 파일이 선택된 경우에만 추가
        if (formData.file) {
            console.log("파일추가")
            console.log(attachment);
            dataToSubmit.append('fileOriginalName', formData.file.name); // 원본 파일 이름
            dataToSubmit.append('fileSize', formData.fileSize); // 파일 크기
            dataToSubmit.append('filePath', '...'); // 파일 경로
            dataToSubmit.append('file', formData.file); // 파일 데이터 추가
            dataToSubmit.append('attachment', attachment);
        } else {
            // 파일이 선택되지 않았을 경우에 대한 처리
            console.error('파일이 선택되지 않았습니다.');
            console.log(formData.file)
        }


        console.log(dataToSubmit);

        try {
            // const response = await axios.post('/mailSend', dataToSubmit);

        } catch (error) {
            console.error('Error uploading data:', error);

        }
    };
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gray-200 p-4">
                <h1 className="text-2xl font-bold text-center">로고</h1>
            </header>
            <div className="flex-1 flex">
                <aside className="w-64 bg-gray-100 p-4 space-y-2">
                    <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">메일쓰기</Button>
                        <Button variant="outline" className="flex-1">내게쓰기</Button>
                    </div>

                    <Button variant="ghost" className="w-full">첨부파일메일함</Button>
                    <Button variant="ghost" className="w-full">받은메일함</Button>
                    <Button variant="ghost" className="w-full">보낸메일함</Button>
                    <Button variant="ghost" className="w-full">내게쓴메일함</Button>
                    <div>
                        <Button
                            variant="ghost"
                            className="w-full flex items-center"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                                <ChevronRight className="mr-2 h-4 w-4"/>}
                            <Mail className="mr-2 h-4 w-4"/>
                            내 메일함
                        </Button>
                        {isExpanded && (
                            <div className="ml-8 space-y-2 mt-2">
                                <Button variant="ghost" className="w-full">카테고리 1</Button>
                                <Button variant="ghost" className="w-full">카테고리 2</Button>
                            </div>
                        )}
                    </div>
                    <Button variant="ghost" className="w-full">휴지통</Button>
                </aside>
                <div className="flex flex-1 items-center justify-center" style={{marginTop:'-80px' , marginLeft:'-250px'}}>
                <form onSubmit={handleSubmit} className="space-y-4" style={{ justifyContent:'center'}}>

                    {/*받는사람*/}
                    <div className="flex space-x-8" style={{marginTop: '20px'}}>
                        <label htmlFor="to"
                               className="block font-medium text-gray-700 mb-1">받는사람</label>
                        <Input onChange={handleChange} id="to"  name="to" value={formData.to} placeholder="받는사람을 입력해주세요."
                               style={{height: '40px', width: '800px'}}/>
                    </div>

                    {/*참조*/}
                    <div className="flex space-x-8" >
                        <label htmlFor="cc"
                               className="block font-medium text-gray-700 mb-1">참조</label>
                        <Input onChange={handleChange} id="cc" name="cc" value={formData.cc} placeholder="참조를 입력해주세요."
                               style={{height: '40px', width: '800px', marginLeft: '63px'}}/>
                    </div>

                    {/*제목*/}
                    <div className="flex space-x-8" >
                        <label htmlFor="title"
                               className="block font-medium text-gray-700 mb-1">제목</label>
                        <Input onChange={handleChange} id="title" name="title" value={formData.title} placeholder="제목을 입력해주세요."
                               style={{height: '40px', width: '800px', marginLeft: '63px'}}/>
                    </div>

                    {/*파일첨부*/}
                    <div className="flex space-x-8" >
                        <label htmlFor="file"
                               className="block font-medium text-gray-700 mb-1">파일첨부</label>
                        <Input onChange={handleChange} id="file" type="file" name="file"
                               style={{height: '50px', width: '800px'}}/>
                    </div>

                    {/*내용*/}
                    <div className="flex space-x-8">
                        <label htmlFor="content"
                               className="block font-medium text-gray-700 mb-1">내용</label>
                        <Input onChange={handleChange} id="content" name="content" value={formData.content} placeholder="내용을 입력해주세요."
                               style={{height: '500px' , width:'800px ' , marginLeft:'63px'}}/>
                    </div>

                    <div className="flex justify-center space-x-4 text-center" style={{marginLeft:'50px'}}>
                        <Button type={"submit"} className="border">보내기</Button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}

